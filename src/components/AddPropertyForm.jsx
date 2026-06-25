import React, { useState } from "react";
import axios from "axios";

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "FLAT", // PropertyType enum
    rent: "",
    locationUrl: "",
    gender: "ANY", // Gender enum
    furnishing: "FURNISHED", // Furnish enum
    
    images: ["", "", ""], // image URLs
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("image")) {
      const index = parseInt(name.split("_")[1]);
      const newImages = [...formData.images];
      newImages[index] = value;
      setFormData({ ...formData, images: newImages });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      type: formData.type,
      rent: parseInt(formData.rent),
      locationUrl: formData.locationUrl,
      address: null,
      gender: formData.gender,
      furnishing: formData.furnishing,
      images: formData.images
        .filter((url) => url.trim() !== "")
        .map((url) => ({ imgUrl: url })),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/properties",
        payload
      );
      alert("Property submitted successfully!");
      console.log("Saved:", response.data);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Failed to submit property. Check console for errors.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10 mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        List Your Property
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Property Name */}
        <input
          type="text"
          name="name"
          placeholder="Property Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Property Type */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="FLAT">Flat</option>
          <option value="PG">PG</option>
          <option value="HOSTEL">Hostel</option>
        </select>

        {/* Rent */}
        <input
          type="number"
          name="rent"
          placeholder="Rent (₹)"
          value={formData.rent}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Google Maps Location */}
        <input
          type="url"
          name="locationUrl"
          placeholder="Google Maps Location URL"
          value={formData.locationUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Gender */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="ANY">Any</option>
          <option value="BOYS">Boys</option>
          <option value="GIRLS">Girls</option>
          <option value="FAMILY">Family</option>
        </select>

        {/* Furnishing */}
        <select
          name="furnishing"
          value={formData.furnishing}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="FURNISHED">Furnished</option>
          <option value="SEMIFURNISHED">Semi-Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
        </select>

        {/* Image URLs */}
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            type="url"
            name={`image_${index}`}
            placeholder={`Image URL ${index + 1}`}
            value={formData.images[index]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ))}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddPropertyForm;
