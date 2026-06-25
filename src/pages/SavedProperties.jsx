import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromSaved } from "../redux/savedPropertiesSlice";
import PropertyCard from "../components/PropertyCard";

const SavedProperties = () => {
  const saved = useSelector((state) => state.savedProperties.saved);
  const dispatch = useDispatch();

  return (
    <section className="py-16 px-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Saved for Review</h2>

      {saved.length === 0 ? (
        <p className="text-gray-600">You haven’t saved any properties yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onRemove={() => dispatch(removeFromSaved(property.id))}
              showRemoveButton={true}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SavedProperties;
