"use client"
import React from 'react';

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-center">
      <h1 className="text-5xl font-extrabold text-red-500 drop-shadow-lg mb-4">
        Access Denied!
      </h1>
      <p className="text-lg text-gray-200 max-w-md leading-relaxed">
        You cannot access this page. Please check your permissions or return to the homepage.
      </p>
      <button
        onClick={() => (window.location.href = '/')}
        className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-transform duration-300"
      >
        Go Home
      </button>
    </div>
  );
}

export default Unauthorized;