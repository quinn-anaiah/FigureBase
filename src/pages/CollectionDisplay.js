
import BackButton from "../components/BackButton";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, addDoc, Timestamp, query, where } from "firebase/firestore";
import { db } from '../firebase'; // ✅ fix this path

const sampleCollection = [
  {
    id: 1,
    name: "Batman",
    number: "01",
    series: "DC Comics",
    variant: "Glow-in-the-Dark",
    releaseYear: 2019,
    status: "Owned",
    imageUrl: "https://m.media-amazon.com/images/I/91QNOn1uO0L.jpg",
  },
  {
    id: 2,
    name: "Iron Man",
    number: "23",
    series: "Marvel",
    variant: "Classic",
    releaseYear: 2018,
    status: "Wishlist",
    imageUrl: "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwd7f497c9/images/funko/upload/82499_Marvel_NC_IronMan_POP_GLAM-WEB.png?sw=800&sh=800",
  },
];

function CollectionDisplay() {
  const [figuresList, setFiguresList] = useState([]);


  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const q = query(collection(db, "figures"), where("list", "==", "collection"));
        const querySnapshot = await getDocs(q);
        const newFigsList = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();

          newFigsList.push({
            id: doc.id,
            name: data.name,
            modelNumber: data.modelNumber,
            category: data.category,
            edition: data.edition,
            materials: data.material,
            series: data.series,
            bobbleHead: data.bobbleHead,
            vaulted: data.vaulted,
            imageUrl: data.imageUrl,
            owned: data.owned,
            estimatedPriceAtPurchase: data.estimatedPriceAtPurchase || null,
            dateAcquired: new Date(data.dateAcquired) || null,
            count: data.count|| null,
            list: data.list
          });
        }
        setFiguresList(newFigsList);


      } catch (error) {
        console.error("Error getting collection", error);
      }
    }
    fetchCollection();
  }, []);


  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black min-h-screen text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-12 font-sans tracking-tight">
          💜 My Funko Collection
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {figuresList.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-400/30 hover:scale-[1.02] transition duration-300"
            >
              <div className="bg-white h-48 flex items-center justify-center">
                <img
                  src={item.imageUrl || "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="}
                  alt={item.name}
                  className="h-full object-contain p-2"
                />
              </div>

              <div className="p-4 space-y-1">
                <h2 className="text-xl font-bold text-yellow-300">
                  {item.name} #{item.modelNumber}
                </h2>
                <p className="text-sm text-gray-300">
                  Series: <span className="font-medium">{item.series}</span>
                </p>
                <p className="text-sm text-gray-300">
                  Edition: <span className="italic">{item.edition}</span>
                </p>
                <p className="text-sm text-gray-400">Date: {item.dateAcquired?.toLocaleDateString() || "Unknown"}</p>
                {/* <p
                  className={`text-sm font-bold ${item.status === "Owned"
                      ? "text-green-400"
                      : "text-red-400"
                    }`}
                >
                  Status: {item.status}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollectionDisplay;
