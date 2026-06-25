import React, { useState, useEffect } from "react";
import { PROPERTY_TYPES, GENDERS, FURNISH_OPTIONS } from "../constants/enums";

const BasicDetailsForm = ({ onNext, onBack }) => {
  const [form, setForm] = useState(() => {
    const stored = localStorage.getItem("basicDetails");
    return stored
      ? JSON.parse(stored)
      : {
          name: "",
          type: "FLAT",
          rent: "",
          deposit: "",
          locationUrl: "",
          gender: "ANY",
          furnishing: "UNFURNISHED",
          twoWheelerParking: false,
          fourWheelerParking: false,
          bhk: "",
          noOfVacancies: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("basicDetails", JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const processedData = {
      ...form,
      rent: parseFloat(form.rent),
      deposit: parseFloat(form.deposit),
      bhk: form.bhk !== "" ? parseInt(form.bhk) : null,
      noOfVacancies:
        form.noOfVacancies !== "" ? parseInt(form.noOfVacancies) : null,
    };

    localStorage.setItem("basicDetails", JSON.stringify(processedData));
    onNext(processedData);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Step 2: Basic Property Details
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Property Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      >
        {PROPERTY_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="rent"
        placeholder="Monthly Rent (₹)"
        value={form.rent}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      />

      <input
        type="number"
        name="deposit"
        placeholder="Security Deposit (₹)"
        value={form.deposit}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      />

      <select
        name="bhk"
        value={form.bhk}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select BHK (Optional)</option>
        <option value="0">1 RK</option>
        <option value="1">1 BHK</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
        <option value="4">4 BHK</option>
      </select>

      <input
        type="number"
        name="noOfVacancies"
        placeholder="Number of Vacancies (Optional)"
        value={form.noOfVacancies}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        min={0}
      />

      <input
        type="text"
        name="locationUrl"
        placeholder="Paste Google Maps URL (Optional)"
        value={form.locationUrl}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      />
      <p className="text-xs text-gray-500 mb-2">
        💡 Tip: Go to Google Maps, click on a location → "Share" → copy the link.
      </p>

      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      >
        <option value="">Select Gender Preference</option>
        {GENDERS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select
        name="furnishing"
        value={form.furnishing}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      >
        <option value="">Select Furnishing</option>
        {FURNISH_OPTIONS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-4 mb-4">
        <label>
          <input
            type="checkbox"
            name="twoWheelerParking"
            checked={form.twoWheelerParking}
            onChange={handleChange}
          />{" "}
          Two Wheeler Parking
        </label>
        <label>
          <input
            type="checkbox"
            name="fourWheelerParking"
            checked={form.fourWheelerParking}
            onChange={handleChange}
          />{" "}
          Four Wheeler Parking
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 text-black rounded"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
