import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Funkcja do pobierania danych użytkownika
export async function fetchUserData(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log("Dane użytkownika:", userData);
      return userData;
    } else {
      console.log("Nie znaleziono dokumentu użytkownika");
      return null;
    }
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
    return null;
  }
}

// Funkcja do zapisywania danych użytkownika
export async function saveUserData(uid, userData) {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, userData, { merge: true });
    console.log("Dane użytkownika zostały zapisane");
    return true;
  } catch (error) {
    console.error("Błąd podczas zapisywania danych:", error);
    return false;
  }
}
