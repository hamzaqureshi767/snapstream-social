import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ImageIcon, MapPin, ChevronLeft, X } from "lucide-react";
import { currentUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"select" | "caption">("select");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setStep("caption");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    toast({
      title: "Post shared!",
      description: "Your post has been shared successfully.",
    });
    navigate("/");
  };

  return (
    <MainLayout showHeader={false}>
      <div className="min-h-screen md:flex md:items-center md:justify-center md:py-8">
        <div className="bg-background md:border md:border-border md:rounded-xl md:overflow-hidden md:max-w-4xl md:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {step === "select" ? (
              <button onClick={() => navigate(-1)}>
                <X className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={() => setStep("select")}>
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="font-semibold">Create new post</h1>
            {step === "caption" ? (
              <Button variant="link" onClick={handleShare} className="text-primary font-semibold">
                Share
              </Button>
            ) : (
              <div className="w-12" />
            )}
          </div>

          {step === "select" ? (
            /* Image Selection */
            <div className="flex flex-col items-center justify-center py-20 md:py-40 px-4">
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-muted-foreground" strokeWidth={1} />
              </div>
              <h2 className="text-xl mb-4">Drag photos and videos here</h2>
              <Button onClick={() => fileInputRef.current?.click()}>
                Select from computer
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            /* Caption Step */
            <div className="md:flex">
              {/* Image Preview */}
              <div className="aspect-square md:w-1/2 bg-muted">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Caption Form */}
              <div className="md:w-1/2 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-semibold text-sm">{currentUser.username}</span>
                </div>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full h-40 bg-transparent resize-none focus:outline-none text-sm"
                  maxLength={2200}
                />
                <div className="text-right text-xs text-muted-foreground mb-4">
                  {caption.length}/2,200
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between py-3">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Add location"
                      className="flex-1 bg-transparent focus:outline-none text-sm"
                    />
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Create;
