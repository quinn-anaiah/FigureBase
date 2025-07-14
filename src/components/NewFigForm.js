import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, addDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase'; // ✅ fix this path
import CreatableSelect from 'react-select/creatable';
import { ensureValueInCollection } from "../utils/firestoreHelpers";


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
    function formatDateForInput(date) {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }


    const addFig = async () => {
        const listType = formData.owned ? "collection" : "wishlist";

        // Ensure new values exist in their Firestore collections
        await Promise.all([
            ensureValueInCollection("categories", formData.category),
            ensureValueInCollection("editions", formData.edition),
            ensureValueInCollection("materials", formData.material),
            ensureValueInCollection("series", formData.series),
        ]);
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
            dateAcquired: String(formData.dateAcquired) || null,
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

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-600">*</span>
                </label>
                <CreatableSelect
                    options={categories.map(opt => ({
                        value: opt.value,
                        label: (opt.label || opt.value).replace(/\b\w/g, c => c.toUpperCase()),
                    }))}
                    value={
                        formData.category
                            ? {
                                value: formData.category,
                                label: formData.category.replace(/\b\w/g, c => c.toUpperCase()),
                            }
                            : null
                    }
                    onChange={(selectedOption) =>
                        setFormData(prev => ({
                            ...prev,
                            category: selectedOption?.value || '',
                        }))
                    }
                    className="w-full rounded-lg py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    classNamePrefix="react-select"
                    isClearable
                    placeholder="Select or type a category..."
                    required
                />
            </div>

            {/* Edition */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edition <span className="text-red-600">*</span>
                </label>
                <CreatableSelect
                    options={editions.map(opt => ({
                        value: opt.value,
                        label: (opt.label || opt.value).replace(/\b\w/g, c => c.toUpperCase()),
                    }))}
                    value={
                        formData.edition
                            ? {
                                value: formData.edition,
                                label: formData.edition.replace(/\b\w/g, c => c.toUpperCase()),
                            }
                            : null
                    }
                    onChange={(selectedOption) =>
                        setFormData(prev => ({
                            ...prev,
                            edition: selectedOption?.value || '',
                        }))
                    }
                    className="w-full rounded-lg py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    classNamePrefix="react-select"
                    isClearable
                    placeholder="Select or type an edition..."
                    required
                />
            </div>

            {/* Material */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material <span className="text-red-600">*</span>
                </label>
                <CreatableSelect
                    options={materials.map(opt => ({
                        value: opt.value,
                        label: (opt.label || opt.value).replace(/\b\w/g, c => c.toUpperCase()),
                    }))}
                    value={
                        formData.material ? {
                            value: formData.material,
                            label: formData.material.replace(/\b\w/g, c => c.toUpperCase()),
                        }
                            : null
                    }
                    onChange={(selectedOption) =>
                        setFormData(prev => ({
                            ...prev,
                            material: selectedOption?.value || '',
                        }))
                    }
                    className="w-full rounded-lg py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    classNamePrefix="react-select"
                    isClearable
                    placeholder="Select or type a material..."
                    required
                />
            </div>

            {/* Series */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Series <span className="text-red-600">*</span>
                </label>
                <CreatableSelect
                    options={seriesList.map(opt => ({
                        value: opt.value,
                        label: (opt.label || opt.value).replace(/\b\w/g, c => c.toUpperCase()),
                    }))}
                    value={
                        formData.series
                            ? {
                                value: formData.series,
                                label: formData.series.replace(/\b\w/g, c => c.toUpperCase()),
                            }
                            : null
                    }
                    onChange={(selectedOption) =>
                        setFormData(prev => ({
                            ...prev,
                            series: selectedOption?.value || '',
                        }))
                    }
                    className="w-full rounded-lg py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    classNamePrefix="react-select"
                    isClearable
                    placeholder="Select or type a series..."
                    required
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
                            value={formData.dateAcquired || ""}
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