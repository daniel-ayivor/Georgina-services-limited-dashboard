// components/ImageUploadWithFile.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";

interface ImageUploadWithFileProps {
  onImageChange: (file: File | null, previewUrl: string) => void;
  currentImage?: string;
  className?: string;
}

export const ImageUploadWithFile: React.FC<ImageUploadWithFileProps> = ({
  onImageChange,
  currentImage,
  className = ""
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Pass the File object to parent
      onImageChange(file, objectUrl);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    onImageChange(null, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`border-2 border-dashed rounded-lg p-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-40 mx-auto rounded object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
          >
            Upload Image
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Click to select an image file (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
};