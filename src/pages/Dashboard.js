import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import NewFigForm from "../components/NewFigForm";

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
            <div class="flex rounded-md border-2 border-mainPurple overflow-hidden max-w-md mx-auto">
                <input type="email" placeholder="Search Something..."
                    class="w-full outline-none bg-white text-gray-600 text-sm px-20 py-3" />
                <button type='button' class="flex items-center justify-center bg-mainPurple px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" class="fill-white">
                        <path
                            d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                        </path>
                    </svg>
                </button>
            </div>
            <br></br>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                <Link
                    to="/collection-display"
                    className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-semibold py-3 px-2 rounded-xl shadow-md text-center transition"
                >
                    Collection
                </Link>

                <Link
                    to="/wishlist"
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
