import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ currentImageUrl, onImageChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ 
        variant: "destructive", 
        title: "Invalid file type", 
        description: "Please select an image file." 
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        variant: "destructive", 
        title: "File too large", 
        description: "Please select an image smaller than 5MB." 
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64 for local storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onImageChange(base64String);
        toast({ 
          title: "Image uploaded", 
          description: "Product image has been uploaded successfully." 
        });
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast({ 
          variant: "destructive", 
          title: "Upload failed", 
          description: "Failed to upload image. Please try again." 
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        variant: "destructive", 
        title: "Upload failed", 
        description: "Failed to upload image. Please try again." 
      });
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid gap-4">
      <Label htmlFor="image">Product Image</Label>
      
      <label
        htmlFor="image"
        className="cursor-pointer w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center relative group hover:border-muted-foreground transition-colors"
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Product preview"
              className="w-full h-full object-contain rounded-md"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRemoveImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="text-center p-4">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Click to upload image"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        )}

        <Input
          ref={fileInputRef}
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
