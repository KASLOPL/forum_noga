import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getFirestore, collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } from 'firebase/firestore';
import { app } from '../firebase';
import { getAllQuestions } from '../utils/firebaseUtils';

const db = getFirestore(app);

const PaginatedPostsContext = createContext();


export const PaginatedPostsProvider = ({
  children,
  pageSize = 5,
  collectionName = 'questions',
  orderField = 'createdAt',
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageStarts, setPageStarts] = useState(new Map()); // Używamy Map zamiast array
  const [lastFetchedPage, setLastFetchedPage] = useState(null); // Śledzimy ostatnio pobraną stronę
  const [totalCount, setTotalCount] = useState(0);


  // Liczba wszystkich dokumentów (do paginacji)
  useEffect(() => {
    async function fetchCount() {
      try {
        const coll = collection(db, collectionName);
        const snapshot = await getCountFromServer(coll);
        const total = snapshot.data().count;
        const calculatedPages = Math.max(1, Math.ceil(total / pageSize));
        
        setTotalPages(calculatedPages);
      } catch (err) {
        console.error('Error fetching count:', err);
        setError(err);
      }
    }
    fetchCount();
  }, [collectionName, pageSize]);

  

  // Pobieranie postów na daną stronę
  const fetchPage = useCallback(async (page) => {
    // Zabezpieczenie przed wielokrotnym klikaniem tej samej strony
    if (loading || page === lastFetchedPage) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let q;
      
      if (page === 1) {
        // Pierwsza strona - zawsze pobieramy od początku
        q = query(
          collection(db, collectionName),
          orderBy(orderField, 'desc'),
          limit(pageSize)
        );
      } else {
        // Dla innych stron sprawdzamy czy mamy już punkt startowy
        const startDoc = pageStarts.get(page - 1);
        
        if (!startDoc) {
          // Jeśli nie mamy punktu startowego, musimy go znaleźć
          await buildPageStarts(page);
          const newStartDoc = pageStarts.get(page - 1);
          
          q = query(
            collection(db, collectionName),
            orderBy(orderField, 'desc'),
            ...(newStartDoc ? [startAfter(newStartDoc)] : []),
            limit(pageSize)
          );
        } else {
          // Mamy punkt startowy, używamy go
          q = query(
            collection(db, collectionName),
            orderBy(orderField, 'desc'),
            startAfter(startDoc),
            limit(pageSize)
          );
        }
      }

      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setPosts(fetchedPosts);
      setLastFetchedPage(page);
      
      // Zapisujemy punkt końcowy tej strony dla następnej
      if (snapshot.docs.length > 0) {
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        setPageStarts(prev => new Map(prev).set(page, lastDoc));
      }
      
    } catch (err) {
      console.error('Error fetching page:', err);
      setError(err);
    }
    
    setLoading(false);
  }, [collectionName, orderField, pageSize, pageStarts, loading, lastFetchedPage]);

  // Pomocnicza funkcja do budowania punktów startowych
  const buildPageStarts = useCallback(async (targetPage) => {
    const newPageStarts = new Map(pageStarts);
    let currentDoc = null;
    
    for (let i = 1; i < targetPage; i++) {
      if (newPageStarts.has(i)) {
        currentDoc = newPageStarts.get(i);
        continue;
      }
      
      const q = query(
        collection(db, collectionName),
        orderBy(orderField, 'desc'),
        ...(currentDoc ? [startAfter(currentDoc)] : []),
        limit(pageSize)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.docs.length > 0) {
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        newPageStarts.set(i, lastDoc);
        currentDoc = lastDoc;
      } else {
        break;
      }
    }
    
    setPageStarts(newPageStarts);
  }, [collectionName, orderField, pageSize, pageStarts]);

  // Reset przy zmianie konfiguracji
  useEffect(() => {
    setPageStarts(new Map());
    setLastFetchedPage(null);
    setCurrentPage(1);
  }, [collectionName, orderField, pageSize]);

  // Pobieranie strony przy zmianie currentPage
  useEffect(() => {
    fetchPage(currentPage);
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
    goToPage,
    goToNextPage,
    goToPrevPage,
    setCurrentPage
  };

  return (
    <PaginatedPostsContext.Provider value={value}>
      {children}
    </PaginatedPostsContext.Provider>
  );
};

export const usePaginatedPostsContext = () => useContext(PaginatedPostsContext);