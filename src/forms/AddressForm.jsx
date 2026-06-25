import React, { useState, useEffect } from "react";

const AddressForm = ({ onNext, onBack }) => {
  const LOCAL_STORAGE_KEY = "addressData";

  const [address, setAddress] = useState({
    street: "",
    area: "",
    landmark: "",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setAddress(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Save to localStorage on submit
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(address));
    onNext(address);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Step 3: Address Details</h2>

      {[
        { name: "street", label: "Street Name", placeholder: "eg. 65/614 Deep Bangla" },
        { name: "area", label: "Area / Colony", placeholder: "eg. Karve Nagar" },
        { name: "landmark", label: "Landmark", placeholder: "eg. Near D-Mart" },
        { name: "city", label: "City" },
        { name: "state", label: "State" },
        { name: "country", label: "Country" },
        { name: "pincode", label: "Pincode", placeholder: "eg. 411052" },
      ].map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="p-2 block font-medium">
            {field.label}
          </label>
          <input
            type="text"
            name={field.name}
            placeholder={field.placeholder || ""}
            value={address[field.name]}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded"
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

export default AddressForm;
