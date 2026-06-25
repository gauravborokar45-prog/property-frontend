import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOCAL_STORAGE_KEY = "imageFormData";

/**
 * HELPER: Defined outside to ensure global scope within the file.
 * This handles the compression to keep S3 storage efficient.
 */
const compressImageToMaxSize = (file, maxWidth = 1000, maxSizeKB = 1000) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleFactor = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleFactor;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) return reject("Compression failed");
            if (blob.size / 1024 <= maxSizeKB || quality < 0.3) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              quality -= 0.1;
              tryCompress();
            }
          }, "image/jpeg", quality);
        };
        tryCompress();
      };
    };
    reader.readAsDataURL(file);
  });
};

const ImagesForm = ({ onNext, onBack, onImageUploadComplete, initialImages = [] }) => {
  const [localFiles, setLocalFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(initialImages); // Pre-fill with existing S3 URLs if any
  const [uploading, setUploading] = useState(false);

  // Sync with localStorage to prevent data loss on accidental refresh
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // We only keep permanent HTTP URLs (S3 links) on refresh. 
      // Temporary 'blob:' URLs will be broken after refresh.
      const validS3Links = (parsed.previews || []).filter(url => url.startsWith("http") && !url.startsWith("blob"));
      if (validS3Links.length > 0 && previewUrls.length === 0) {
          setPreviewUrls(validS3Links);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setLocalFiles(prev => [...prev, ...files]);
    
    // Create temporary blob URLs for immediate UI feedback
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleRemove = (index) => {
    const updatedFiles = [...localFiles];
    const updatedPreviews = [...previewUrls];
    
    // Check if we are removing a newly selected file or an already uploaded S3 link
    const removedUrl = updatedPreviews[index];
    
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);

    // If it was a local file, remove it from the upload queue
    if (removedUrl.startsWith("blob:")) {
        updatedFiles.splice(index, 1);
        setLocalFiles(updatedFiles);
    }
    
    // Update parent immediately so state stays in sync
    onImageUploadComplete(updatedPreviews.filter(url => url.startsWith("http")));
  };

  const handleUploadAndNext = async () => {
    // If no new files to upload, just check if we have existing S3 images
    if (localFiles.length === 0) {
      if (previewUrls.length > 0) {
        onNext();
      } else {
        alert("Please select at least one image.");
      }
      return;
    }

    setUploading(true);
    // Start with existing S3 URLs
    const uploadedUrls = [...previewUrls.filter(url => url.startsWith("http"))];

    try {
      for (let file of localFiles) {
        const compressed = await compressImageToMaxSize(file);
        
        // 1. Get Presigned URL from Spring Boot
        const { data } = await axios.get(`${API_BASE_URL}/api/s3/generate-url`, {
          params: { fileName: compressed.name, contentType: compressed.type }
        });

        // 2. Upload to S3
        await axios.put(data.uploadUrl, compressed, {
          headers: { "Content-Type": compressed.type }
        });

        uploadedUrls.push(data.publicUrl);
      }

      // 3. CRITICAL: Pass the final list back to Parent (App.jsx)
      onImageUploadComplete(uploadedUrls);
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ previews: uploadedUrls }));
      setUploading(false);
      onNext();
    } catch (err) {
      console.error("S3 Upload Error:", err);
      alert("Upload failed. Verify your S3 Bucket CORS settings.");
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Step 4: Property Gallery</h2>
      <p className="text-sm text-gray-500 mb-6">Add high-quality images of the rooms, kitchen, and balcony.</p>
      
      <div className="group relative border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-blue-50/30">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={uploading} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-blue-500 font-medium">
          {uploading ? "Uploading files..." : "Click to upload or drag and drop images"}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {previewUrls.map((url, i) => (
          <div key={i} className="relative aspect-video rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
            <img src={url} className="w-full h-full object-cover" alt="Property" />
            {!uploading && (
              <button 
                onClick={() => handleRemove(i)} 
                className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            )}
            {url.startsWith('blob:') && (
                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-[10px] py-0.5 text-center">
                    Pending Upload
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={onBack} disabled={uploading} className="px-6 py-2 text-gray-600 font-semibold">Back</button>
        <button 
          onClick={handleUploadAndNext} 
          disabled={uploading}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? "Uploading to S3..." : "Next Step"}
        </button>
      </div>
    </div>
  );
};

export default ImagesForm;