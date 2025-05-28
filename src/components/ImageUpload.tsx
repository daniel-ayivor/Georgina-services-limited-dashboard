
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image as ImageIcon } from "lucide-react";
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
      toast({ variant: "destructive", title: "Invalid file type", description: "Please select an image file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Please select an image smaller than 5MB." });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onImageChange(publicUrl);

      toast({ title: "Image uploaded", description: "Product image has been uploaded successfully." });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ variant: "destructive", title: "Upload failed", description: "Failed to upload image. Please try again." });
    } finally {
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
  className="cursor-pointer w-80 sm:max-w-lg md:max-w-2xl h-28 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center relative group hover:border-muted-foreground"
>
  {previewUrl ? (
    <>
      <img
        src={previewUrl}
        alt="Product preview"
        className="w-full h-full object-cover rounded-md"
      />
      {!disabled && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 z-10"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleRemoveImage();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </>
  ) : (
    <div className="text-center">
      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{isUploading ? "Uploading..." : "Click to upload image"}</p>
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
