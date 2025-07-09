import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, addDoc, Timestamp} from "firebase/firestore";
import { db } from '../firebase'; // ✅ fix this path
import CreatableSelect from 'react-select/creatable';


export default function NewFigForm() {

    const initialFormData = {
        name: '',
        modelNumber: '',
        category: '',
        edition: '',
        material: '',
        series: '',
        exclusiveStore: '',
        convention: '',
        owned: false,
        estimatedPriceAtPurchase: null,
        dateAcquired: '',
        bobbleHead: false,
        count: null,
        imageUrl: '',
        vaulted: false,
    };

    const [formData, setFormData] = useState(initialFormData);

    const [categories, setCategories] = useState([]);
    const [editions, setEditions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [seriesList, setSeriesList] = useState([]);


    useEffect(() => {
        const fetchList = async (collectionName, setter) => {
            try {
                const snapshot = await getDocs(collection(db, collectionName));
                const items = snapshot.docs.map(doc => ({
                    value: doc.id,
                    label: doc.data().name
                }));
                setter(items);
                console.log(`Fetched ${collectionName}`, items)
            } catch (error) {
                console.error(`Error fetching ${collectionName}:`, error);
            }
        };

        fetchList("categories", setCategories);
        fetchList("editions", setEditions);
        fetchList("materials", setMaterials);
        fetchList("series", setSeriesList);
    }, []);



    /* if new category, add to category collection. Eventually I want to pull the current attributes from the corresponding firebase collections and have autofill input 
    
    if retail exclusive, new attribute named convention Name, and also store name*/



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        
    };


    const addFig = async () => {
        const listType = formData.owned ? "collection" : "wishlist";
        //adding new doc in figuers collection
        const docRef = await addDoc(collection(db, "figures"), {
            name: formData.name,
            modelNumber: Number(formData.modelNumber),
            category: formData.category,
            edition: formData.edition,
            materials: formData.material,
            series: formData.series,
            bobbleHead: formData.bobbleHead,
            vaulted: formData.vaulted,
            imageUrl: formData.imageUrl,
            owned: formData.owned,
            estimatedPriceAtPurchase: formData.estimatedPriceAtPurchase || null,
            dateAcquired: Timestamp.fromDate(new Date(formData.dateAcquired))|| null,
            count: Number(formData.count) || null,
            list: listType

        });

        console.log("Document written with ID: ", docRef.id);

    }

    

        //if successfule, route to the page of whatever list the new fig was added to. If added to wishlist, go to /wishlist

   
    const handleSubmit = async (e) => {
        e.preventDefault(); // ✅ stop full-page reload
        console.log("FormData to be submmited", formData);
        await addFig();
        setFormData(initialFormData);

    };



    return (
        <><br></br><form onSubmit={handleSubmit}

            className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
            <div
                className={`h-2 w-full rounded-t-md ${formData.owned ? "bg-yellow-500" : "bg-green-500"
                    }`}
            ></div>
            {formData.imageUrl && (
                <div className="mt-4 flex justify-center">
                    <img
                        src={formData.imageUrl}
                        alt="Figure preview"
                        className="max-h-60 rounded-lg shadow-md border border-gray-300"
                    />
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                <input
                    type="number"
                    name="modelNumber"
                    value={formData.modelNumber}
                    onChange={handleChange}
                    require="true"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <CreatableSelect
                    options={categories}
                    value={categories.find(opt => opt.value === formData.category || null)}
                    onChange={(selectedOption) =>
                        setFormData((prev) => ({
                            ...prev,
                            category: selectedOption?.value || '',
                        }))
                    }
                    className="w-full rounded-lg  py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    classNamePrefix="react-select"
                    isClearable
                    placeholder="Select or type a category..."
                />
            </div>


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edition</label>
                <CreatableSelect
                    options={editions}
                    value={editions.find(opt => opt.value === formData.edition || null)}
                    onChange={(selectedOption) =>
                        setFormData((prev) => ({
                            ...prev,
                            edition: selectedOption?.value || '',
                        }))
                    }
                    className="w-full rounded-lg  py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    classNamePrefix="react-select"
                    isClearable
                    placeholder="Select or type a edition..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Materials</label>
                <CreatableSelect
                    options={materials}
                    value={materials.find(opt => opt.value === formData.material || null)}
                    onChange={(selectedOption) =>
                        setFormData((prev) => ({
                            ...prev,
                            material: selectedOption?.value || '',
                        }))
                    }
                    className="w-full rounded-lg  py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    classNamePrefix="react-select"
                    isClearable
                    placeholder="Select or type a material..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                <CreatableSelect
                    options={seriesList}
                    value={seriesList.find(opt => opt.value === formData.series || null)}
                    onChange={(selectedOption) =>
                        setFormData((prev) => ({
                            ...prev,
                            series: selectedOption?.value || '',
                        }))
                    }
                    className="w-full rounded-lg  py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    classNamePrefix="react-select"
                    isClearable
                    placeholder="Select or type a series..."
                />
            </div>



            <div className="flex items-center space-x-3">
                <label htmlFor="bobble" className="text-sm font-medium text-gray-700 select-none">Bobble Head</label>
                <input
                    id="bobble"
                    type="checkbox"
                    name="bobbleHead"
                    checked={formData.bobbleHead}
                    onChange={handleChange}

                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />

            </div>


            <div className="flex items-center space-x-3">
                <label htmlFor="vaulted" className="text-sm font-medium text-gray-700 select-none">Vaulted?</label>
                <input
                    id="vaulted"
                    type="checkbox"
                    name="vaulted"
                    checked={formData.vaulted}
                    onChange={handleChange}

                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />

            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Url</label>
                <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}

                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
            </div>

            <div className="flex items-center space-x-3">
                <label htmlFor="owned" className="text-sm font-medium text-gray-700 select-none">Owned</label>
                <input
                    id="owned"
                    type="checkbox"
                    name="owned"
                    checked={formData.owned}
                    onChange={handleChange}

                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />

            </div>
            {formData.owned && (
                <>
                    <div className="mt-4 flex justify-center">
                        <img
                            src={formData.imageUrl}
                            alt="Figure preview"
                            className="max-h-60 rounded-lg shadow-md border border-gray-300" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                            type="number" min="0" step="0.01" placeholder="0.00"
                            name="estimatedPriceAtPurchase"
                            value={formData.estimatedPriceAtPurchase}
                            onChange={handleChange}
                            require
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Acquired</label>
                        <input
                            type="date"
                            name="dateAcquired"
                            value={formData.dateAcquired}
                            onChange={handleChange}
                            require
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
                        <input
                            type="number"
                            name="count"
                            value={formData.count}
                            onChange={handleChange}
                            require
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    </div>

                </>
            )}

            <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
                
            >
                Add Figure
            </button>
        </form></>

    );
}