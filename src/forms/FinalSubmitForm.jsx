import React, { useState } from "react";
import axios from "axios";

const FinalSubmitForm = ({ data, onBack, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    // 1. Validation based on your DTO requirements
    if (!data.owner?.id || !data.basic?.name || !data.images || data.images.length === 0) {
      alert("⚠️ Please ensure the owner is selected and at least one image is uploaded.");
      return;
    }

    setIsSubmitting(true);

    // 2. Prepare Payload to match 'CreatePropertyDto.java' exactly
    const payload = {
      name: data.basic.name,
      type: data.basic.type, // e.g., FLAT, PG, etc.
      rent: parseFloat(data.basic.rent),
      deposit: parseFloat(data.basic.deposit),
      locationUrl: data.basic.locationUrl || "",
      gender: data.basic.gender,
      furnishing: data.basic.furnishing,
      address: data.address, // Nested Address object
      imageUrls: data.images, // List<String>
      ownerId: data.owner.id,
      twoWheelerParking: !!data.basic.twoWheelerParking,
      fourWheelerParking: !!data.basic.fourWheelerParking,
      available: true,
      noOfVacancies: parseInt(data.basic.noOfVacancies) || 0,
      bhk: parseInt(data.basic.bhk) || 0
    };

    try {
      // 3. POST to your @PostMapping endpoint
      await axios.post(`${API_BASE_URL}/api/properties`, payload);

      // 4. Cleanup localStorage
      ["ownerPhone", "ownerData", "basicDetails", "addressData", "imageFormData"].forEach(key => 
        localStorage.removeItem(key)
      );

      alert("🎉 Property listing submitted successfully!");
      onSuccess();
    } catch (err) {
      console.error("❌ Error submitting property:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit property. Check backend logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
        Step 5: Detailed Review and Submit
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-800">
        
        {/* Section 1: Owner & Basics */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-blue-600 border-b">Owner Information</h3>
          <p><strong>Owner Name:</strong> {data.owner.name}</p>
          <p><strong>Phone:</strong> {data.owner.phone}</p>
          
          <h3 className="font-bold text-lg text-blue-600 border-b pt-4">Property Basics</h3>
          <p><strong>Property Name:</strong> {data.basic.name}</p>
          <p><strong>Type:</strong> {data.basic.type}</p>
          <p><strong>Rent:</strong> ₹{data.basic.rent}</p>
          <p><strong>Deposit:</strong> ₹{data.basic.deposit}</p>
          <p><strong>BHK:</strong> {data.basic.bhk || "-"}</p>
          <p><strong>Vacancies:</strong> {data.basic.noOfVacancies || "-"}</p>
        </div>

        {/* Section 2: Amenities & Location */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-blue-600 border-b">Preferences & Amenities</h3>
          <p><strong>Gender Allowed:</strong> {data.basic.gender}</p>
          <p><strong>Furnishing:</strong> {data.basic.furnishing}</p>
          <p><strong>Parking:</strong> 
             {data.basic.twoWheelerParking ? " 🛵 2-Wheeler" : ""}
             {data.basic.fourWheelerParking ? " 🚗 4-Wheeler" : ""}
             {!data.basic.twoWheelerParking && !data.basic.fourWheelerParking ? " None" : ""}
          </p>

          <h3 className="font-bold text-lg text-blue-600 border-b pt-4">Address</h3>
          <p>{data.address.street}, {data.address.area}</p>
          <p>{data.address.city}, {data.address.state}, {data.address.country}</p>
          {data.basic.locationUrl && (
            <p className="truncate text-blue-500 italic">
              <a href={data.basic.locationUrl} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
            </p>
          )}
        </div>
      </div>

      {/* Section 3: Detailed Image Review */}
      <div className="mt-8">
        <h3 className="font-bold text-lg text-blue-600 border-b mb-4">Uploaded Images</h3>
        {data.images && data.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.images.map((url, i) => (
              <div key={i} className="relative group shadow-sm rounded-lg overflow-hidden border">
                <img
                  src={url}
                  alt={`Property ${i}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  S3 Uploaded
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500 italic">No images uploaded yet.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-10 pt-6 border-t">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Photos
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-[2] px-4 py-3 bg-green-600 text-white rounded-md font-bold shadow-lg hover:bg-green-700 disabled:bg-green-300 transition-all"
        >
          {isSubmitting ? "Saving to Database..." : "Confirm & Submit Listing"}
        </button>
      </div>
    </div>
  );
};

export default FinalSubmitForm;