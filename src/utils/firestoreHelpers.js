import { collection, query, where, getDocs, setDoc, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

 export const ensureValueInCollection = async (collectionName, value) => {
  if (!value) return;

  

  const trimmed = value.trim().toLowerCase();

  const q = query(
    collection(db, collectionName),
    where("name", "==", trimmed)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    await setDoc(doc(db, collectionName, trimmed), {
      name: trimmed,
      createdAt: new Date(),
    });
    console.log(`✅ Added "${trimmed}" to "${collectionName}"`);
  }
};

