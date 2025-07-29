import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, addDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { db, storage } from '../firebase'; // ✅ fix this path
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import CreatableSelect from 'react-select/creatable';
import { ensureValueInCollection } from "../utils/firestoreHelpers";
import { useNavigate } from "react-router-dom";



export default function EditFigForm({ figure, onSave, onCancel, onDeleteSuccess }) {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        modelNumber: '',
        category: '',
        series: '',
        edition: '',
        material: '',
        bobbleHead: false,
        vaulted: false,
        exclusiveStore: '',
        convention: '',
        owned: false,
        count: 1,
        estimatedPriceAtPurchase: '',
        dateAcquired: '',
        imageUrl: '',
        list: ''
    });

    const [categories, setCategories] = useState([]);
    const [editions, setEditions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [seriesList, setSeriesList] = useState([]);


    //populate form with passed figure data
    useEffect(() => {
        if (figure) {
            setFormData({
                id: figure.id,
                name: figure.name || '',
                modelNumber: Number(figure.modelNumber) || '',
                category: figure.category || '',
                edition: figure.edition || '',
                material: figure.material || '',
                series: figure.series || '',
                bobbleHead: figure.bobbleHead || false,
                vaulted: figure.vaulted || false,
                imageUrl: figure.imageUrl || '',
                owned: figure.owned || false,
                estimatedPriceAtPurchase: figure.estimatedPriceAtPurchase || null,
                dateAcquired: figure.dateAcquired || null,
                count: Number(figure.count) || null,
                list: figure.list || '',
                convention: figure.convention || null,
                exclusiveStore: figure.exclusiveStore || null,

            });
        }
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

    }, [figure]);



    /* if new category, add to category collection. Eventually I want to pull the current attributes from the corresponding firebase collections and have autofill input 
    
    if retail exclusive, new attribute named convention Name, and also store name*/

    function formatDateForInput(date) {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalImageUrl = formData.imageUrl;

        if (imageFile) {
            const storageRef = ref(storage, `figures/${Date.now()}_${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            finalImageUrl = await getDownloadURL(storageRef);
            console.log("✅ Image uploaded. URL:", finalImageUrl);
        }

        // Make sure new values are added to Firestore collections
        await Promise.all([
            ensureValueInCollection("categories", formData.category),
            ensureValueInCollection("editions", formData.edition),
            ensureValueInCollection("materials", formData.material),
            ensureValueInCollection("series", formData.series),
        ]);
        await onSave({
            ...figure,
            ...formData,
            imageUrl: finalImageUrl
        });
        setImageFile(null);
    };

    const handleDelete = async (e) => {
        var txt;
        if (window.confirm("Are you sure you would like to delete: ", figure.name + figure.modelNumber)) {
            txt = "You pressed OK!";
            try {
                await deleteDoc(doc(db, "figures", formData.id));
                console.log("🗑️ Figure deleted successfully");

                // Optionally redirect or close modal
                // For example, if you're using React Router:
                if (onDeleteSuccess) onDeleteSuccess(); // parent handles cleanup
                // Or call a `closeModal()` prop function
            } catch (error) {
                console.error("Error deleting figure:", error);
                alert("Failed to delete figure. Please try again.");
            }

        } else {
            txt = "You pressed Cancel!";
        }
        console.log(txt);
    }







    //if successfule, route to the page of whatever list the new fig was added to. If added to wishlist, go to /wishlist






    return (
        <form
            onSubmit={handleSubmit}
            className="bg-zinc-800 p-10 rounded-lg shadow-lg space-y-4 max-w-xl mx-auto text-white overflow-y-auto max-h-[80vh]"
        >

            <h2 className="text-2xl font-bold text-titlePurple">Edit Figure</h2>
            {/* <div
                className={`h-2 w-full rounded-t-md ${formData.owned ? "bg-yellow-500" : "bg-green-500"
                    }`}
            ></div> */}
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
                <label className="block text-sm font-medium text-extraLightPurple mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
            </div>

            <div>
                <label className="block text-sm font-medium text-extraLightPurple mb-1">Model Number</label>
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
                <label className="block text-sm font-medium text-extraLightPurple mb-1">
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
                <label className="block text-sm font-medium text-extraLightPurple mb-1">
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
                <label className="block text-sm font-medium text-extraLightPurple mb-1">
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
                <label className="block text-sm font-medium text-extraLightPurple mb-1">
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
                <label htmlFor="bobble" className="text-sm font-medium text-extraLightPurple select-none">Bobble Head</label>
                <button
                    type="button"
                    onClick={() =>
                        setFormData((prev) => ({ ...prev, bobbleHead: !prev.bobbleHead }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.bobbleHead ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${formData.bobbleHead ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>


            <div className="flex items-center space-x-3">
                <label htmlFor="vaulted" className="text-sm font-medium text-extraLightPurple select-none">Vaulted?</label>
                <button
                    type="button"
                    onClick={() =>
                        setFormData((prev) => ({ ...prev, vaulted: !prev.vaulted }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.vaulted ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${formData.vaulted ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>

            </div>
            <div>
                <label className="block text-sm font-medium text-extraLightPurple mb-1">Image Url</label>
                <input
                   type="file"
                    accept="image/*"
                    name="imagl"
                    onChange={(e) => setImageFile(e.target.files[0])}

                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="owned" className="text-sm font-medium text-extraLightPurple">
                    Owned
                </label>
                <button
                    type="button"
                    onClick={() =>
                        setFormData((prev) => ({ ...prev, owned: !prev.owned }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.owned ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${formData.owned ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>
            {formData.owned && (
                <>


                    <div>
                        <label className="block text-sm font-medium text-extraLightPurple mb-1">Price</label>
                        <input
                            type="number" min="0" step="0.01" placeholder="0.00"
                            name="estimatedPriceAtPurchase"
                            value={formData.estimatedPriceAtPurchase}
                            onChange={handleChange}
                            require
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-extraLightPurple mb-1">Date Acquired</label>
                        <input
                            type="date"
                            name="dateAcquired"
                            value={formData.dateAcquired || ""}
                            onChange={handleChange}
                            require
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-extraLightPurple mb-1">Count</label>
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

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 w-full max-w-md">
                <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"

                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
                >Cancel </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"

                >
                    Delete
                </button>
            </div>
        </form>

    );
}