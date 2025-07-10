import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

// Dodanie odpowiedzi
export const addAnswer = async (answerData) => {
  try {
    const docRef = await addDoc(collection(db, "answers"), answerData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding answer:", error);
    return { success: false, error: error.message };
  }
};

// Pobranie odpowiedzi dla danego pytania
export const getAnswersByQuestionId = async (questionId) => {
  try {
    const q = query(
      collection(db, "answers"),
      where("questionId", "==", questionId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const answers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return answers;
  } catch (error) {
    console.error("Error fetching answers:", error);
    return [];
  }
};
