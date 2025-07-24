import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getFirestore, collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

const PaginatedPostsContext = createContext();

export const PaginatedPostsProvider = ({
  children,
  pageSize = 6,
  collectionName = 'questions',
  orderField = 'createdAt',
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageStarts, setPageStarts] = useState([]);

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
    setLoading(true);
    setError(null);
    try {
      let lastDoc = null;
      // Jeśli idziemy na dalszą stronę i nie mamy referencji, pobierz po kolei
      if (page > 1 && !pageStarts[page - 2]) {
        let prevLastDoc = null;
        for (let i = 1; i < page; i++) {
          let q = query(
            collection(db, collectionName),
            orderBy(orderField, 'desc'),
            ...(prevLastDoc ? [startAfter(prevLastDoc)] : []),
            limit(pageSize)
          );
          const snap = await getDocs(q);
          if (snap.docs.length > 0) {
            prevLastDoc = snap.docs[snap.docs.length - 1];
            setPageStarts(prev => {
              const newStarts = [...prev];
              newStarts[i - 1] = prevLastDoc;
              return newStarts;
            });
          } else {
            break;
          }
        }
      }
      let q = query(
        collection(db, collectionName),
        orderBy(orderField, 'desc'),
        ...(page > 1 && pageStarts[page - 2] ? [startAfter(pageStarts[page - 2])] : []),
        limit(pageSize)
      );
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setPosts(fetchedPosts);
      if (snapshot.docs.length > 0) {
        setPageStarts(prev => {
          const newStarts = [...prev];
          newStarts[page - 1] = snapshot.docs[snapshot.docs.length - 1];
          return newStarts;
        });
      }
    } catch (err) {
      console.error('Error fetching page:', err);
      setError(err);
    }
    setLoading(false);
  }, [collectionName, orderField, pageSize, pageStarts, totalPages]);

  useEffect(() => {
    fetchPage(currentPage);
  }, [fetchPage, currentPage]);

  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const value = {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPrevPage
  };

  return (
    <PaginatedPostsContext.Provider value={value}>
      {children}
    </PaginatedPostsContext.Provider>
  );
};

export const usePaginatedPostsContext = () => useContext(PaginatedPostsContext);