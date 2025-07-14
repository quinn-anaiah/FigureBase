import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import NewFigForm from "../components/NewFigForm";
import BackButton from "../components/BackButton";
import SearchFig from "../components/SearchFigs";

export default function Dashboard() {

    const[newModlOpen, setNewModalOpen] = useState(false);

    const handleAddClick = () =>{
        setNewModalOpen(true);
    }
    const closeNewModal = () =>{
        setNewModalOpen(false);
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 py-16">
            <h1 className="flex items-center text-3xl font-bold text-mainPurple">
                <img
                    src="/PurpleFig.png"
                    alt="Funko Base logo"
                    className="w-10 h-14 mr-2"
                />
                Figure Base</h1>
            <p className="text-gray-400 text-lg mb-12 text-center max-w-xl">
                Welcome! Choose a collection to explore your Funko universe.
            </p>
            <SearchFig/>
            <br></br>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                <Link
                    to="/collection-display"
                    className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-semibold py-3 px-2 rounded-xl shadow-md text-center transition"
                >
                    Collection
                </Link>

                <Link
                    to="/wishlist-display"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-2 rounded-xl shadow-md text-center transition"
                >
                    Wishlist
                </Link>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-2 rounded-xl shadow-md text-center transition"
                 onClick={handleAddClick}>
                    New +
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-2 rounded-xl shadow-md text-center transition"> Export</button>

              
            </div>

        {/* Show form to add new Fig */}
        {newModlOpen && (
            <NewFigForm/>
        )}

        </div>
    );
}
