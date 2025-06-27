import React, { useCallback, useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  onClear: () => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-placeholder" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleDrag, onImageUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const onUploaderClick = () => {
    fileInputRef.current?.click();
  };

  if (imageUrl) {
    return (
      <div className="w-full text-center">
        <img src={imageUrl} alt="Uploaded preview" className="max-h-80 w-auto mx-auto rounded-lg shadow-md mb-4"/>
        <button 
          onClick={onClear} 
          className="bg-white/5 hover:bg-red-500/20 text-text-secondary hover:text-red-400 font-bold py-2 px-6 rounded-lg transition-colors duration-300 border border-white/10"
        >
          Clear Image
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-80 flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${isDragging ? 'border-brand-accent bg-brand-accent/10 scale-105' : 'border-white/20 hover:border-text-secondary'}`}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDragOver={(e) => handleDrag(e, true)}
      onDrop={handleDrop}
      onClick={onUploaderClick}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange}
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
      />
      <UploadIcon />
      <p className="mt-4 text-lg font-semibold text-text-primary">Drag & drop an image here</p>
      <p className="text-text-placeholder">or click to select a file</p>
    </div>
  );
};