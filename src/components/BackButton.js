import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        inline-flex items-center
        px-4 py-2
        bg-gray-800 hover:bg-gray-700
        text-white font-medium
        rounded-md
        shadow-md
        transition
        focus:outline-none focus:ring-2 focus:ring-yellow-400
        select-none
      "
      aria-label="Go back"
    >
      {/* Simple left arrow SVG */}
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Back
    </button>
  );
}
