"use client";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import { useGetGallery } from "@/queries/galleryQuery";
import { useRouter } from "next/navigation";
import { PlusIcon, XMarkIcon, PhotoIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ImageData {
  url: string;
  caption: string;
}

// Sample gallery data with images from public/img
const sampleGallery: ImageData[] = [
  { url: "/img/short-knotless-braids.png", caption: "Short Knotless Braids" },
  { url: "/img/sen-twists.png", caption: "Senegalese Twists" },
  { url: "/img/knotless-braids.png", caption: "Knotless Braids" },
  { url: "/img/invicible-locs.png", caption: "Invisible Locs" },
  { url: "/img/fulani-braids.png", caption: "Fulani Braids" },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [localGallery, setLocalGallery] = useState<ImageData[]>([]);
  const { data: galleryData, isLoading, refetch } = useGetGallery();
  const router = useRouter();

  // Use sample gallery data if the API data is not available
  const gallery = localGallery.length > 0 ? localGallery : (galleryData || sampleGallery).slice(0, 5);
  
  // Initialize localGallery when galleryData changes
  useEffect(() => {
    if (galleryData) {
      setLocalGallery(galleryData.slice(0, 5));
    } else {
      setLocalGallery(sampleGallery.slice(0, 5));
    }
  }, [galleryData]);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically upload the image to your server/storage
    // and then update the gallery
    // For now, we'll just close the modal and reset the form
    setIsUploadModalOpen(false);
    setUploadedImage(null);
    setImageCaption("");
    setIsUploading(false);
    
    // Refresh gallery data
    refetch();
  };

  const handleDeleteImage = (imageUrl: string) => {
    setImageToDelete(imageUrl);
  };

  const confirmDelete = () => {
    if (!imageToDelete) return;
    
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to delete the image
      
      // Update the gallery state
      if (galleryData) {
        // If we're using API data, we would update it here
        console.log(`Deleting image: ${imageToDelete}`);
      } else {
        // If we're using sample data, we can't modify it directly
        // In a real app, this would update the backend
        console.log(`Deleting image: ${imageToDelete}`);
      }
      
      // Remove the image from the frontend
      const updatedGallery = gallery.filter(img => img.url !== imageToDelete);
      // Since we can't directly modify the state of galleryData or sampleGallery,
      // we'll need to use a local state to track the gallery
      setLocalGallery(updatedGallery);
      
      setIsDeleting(false);
      setImageToDelete(null);
    }, 500);
  };

  const cancelDelete = () => {
    setImageToDelete(null);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="relative rounded-xl overflow-hidden shadow-md">
        <div 
          className="h-32 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/gallery.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 flex flex-col justify-center p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Braids Gallery
            </h1>
            <p className="text-gray-200 text-sm md:text-base max-w-2xl">
              Manage and showcase your braid styles collection
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="absolute bottom-3 right-3 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          aria-label="Upload new image"
          title="Upload new image"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Gallery Grid */}
      {isLoading || isDeleting ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {gallery.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No images found</h3>
              <p className="text-gray-500 mb-4">Upload a new image to showcase your work</p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Upload Image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gallery.map((image: ImageData, index: number) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-xl shadow-md cursor-pointer group ${
                    index % 5 === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square">
                    <Image
                      src={image.url}
                      width={500}
                      height={500}
                      alt={image.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-medium text-lg">{image.caption}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.url);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                    aria-label="Delete image"
                    title="Delete image"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <Dialog
              open={true}
              onClose={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
              
              <Dialog.Panel className="relative max-w-4xl w-full mx-4 rounded-xl overflow-hidden shadow-2xl">
                <div className="relative">
                  <Image
                    src={selectedImage.url}
                    width={1200}
                    height={800}
                    alt={selectedImage.caption}
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-xl font-medium">{selectedImage.caption}</p>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Close image"
                    title="Close image"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </Dialog.Panel>
            </Dialog>
          )}
        </>
      )}

      {/* Upload Modal */}
      <Dialog
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        
        <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Add to Gallery
              </Dialog.Title>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close upload modal"
                title="Close upload modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div 
              className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                    aria-label="Remove image"
                    title="Remove image"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1">Drag and drop your image here</p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                    Browse Files
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-400 text-xs mt-2">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                placeholder="Describe your braid style"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!uploadedImage || isUploading}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isUploading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!imageToDelete}
        onClose={cancelDelete}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        
        <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Delete Image
              </Dialog.Title>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close delete modal"
                title="Close delete modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden">
                  {imageToDelete && (
                    <Image
                      src={imageToDelete}
                      alt="Image to delete"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isDeleting ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
