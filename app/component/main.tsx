import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Upload, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import ResoucePicker from "./resoucePicker";

interface RecentImage {
  id: string;
  url: string;
  thumbnail: string;
}

const ImageEditor = ({ theme, userId,url }: { theme: string, userId: any,url?:string }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // For background removal
  const [generatingBackground, setGeneratingBackground] = useState(false); // For AI background generation
  const [credits, setCredits] = useState(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [pebblyImage, setPebblyImage] = useState("");
  const [zoom, setZoom] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  //this is for shopify resource picker
  const handleProductImageUpload2 = async (productImage: string) => {
    if (productImage) {
      setLoading(true);
      try {
        const response = await fetch(productImage);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = async () => {
          try {
            const base64Image = reader.result as string;
            setSelectedImage(base64Image);

            const uploadResponse = await axios.post("/api/bgRemove", {
              image: base64Image.split(",")[1],
              userId,
            });

            setSelectedImage(uploadResponse.data.resultImage);
            setImageUrl(uploadResponse.data.imageName);
          } catch (error) {
            console.error("Error processing product image:", error);
          } finally {
            setLoading(false);
          }
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching product image:", error);
        setLoading(false);
      }
    }
  };


  //this is for file input
  const handleImageUpload = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setLoading(true);
      try {
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64Image = reader.result as string;
          setSelectedImage(base64Image);
          
          try {
            const response = await axios.post("/api/bgRemove", {
              image: base64Image.split(",")[1],
              userId,
            });
           
            setSelectedImage(response.data.resultImage);
            setImageUrl(response.data.imageName);
          } catch (error) {
            console.error("Error removing background:", error);
          } finally {
            setLoading(false);
          }
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        setLoading(false);
      }
    } else {
      alert("Please upload an image file (PNG, JPG, etc)");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleImageUpload(event.target.files[0]);
    }
  };

  const handleCreateBackground = async () => {
    if (!imageUrl) {
      alert("Please upload an image first");
      return;
    }

    setGeneratingBackground(true); // Use separate loading state for generation
    try {
      const response = await fetch('/api/createBackground', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: `${url}/${imageUrl}`,
          theme,
          userId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
        setPebblyImage(data.imageName);
        setGeneratedImage(`data:image/png;base64,${data.data}`);
      } 
    } catch (error) {
      console.error('Error calling server API:', error);
    } finally {
      setGeneratingBackground(false);
    }
  };

  return (
    <div className="flex flex-col h-screen mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Background AI Tool</h1>
        <ResoucePicker handleUploadImage={handleProductImageUpload2}/>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg relative">
        <div
          className={`w-full h-full flex items-center justify-center ${
            !selectedImage ? 'border-2 border-dashed border-gray-300 rounded-lg' : ''
          } ${dragActive ? 'border-primary bg-primary/10' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !selectedImage && fileInputRef.current?.click()}
        >
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              <p className="mt-4 animate-bounce">Removing background...</p>
            </div>
          ) : selectedImage ? (
            <>
              <img
                src={processedImage || selectedImage}
                alt="Uploaded image"
                className="max-h-full max-w-full object-contain transition-transform"
                style={{ transform: `scale(${zoom})` }}
              />
              {generatingBackground && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                  <p className="mt-4 animate-bounce">Generating AI background...</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 cursor-pointer">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Click to upload or drag and drop</p>
              {/* <p className="text-sm text-gray-400 mt-2">PNG, JPG up to 10MB</p> */}
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {selectedImage && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button 
            size="icon"
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          >
            <ZoomOut className="w-6 h-6" />
          </Button>
          <Button 
            size="icon"
            onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
          >
            <ZoomIn className="w-6 h-6" />
          </Button>
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent</h2>
          {/* <Button>View all</Button> */}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {pebblyImage && (
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={`${url}/${pebblyImage}`}
                alt="Generated image"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Button
            className="aspect-square flex items-center justify-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs">Upload New</span>
          </Button>
        </div>
      </div>

      <Button 
        className="mt-6 w-full py-6 text-lg font-semibold" 
        size="lg" 
        onClick={handleCreateBackground}
        disabled={!imageUrl || loading || generatingBackground}
      >
        {generatingBackground ? 'Generating Background...' : 'GENERATE'}
      </Button>
    </div>
  );
};

export default ImageEditor;