import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { addToSaved, removeFromSaved } from "../redux/savedPropertiesSlice";
import { formatDistanceToNow } from "date-fns";
import { Heart, Phone, MessageCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useOwner } from "../context/OwnerContext"; // Import your custom context hook

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ImageModal = ({ images, modalIndex, setModalIndex }) => {
  if (modalIndex === null) return null;

  const closeModal = () => setModalIndex(null);
  const prevImage = () =>
    setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setModalIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const modalSwipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true,
  });

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="relative max-w-3xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        {...modalSwipeHandlers}
      >
        <img
          src={images[modalIndex]?.imgUrl}
          alt="Modal"
          className="w-full max-h-[80vh] object-contain rounded"
        />

        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-white text-3xl font-bold"
        >
          ×
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

const PropertyCard = ({ property = {}, onDeleteSuccess }) => {
  const {
    id,
    name,
    type,
    rent,
    deposit,
    bhk,
    address,
    gender,
    furnishing,
    twoWheelerParking,
    fourWheelerParking,
    noOfVacancies,
    images = [],
    owner,
  } = property;

  const { owner: loggedInOwner } = useOwner(); // Retrieve the authenticated session data
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const dispatch = useDispatch();
  const savedList = useSelector((state) => state.savedProperties.saved);
  const isSaved = savedList.some((p) => p.id === id);

  const handleSaveToggle = () => {
    if (isSaved) {
      dispatch(removeFromSaved(id));
    } else {
      dispatch(addToSaved(property));
    }
  };

  // Secure Delete Request Execution
  const handleDelete = async () => {
    if (window.confirm("Are you absolutely sure you want to permanently delete this listing?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/properties/${id}`, {
          params: { ownerId: loggedInOwner?.id }
        });
        
        // Fire state filter callback if passed from parent component profile view
        if (onDeleteSuccess) {
          onDeleteSuccess(id);
        } else {
          alert("Property listing successfully deleted.");
          window.location.reload();
        }
      } catch (err) {
        alert(err.response?.data || "Failed to remove the property unit registry.");
      }
    }
  };

  // Key Listener Fixes: Now accurately tracking setModalImageIndex scope pointer
  const handleKeyDown = useCallback(
    (e) => {
      if (modalImageIndex === null) return;
      if (e.key === "Escape") setModalImageIndex(null);
      if (e.key === "ArrowLeft")
        setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      if (e.key === "ArrowRight")
        setModalImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [modalImageIndex, images.length]
  );

  useEffect(() => {
    if (modalImageIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalImageIndex, handleKeyDown]);

  const previewSwipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setPreviewImageIndex((prev) => (prev + 1) % images.length),
    onSwipedRight: () =>
      setPreviewImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)),
    trackMouse: true,
  });

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between">
      <div>
        {/* Image Section */}
        <div
          {...previewSwipeHandlers}
          className="relative w-full h-56 cursor-pointer group"
          onClick={() => setModalImageIndex(previewImageIndex)}
        >
          <img
            src={images?.[previewImageIndex]?.imgUrl}
            alt={name}
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

          <div className="absolute bottom-3 left-3 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
            ₹{rent}/month
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveToggle();
            }}
            className={`absolute top-3 right-3 p-2 rounded-full ${
              isSaved ? "bg-red-500 text-white" : "bg-white text-gray-600"
            } shadow hover:scale-110 transition`}
          >
            <Heart
              size={20}
              className={isSaved ? "fill-current" : "stroke-current"}
            />
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex space-x-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === previewImageIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold truncate">{name}</h2>
            {property.createdAt && (
              <p className="text-xs text-gray-500 shrink-0">
                {formatDistanceToNow(new Date(property.createdAt), {
                  addSuffix: true,
                })}
              </p>
            )}
          </div>

          <p className="text-gray-700 text-sm">
            {type} | {bhk === 0 ? "1RK" : bhk ? `${bhk} BHK` : ""} | {gender}
          </p>
          <p className="text-gray-500 text-sm truncate">
            {address?.area}, {address?.city}, {address?.state}
          </p>

          {/* More details */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              showMore ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>
                Deposit : <span className="font-medium">₹{deposit}</span> | Vacancies:{" "}
                {noOfVacancies ?? "N/A"}
              </p>
              <p>Furnishing: {furnishing || "N/A"}</p>
              {(twoWheelerParking || fourWheelerParking) && (
                <p>
                  Parking:{" "}
                  {twoWheelerParking && (
                    <span className="text-green-600">Two-Wheeler ✔</span>
                  )}
                  {twoWheelerParking && fourWheelerParking && " | "}
                  {fourWheelerParking && (
                    <span className="text-green-600">Four-Wheeler ✔</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="flex items-center text-blue-600 text-sm font-medium mt-2 focus:outline-none"
          >
            {showMore ? (
              <>
                Less Details <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                More Details <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </button>

          {/* Clean Public Map Query String Redirection link format */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${address?.street || ""}, ${address?.area || ""}, ${
                address?.landmark || ""
              }, ${address?.city || ""}, ${address?.state || ""}, ${
                address?.pincode || ""
              }`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-500 hover:underline text-sm mt-1 font-medium"
          >
            📍 View on Map
          </a>
        </div>
      </div>

      {/* Communication & Account Controls Footer */}
      <div className="p-4 pt-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-500 truncate max-w-[110px]">
            Owner: {owner?.name}
          </span>
          
          <div className="flex items-center gap-1.5">
            {/* Show regular contact triggers if visitor view or fallback phone exists */}
            {owner?.phone && (
              <>
                <a
                  href={`https://wa.me/${owner?.phone?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium transition-colors"
                >
                  <MessageCircle size={13} className="mr-0.5" /> WhatsApp
                </a>
                <a
                  href={`tel:${owner?.phone?.replace(/\D/g, "")}`}
                  className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium transition-colors"
                >
                  <Phone size={13} className="mr-0.5" /> Call
                </a>
              </>
            )}

            {/* SECURE OWNER CONTROL ACTIONS: Mount Delete Only if Authenticated Target Matches Record Owner */}
            {loggedInOwner?.id === owner?.id && (
              <button
                onClick={handleDelete}
                className="flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium transition-colors cursor-pointer border-0"
                title="Permanently remove this property from database"
              >
                <Trash2 size={13} className="mr-0.5" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal View Management portal */}
      <ImageModal
        images={images}
        modalIndex={modalImageIndex}
        setModalIndex={setModalImageIndex}
      />
    </div>
  );
};

export default PropertyCard;