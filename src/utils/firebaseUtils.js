// src/utils/firebaseUtils.js
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  where,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

// Funkcja pomocnicza do formatowania czasu
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'przed chwilą';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min temu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} godz. temu`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} dni temu`;
  }
};

// Funkcja pomocnicza do przetwarzania danych pytania
const processQuestionData = (doc) => {
  const data = doc.data();
  const createdAt = data.createdAt?.toDate?.() || new Date();
  
  return {
    id: doc.id,
    ...data,
    createdAt,
    timeAgo: getTimeAgo(createdAt),
    // Zapewnienie że wszystkie wymagane pola istnieją
    likes: data.likes || 0,
    views: data.views || 0,
    responders: data.responders || 0,
    tags: data.tags || [],
    content: data.content || '',
    fullContent: data.fullContent || data.content || ''
  };
};

// Dodawanie nowego pytania
export const addQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(collection(db, 'questions'), {
      ...questionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      views: 0,
      responders: 0
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding question:', error);
    return { success: false, error: error.message };
  }
};

// Pobieranie wszystkich pytań (posortowane od najnowszych)
export const getAllQuestions = async () => {
  try {
    const q = query(
      collection(db, 'questions'), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const questions = [];
    
    querySnapshot.forEach((doc) => {
      questions.push(processQuestionData(doc));
    });
    
    return { success: true, questions };
  } catch (error) {
    console.error('Error getting questions:', error);
    return { success: false, error: error.message, questions: [] };
  }
};

// Pobieranie pytań konkretnego użytkownika
export const getUserQuestions = async (username) => {
  try {
    const q = query(
      collection(db, 'questions'),
      where('author', '==', username),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const questions = [];
    
    querySnapshot.forEach((doc) => {
      questions.push(processQuestionData(doc));
    });
    
    return { success: true, questions };
  } catch (error) {
    console.error('Error getting user questions:', error);
    return { success: false, error: error.message, questions: [] };
  }
};

// Pobieranie pojedynczego pytania po ID
export const getQuestionById = async (questionId) => {
  try {
    const docRef = doc(db, 'questions', questionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        question: processQuestionData(docSnap) 
      };
    } else {
      return { 
        success: false, 
        error: 'Question not found' 
      };
    }
  } catch (error) {
    console.error('Error getting question:', error);
    return { success: false, error: error.message };
  }
};

// Zwiększanie liczby wyświetleń
export const incrementViews = async (questionId) => {
  try {
    const questionRef = doc(db, 'questions', questionId);
    await updateDoc(questionRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { success: false, error: error.message };
  }
};

// Polubienie pytania
export const likeQuestion = async (questionId) => {
  try {
    const questionRef = doc(db, 'questions', questionId);
    await updateDoc(questionRef, {
      likes: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error liking question:', error);
    return { success: false, error: error.message };
  }
};

// Usunięcie polubienia (nowa funkcja)
export const unlikeQuestion = async (questionId) => {
  try {
    const questionRef = doc(db, 'questions', questionId);
    await updateDoc(questionRef, {
      likes: increment(-1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error unliking question:', error);
    return { success: false, error: error.message };
  }
};

// Aktualizacja liczby odpowiadających
export const updateResponders = async (questionId, increment_value = 1) => {
  try {
    const questionRef = doc(db, 'questions', questionId);
    await updateDoc(questionRef, {
      responders: increment(increment_value)
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating responders:', error);
    return { success: false, error: error.message };
  }
};

// Usuwanie pytania
export const deleteQuestion = async (questionId) => {
  try {
    await deleteDoc(doc(db, 'questions', questionId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, error: error.message };
  }
};

// Funkcja pomocnicza do walidacji danych pytania
export const validateQuestionData = (questionData) => {
  const errors = [];
  
  if (!questionData.title?.trim()) {
    errors.push('Tytuł jest wymagany');
  }
  
  if (!questionData.content?.trim()) {
    errors.push('Treść pytania jest wymagana');
  }
  
  if (!questionData.category?.trim()) {
    errors.push('Kategoria jest wymagana');
  }
  
  if (!questionData.tags || questionData.tags.length === 0) {
    errors.push('Przynajmniej jeden tag jest wymagany');
  }
  
  if (!questionData.author?.trim()) {
    errors.push('Autor jest wymagany');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Eksport wszystkich funkcji jako obiekt (opcjonalnie)
export default {
  addQuestion,
  getAllQuestions,
  getUserQuestions,
  getQuestionById,
  incrementViews,
  likeQuestion,
  unlikeQuestion,
  updateResponders,
  deleteQuestion,
  validateQuestionData
};