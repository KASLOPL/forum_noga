import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getFirestore, collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

const PaginatedPostsContext = createContext();

// Mapowanie opcji sortowania na pola Firestore
const getSortConfig = (sortOption) => {
  if (!sortOption) return { field: 'createdAt', direction: 'desc' };
  
  switch (sortOption.value) {
    case 'newest':
      return { field: 'createdAt', direction: 'desc' };
    case 'upvoted':
      return { field: 'likes', direction: 'desc' };
    case 'answered':
      return { field: 'responders', direction: 'desc' };
    case 'viewed':
      return { field: 'views', direction: 'desc' };
    case 'solved':
      return { field: 'solved', direction: 'desc' };
    default:
      return { field: 'createdAt', direction: 'desc' };
  }
};

export const PaginatedPostsProvider = ({
  children,
  pageSize = 2,
  collectionName = 'questions',
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageStarts, setPageStarts] = useState(new Map());
  const [lastFetchedPage, setLastFetchedPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentSort, setCurrentSort] = useState({ value: 'newest', label: 'Newest first' });

  // Liczba wszystkich dokumentów (do paginacji)
  useEffect(() => {
    async function fetchCount() {
      try {
        const coll = collection(db, collectionName);
        const snapshot = await getCountFromServer(coll);
        const total = snapshot.data().count;
        const calculatedPages = Math.max(1, Math.ceil(total / pageSize));
        
        setTotalCount(total);
        setTotalPages(calculatedPages);
      } catch (err) {
        console.error('Error fetching count:', err);
        setError(err);
      }
    }
    fetchCount();
  }, [collectionName, pageSize]);

  // Pobieranie postów na daną stronę z aktualnym sortowaniem
  const fetchPage = useCallback(async (page, sortOption = currentSort) => {
    if (loading || page === lastFetchedPage) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const sortConfig = getSortConfig(sortOption);
      let q;
      
      if (page === 1) {
        // Pierwsza strona - zawsze pobieramy od początku
        q = query(
          collection(db, collectionName),
          orderBy(sortConfig.field, sortConfig.direction),
          limit(pageSize)
        );
      } else {
        // Dla innych stron sprawdzamy czy mamy już punkt startowy dla tego sortowania
        const sortKey = `${sortOption.value}_${page - 1}`;
        const startDoc = pageStarts.get(sortKey);
        
        if (!startDoc) {
          // Jeśli nie mamy punktu startowego, musimy go znaleźć
          await buildPageStarts(page, sortOption);
          const newStartDoc = pageStarts.get(sortKey);
          
          q = query(
            collection(db, collectionName),
            orderBy(sortConfig.field, sortConfig.direction),
            ...(newStartDoc ? [startAfter(newStartDoc)] : []),
            limit(pageSize)
          );
        } else {
          // Mamy punkt startowy, używamy go
          q = query(
            collection(db, collectionName),
            orderBy(sortConfig.field, sortConfig.direction),
            startAfter(startDoc),
            limit(pageSize)
          );
        }
      }

      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setPosts(fetchedPosts);
      setLastFetchedPage(page);
      
      // Zapisujemy punkt końcowy tej strony dla następnej z kluczem zawierającym sortowanie
      if (snapshot.docs.length > 0) {
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        const sortKey = `${sortOption.value}_${page}`;
        setPageStarts(prev => new Map(prev).set(sortKey, lastDoc));
      }
      
    } catch (err) {
      console.error('Error fetching page:', err);
      setError(err);
    }
    
    setLoading(false);
  }, [collectionName, pageSize, pageStarts, loading, lastFetchedPage, currentSort]);

  // Pomocnicza funkcja do budowania punktów startowych dla konkretnego sortowania
  const buildPageStarts = useCallback(async (targetPage, sortOption) => {
    const sortConfig = getSortConfig(sortOption);
    const newPageStarts = new Map(pageStarts);
    let currentDoc = null;
    
    for (let i = 1; i < targetPage; i++) {
      const sortKey = `${sortOption.value}_${i}`;
      if (newPageStarts.has(sortKey)) {
        currentDoc = newPageStarts.get(sortKey);
        continue;
      }
      
      const q = query(
        collection(db, collectionName),
        orderBy(sortConfig.field, sortConfig.direction),
        ...(currentDoc ? [startAfter(currentDoc)] : []),
        limit(pageSize)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.docs.length > 0) {
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        newPageStarts.set(sortKey, lastDoc);
        currentDoc = lastDoc;
      } else {
        break;
      }
    }
    
    setPageStarts(newPageStarts);
  }, [collectionName, pageSize, pageStarts]);

  // Funkcja do zmiany sortowania
  const changeSort = useCallback(async (newSortOption) => {
    setCurrentSort(newSortOption);
    setCurrentPage(1);
    setPageStarts(new Map()); // Czyścimy cache punktów startowych
    setLastFetchedPage(null);
    
    // Pobieramy pierwszą stronę z nowym sortowaniem
    await fetchPage(1, newSortOption);
  }, [fetchPage]);

  // Reset przy zmianie konfiguracji
  useEffect(() => {
    setPageStarts(new Map());
    setLastFetchedPage(null);
    setCurrentPage(1);
  }, [collectionName, pageSize]);

  // Pobieranie strony przy zmianie currentPage (ale nie przy pierwszym załadowaniu)
  useEffect(() => {
    if (currentPage === 1 && !posts.length) {
      // Pierwsza strona, pierwsze załadowanie
      fetchPage(currentPage);
    } else if (currentPage !== 1 || posts.length > 0) {
      // Zmiana strony lub już mamy dane
      fetchPage(currentPage);
    }
  }, [currentPage, fetchPage]);

  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages || loading) return;
    setCurrentPage(page);
  }, [totalPages, loading]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages, loading]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1 && !loading) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, loading]);

  const value = {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    currentSort,
    goToPage,
    goToNextPage,
    goToPrevPage,
    setCurrentPage,
    changeSort
  };

  return (
    <PaginatedPostsContext.Provider value={value}>
      {children}
    </PaginatedPostsContext.Provider>
  );
};

export const usePaginatedPostsContext = () => useContext(PaginatedPostsContext);