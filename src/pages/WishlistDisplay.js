
import BackButton from "../components/BackButton";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, addDoc, Timestamp, query, where } from "firebase/firestore";
import { db } from '../firebase'; // ✅ fix this path
import EditFigForm from "../components/EditFigForm";



function WishlistDisplay() {
  const [figuresList, setFiguresList] = useState([]);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const q = query(collection(db, "figures"), where("list", "==", "wishlist"));
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
            material: data.material || "",
            series: data.series,
            bobbleHead: data.bobbleHead,
            convention: data.convention || "",
            exclusiveStore: data.exclusiveStore || "",
            vaulted: data.vaulted,
            imageUrl: data.imageUrl,
            owned: data.owned,
            estimatedPriceAtPurchase: data.estimatedPriceAtPurchase || null,
            dateAcquired: data.dateAcquired && !isNaN(new Date(data.dateAcquired))
              ? new Date(data.dateAcquired)
              : null,
            count: data.count || null,
            list: data.list,
            description: data.description || null,
            multiPack: data.multiPack,
            numFigs: data.numFigs || 1,
          });
        }
        setFiguresList(newFigsList);
        console.log("Figs List, ", newFigsList);


      } catch (error) {
        console.error("Error getting wishlist", error);
      }
    }
    fetchWishlist();
  }, []);

  const handleFigUpdate = async (updatedFigure) => {
  const newListType = updatedFigure.owned ? "collection" : "wishlist";
  const updatedFigureWithList = { ...updatedFigure, list: newListType };

  try {
    const docRef = doc(db, "figures", updatedFigure.id);
    await setDoc(docRef, updatedFigureWithList);

    if (selectedFigure.list !== newListType) {
      // 🗑️ Remove from current list view
      setFiguresList((prevList) =>
        prevList.filter((fig) => fig.id !== updatedFigure.id)
      );
    } else {
      // 🔁 Update in place
      setFiguresList((prevList) =>
        prevList.map((fig) =>
          fig.id === updatedFigure.id ? updatedFigureWithList : fig
        )
      );
    }

    setShowEditModal(false);
    setShowDetailsModal(false);
  } catch (error) {
    console.error("Error updating figure:", error);
  }
};




  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black min-h-screen text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <h1 className="text-5xl font-extrabold text-titleGreen mb-12 font-sans tracking-tight">
          💚 My Funko Wishlist
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {figuresList.map((item) => (
            <div
              onClick={() => {
                setSelectedFigure(item);
                setShowDetailsModal(true);
              }}
              role="button"
              className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-lg hover:shadow-lightGreen hover:scale-[1.02] transition duration-300"
            >
              <div className="bg-white h-48 flex items-center justify-center">
                <img
                  src={item.imageUrl || "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="}
                  alt={item.name}
                  className="h-full object-contain p-2"
                />
              </div>

              <div className="p-4 space-y-1">
                <h2 className="text-xl font-bold text-lightGreen">
                  {item.name} #{item.modelNumber}
                </h2>
                {/* {selectedRoom.roomType.replace(/\b\w/g, char => char.toUpperCase())} */}
                <p className="text-sm text-gray-300">
                  Category: <span className="font-medium">{item.category.replace(/\b\w/g, char => char.toUpperCase())}</span>
                </p>
                <p className="text-sm text-gray-300">
                  Series: <span className="font-medium">{item.series.replace(/\b\w/g, char => char.toUpperCase())}</span>
                </p>
                <p className="text-sm text-gray-300">
                  Edition: <span className="italic">{item.edition.replace(/\b\w/g, char => char.toUpperCase())}</span>
                </p>
                <p className="text-sm text-gray-300">
                  Material: <span className="italic">{item.material.replace(/\b\w/g, char => char.toUpperCase())}</span>
                </p>
                
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
        {showDetailsModal && selectedFigure && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-zinc-900 text-white rounded-xl p-6 w-[90%] max-w-4xl relative flex gap-6">

              {/* Close Button */}
              <button
                className="absolute top-2 right-3 text-xl text-white hover:text-titleGreen"
                onClick={() => setShowDetailsModal(false)}
              >
                ✖
              </button>

              {/* Image on Left */}
              <div className="w-1/3 flex justify-center">
                <img
                  src={selectedFigure.imageUrl}
                  alt={selectedFigure.name}
                  className="object-contain h-full max-h-[500px] w-full rounded"
                />
              </div>

              {/* Text on Right */}
              <div className="w-2/3 flex flex-col justify-start space-y-2 overflow-y-auto max-h-[500px] pr-2">
                <h2 className="text-3xl text-lightGreen font-bold mb-2">{selectedFigure.name.replace(/\b\w/g, char => char.toUpperCase())} #{selectedFigure.modelNumber}</h2>

                <p><strong>Category:</strong> {selectedFigure.category.replace(/\b\w/g, char => char.toUpperCase())}</p>
                <p><strong>Series:</strong> {selectedFigure.series.replace(/\b\w/g, char => char.toUpperCase())}</p>
                <p><strong>Edition:</strong> {selectedFigure.edition.replace(/\b\w/g, char => char.toUpperCase())}</p>
                {selectedFigure.edition === "retail-exclusive" && (
                  <p><strong>Exclusive Store:</strong> {selectedFigure.exclusiveStore.replace(/\b\w/g, char => char.toUpperCase())}</p>
                ) }
                {selectedFigure.edition === "convention-exclusive" && (
                  <p><strong>Convention Store:</strong> {selectedFigure.convention.replace(/\b\w/g, char => char.toUpperCase())}</p>
                ) }
                <p><strong>Material:</strong> {selectedFigure.material.replace(/\b\w/g, char => char.toUpperCase())}</p>
                {selectedFigure.multiPack && (
                  <p><strong>Total Figures Included:</strong> {selectedFigure.numFigs || 1}</p>
                )}
                <p><strong>Bobble Head:</strong> {selectedFigure.bobbleHead ? "Yes" : "No"}</p>
                <p><strong>Vaulted:</strong> {selectedFigure.vaulted ? "Yes" : "No"}</p>
                <p><strong>Description</strong> {selectedFigure.description || 'None'}</p>
               </div>

              {/* Edit Button */}

              <button type="button" class=" absolute bottom-2 right-3 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={() => { setShowDetailsModal(false); setShowEditModal(true); }}
              >
                Edit
              </button>
            </div>
          </div>
        )}
        {showEditModal && selectedFigure &&
          <div className="fixed inset-0 bg-bla bg-opacity-50 flex justify-center items-center z-50">


            <EditFigForm
              figure={selectedFigure}
              onSave={handleFigUpdate}
              onCancel={() => setShowEditModal(false)}
              onDeleteSuccess={() => {
                setFiguresList(prev => prev.filter(fig => fig.id !== selectedFigure.id));
                setSelectedFigure(null); // close modal
              }}
            />
          </div>
        }


      </div>
    </div>
  );
}

export default WishlistDisplay;
