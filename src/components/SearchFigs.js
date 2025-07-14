import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, addDoc, Timestamp, query, where } from "firebase/firestore";
import { db } from '../firebase'; // ✅ fix this path


export default function SearchFig() {
    const navigate = useNavigate();
    const [figuresList, setFiguresList] = useState([]);
    const [filteredFiguresList, setFilteredFiguresList] = useState([]);
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchPressed, setSearchPressed] = useState(false);
    /* Okay were going to filter the figs list, by name 
    
    * 
    
    */
    useEffect(() => {
        const fetchFigures = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "figures"));
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
                        list: data.list
                    });
                }
                setFiguresList(newFigsList);
                console.log("Figs List, ", newFigsList);


            } catch (error) {
                console.error("Error getting collection", error);
            }
        }
        fetchFigures();
    }, []);



    const handleSearch = (e) => {
        /* basic search that filters by name */
        console.log("Search Button Pressed")
        setSearchPressed(true)
        console.log("You searched: ", searchInput)
        if (searchInput == "") {
            setFilteredFiguresList([])
        }
        const filtered = figuresList.filter(figure =>
            figure.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredFiguresList(filtered)

    }
    const handleAdvancedClick = (e) => {
        console.log("Advance Search Button Pressed")
        setShowAdvancedSearch(true)
        setSearchPressed(true)
    }

    return (
        <div>
            <div className="w-full max-w-md min-w-[500px]">

                <div class="relative mt-2">
                    <input type="text" name="search" onChange={(e) => setSearchInput(e.target.value)} placeholder="Search Something..." value={searchInput}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="w-full border-2 border-mainPurple rounded-md pl-4 pr-20 py-2 text-sm text-gray-700 outline-none" />

                    {/* Clear (X) Button - appears only when there's input */}
                    {searchInput && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchInput("");
                                setFilteredFiguresList([]);
                                setSearchPressed(false);
                            }}
                            className="absolute text-slate-800 right-7 top-1 rounded p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-purple-900 focus:shadow-none active:bg-purple-900 hover:text-white hover:bg-purple-900 hover:opacity-50 active:shadow-none disabled:pointer-events-none disabled:opacity-20 disabled:shadow-none"
                        >
                            ⨉
                        </button>
                    )}
                    <button type='button' onClick={handleSearch} className="absolute right-0.5 top-1 rounded bg-purple-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-purple-700 focus:shadow-none active:bg-purple-700 hover:bg-purple-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" class="fill-white">
                            <path
                                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                            </path>
                        </svg>
                    </button>

                    <button type="button" onClick={handleAdvancedClick} className="absolute h-10 right-50 top-1.2 rounded bg-purple-800 p-1.5 border border-mainPurple text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-purple-700 focus:shadow-none active:bg-purple-700 hover:bg-purple-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Advanced</button>

                </div>


            </div>
            {showAdvancedSearch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-zinc-900 text-white rounded-xl p-6 w-[90%] max-w-4xl relative flex gap-6">

                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-3 text-xl text-white hover:text-titlePurple"
                            onClick={() => setShowAdvancedSearch(false)}
                        >
                            ✖
                        </button>
                        <h2> Search</h2>
                        {/*import Select from 'react-select';

// Build options in the format react-select expects
const categoryOptions = categories.map((category) => ({
  value: category,
  label: category,
}));

// Replace this input in your form:
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
  <Select
    options={categoryOptions}
    value={categoryOptions.find(opt => opt.value === formData.category)}
    onChange={(selectedOption) =>
      setFormData((prev) => ({
        ...prev,
        category: selectedOption?.value || '',
      }))
    }
    className="text-sm"
    classNamePrefix="react-select"
    isClearable
    placeholder="Select or type a category..."
  />
</div> */}

                    </div> </div>
            )}

            {searchInput && searchPressed && filteredFiguresList.length < 1 && (
                <h2>No Results</h2>
            )}

            {filteredFiguresList.length > 0 && (
                <div className="mt-6 max-w-4xl mx-auto space-y-4">
                    {filteredFiguresList.map((item) => (
                        <div key={item.id}
                            onClick={() => {
                                setSelectedFigure(item);
                                setShowDetailsModal(true);
                            }}
                            role="button"
                            className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-lg hover:shadow-lightPurple hover:scale-[1.02] transition duration-300 flex"
                        >
                            <div className="w-1/4 p-2 flex items-center justify-center bg-zinc-900">
                                <img
                                    src={item.imageUrl || "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="}
                                    alt={item.name}
                                    className="object-contain  max-h-[150px] w-full rounded"
                                />
                            </div>


                            <div className="w-3/4 p-4 flex flex-col justify-start space-y-1 overflow-y-auto">
                                <h2 className="text-sm font-bold text-lightPurple">
                                    {item.name} #{item.modelNumber}
                                </h2>
                                {/* {selectedRoom.roomType.replace(/\b\w/g, char => char.toUpperCase())} */}
                                <p className="text-xs text-gray-300">
                                    Category: <span className="font-medium">{item.category.replace(/\b\w/g, char => char.toUpperCase())}</span>
                                </p>
                                <p className="text-xs text-gray-300">
                                    Series: <span className="font-medium">{item.series.replace(/\b\w/g, char => char.toUpperCase())}</span>
                                </p>
                                <p className="text-xs text-gray-300">
                                    Edition: <span className="italic">{item.edition.replace(/\b\w/g, char => char.toUpperCase())}</span>
                                </p>
                                <p className="text-xs text-gray-300">
                                    Material: <span className="italic">{item.material.replace(/\b\w/g, char => char.toUpperCase())}</span>
                                </p>
                                <p className="text-xs text-gray-300">
                                    Date: <span className="font-medium"> {item.dateAcquired
                                        ? new Date(item.dateAcquired).toLocaleDateString()
                                        : "Unknown"} </span>
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>


    );
}

/*<div class="w-full max-w-sm min-w-[200px]">
  <div class="relative mt-2">
      <div class="absolute top-1 left-1 flex items-center">
      <button id="dropdownButton" class="rounded border border-transparent py-1 px-1.5 text-center flex items-center text-sm transition-all text-purple-600">
        <span id="dropdownSpan" class="text-ellipsis overflow-hidden">Europe</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 ml-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div class="h-6 border-l border-purple-200 ml-1"></div>
      <div id="dropdownMenu" class="min-w-[150px] overflow-hidden absolute left-0 w-full mt-10 hidden w-full bg-white border border-purple-200 rounded-md shadow-lg z-10">
        <ul id="dropdownOptions">
          <li class="px-4 py-2 text-purple-600 hover:bg-purple-50 text-sm cursor-pointer" data-value="Europe">Europe</li>
          <li class="px-4 py-2 text-purple-600 hover:bg-purple-50 text-sm cursor-pointer" data-value="Australia">Australia</li>
          <li class="px-4 py-2 text-purple-600 hover:bg-purple-5- text-sm cursor-pointer" data-value="Africa">Africa</li>
        </ul>
      </div>
    </div>
    <input
      type="text"
      class="w-full bg-transparent placeholder:text-purple-400 text-purple-700 text-sm border border-purple-200 rounded-md pr-12 pl-28 py-2 transition duration-300 ease focus:outline-none focus:border-purple-400 hover:border-purple-300 shadow-sm focus:shadow"
      placeholder="Germany..." />
 
    <button class="absolute right-1 top-1 rounded bg-purple-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-purple-700 focus:shadow-none active:bg-purple-700 hover:bg-purple-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
        <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd"></path>
      </svg>
    </button> 
  </div>   
</div>
 
<script>
  document.getElementById('dropdownButton').addEventListener('click', function() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.classList.contains('hidden')) {
      dropdownMenu.classList.remove('hidden');
    } else {
      dropdownMenu.classList.add('hidden');
    }
  });
 
  document.getElementById('dropdownOptions').addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
      const dataValue = event.target.getAttribute('data-value');
      document.getElementById('dropdownSpan').textContent = dataValue;
      document.getElementById('dropdownMenu').classList.add('hidden');
    }
  });
 
  document.addEventListener('click', function(event) {
    var isClickInside = document.getElementById('dropdownButton').contains(event.target) || document.getElementById('dropdownMenu').contains(event.target);
    var dropdownMenu = document.getElementById('dropdownMenu');
 
    if (!isClickInside) {
      dropdownMenu.classList.add('hidden');
    }
  });
</script> */