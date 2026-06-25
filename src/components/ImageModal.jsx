// ImageModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import { useSwipeable } from "react-swipeable";

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
        {...modalSwipeHandlers}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[modalIndex]?.imgUrl}
          alt="Modal"
          className="w-full max-h-[80vh] object-contain rounded"
        />

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-white text-3xl font-bold"
        >
          ×
        </button>

        {/* Navigation */}
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

export default ImageModal;
