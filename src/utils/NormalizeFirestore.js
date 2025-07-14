import React, { useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const NormalizeFirestore = () => {
  useEffect(() => {
    const normalizeCollection = async (collectionName) => {
      const snapshot = await getDocs(collection(db, collectionName));

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const original = data.name;
        const normalized = original.toLowerCase().trim();

        if (original !== normalized) {
          await updateDoc(doc(db, collectionName, docSnap.id), {
            name: normalized,
          });
          console.log(`Updated ${collectionName} doc ${docSnap.id}: "${original}" -> "${normalized}"`);
        }
      }
    };

    const normalizeAll = async () => {
      const collectionsToNormalize = ["categories", "series", "materials", "editions"];
      for (const col of collectionsToNormalize) {
        console.log(`Normalizing collection: ${col}`);
        await normalizeCollection(col);
      }
      alert("Normalization complete! Check console.");
    };

    normalizeAll();
  }, []);

  return <div>Normalizing Firestore collections... check console logs.</div>;
};

export default NormalizeFirestore;
