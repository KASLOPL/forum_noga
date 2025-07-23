
import { getAuth, sendEmailVerification, applyActionCode } from "firebase/auth";

// Wyślij link weryfikacyjny na email aktualnie zalogowanego użytkownika
export async function sendVerificationEmail() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Brak zalogowanego użytkownika");
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

// Potwierdź email na podstawie kodu z linku (actionCode)
export async function confirmEmailVerification(actionCode) {
  const auth = getAuth();
  try {
    await applyActionCode(auth, actionCode);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
