// src/components/SearchForm.jsx
import React from 'react';

export default function SearchForm() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">Find Your Perfect Room</h1>
      <p className="mb-8 max-w-2xl mx-auto">
        Discover comfortable, affordable rooms and apartments in prime locations. Your ideal living space is just a search away.
      </p>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Enter city or area"
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select className="border p-2 rounded w-full md:w-1/4">
          <option>Property Type</option>
          <option>Flat</option>
          <option>Hostel</option>
        </select>
        <select className="border p-2 rounded w-full md:w-1/4">
          <option>Budget Range</option>
          <option>₹5000 - ₹8000</option>
          <option>₹8000 - ₹12000</option>
        </select>
        <button className="bg-black text-white px-4 py-2 rounded w-full md:w-auto">
          🔍 Search
        </button>
      </div>
    </section>
  );
}
