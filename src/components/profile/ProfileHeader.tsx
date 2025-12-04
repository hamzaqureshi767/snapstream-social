import { useState, useRef } from "react";
import { Settings, Grid3X3, Bookmark, UserSquare2, Camera, Loader2 } from "lucide-react";
import { User, formatNumber } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EditProfileDialog from "./EditProfileDialog";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onAvatarUpdate?: (newUrl: string) => void;
}

const ProfileHeader = ({ user, isOwnProfile = false, onAvatarUpdate }: ProfileHeaderProps) => {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user.username,
    fullName: user.fullName,
    bio: user.bio,
    website: user.website || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${authUser.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // Add cache-busting query param
      const newAvatarUrl = `${publicUrl}?t=${Date.now()}`;

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: newAvatarUrl })
        .eq('id', authUser.id);

      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      onAvatarUpdate?.(newAvatarUrl);
      toast({ title: "Profile picture updated!" });
    } catch (error: any) {
      toast({ title: "Failed to update picture", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-background">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Settings className="w-6 h-6" />
          <span className="font-semibold">{user.username}</span>
          <div className="w-6" />
        </div>
      </div>

      <div className="p-4 md:py-8 md:px-8 max-w-4xl mx-auto">
        {/* Profile Info */}
        <div className="flex gap-6 md:gap-20">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden ring-2 ring-border">
                {isUploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={avatarUrl || '/default-avatar.jpg'}
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
                  />
                )}
              </div>
              {isOwnProfile && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            {/* Desktop username and buttons */}
            <div className="hidden md:flex items-center gap-4 mb-4">
              <h1 className="text-xl">{user.username}</h1>
              {user.isVerified && (
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
              {isOwnProfile ? (
                <>
                  <Button variant="secondary" size="sm" onClick={() => setShowEditDialog(true)}>
                    Edit profile
                  </Button>
                  <Button variant="secondary" size="sm">View archive</Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? "following" : "follow"}
                    size="sm"
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="secondary" size="sm">Message</Button>
                </>
              )}
            </div>

            {/* Stats - Desktop */}
            <div className="hidden md:flex gap-8 mb-4">
              <span><strong>{user.postsCount}</strong> posts</span>
              <button type="button" className="hover:opacity-70"><strong>{formatNumber(user.followers)}</strong> followers</button>
              <button type="button" className="hover:opacity-70"><strong>{formatNumber(user.following)}</strong> following</button>
            </div>

            {/* Bio - Desktop */}
            <div className="hidden md:block">
              <p className="font-semibold">{profileData.fullName}</p>
              <p className="whitespace-pre-wrap">{profileData.bio}</p>
              {profileData.website && (
                <a
                  href={`https://${profileData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  {profileData.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bio */}
        <div className="md:hidden mt-4">
          <p className="font-semibold">{profileData.fullName}</p>
          <p className="whitespace-pre-wrap text-sm">{profileData.bio}</p>
          {profileData.website && (
            <a
              href={`https://${profileData.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold text-sm hover:underline"
            >
              {profileData.website}
            </a>
          )}
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex gap-2 mt-4">
          {isOwnProfile ? (
            <>
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowEditDialog(true)}>
                Edit profile
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">Share profile</Button>
            </>
          ) : (
            <>
              <Button
                variant={isFollowing ? "following" : "follow"}
                size="sm"
                className="flex-1"
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">Message</Button>
            </>
          )}
        </div>

        {/* Mobile Stats */}
        <div className="md:hidden flex justify-around py-4 mt-4 border-t border-border">
          <div className="text-center">
            <p className="font-semibold">{user.postsCount}</p>
            <p className="text-xs text-muted-foreground">posts</p>
          </div>
          <button type="button" className="text-center">
            <p className="font-semibold">{formatNumber(user.followers)}</p>
            <p className="text-xs text-muted-foreground">followers</p>
          </button>
          <button type="button" className="text-center">
            <p className="font-semibold">{formatNumber(user.following)}</p>
            <p className="text-xs text-muted-foreground">following</p>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-border">
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={cn(
            "flex-1 md:flex-none flex items-center justify-center gap-2 py-3 md:px-12 border-t transition-colors",
            activeTab === "posts"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
          )}
        >
          <Grid3X3 className="w-4 h-4 md:w-3 md:h-3" />
          <span className="hidden md:inline text-xs uppercase tracking-wider font-semibold">Posts</span>
        </button>
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 py-3 md:px-12 border-t transition-colors",
              activeTab === "saved"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground"
            )}
          >
            <Bookmark className="w-4 h-4 md:w-3 md:h-3" />
            <span className="hidden md:inline text-xs uppercase tracking-wider font-semibold">Saved</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab("tagged")}
          className={cn(
            "flex-1 md:flex-none flex items-center justify-center gap-2 py-3 md:px-12 border-t transition-colors",
            activeTab === "tagged"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
          )}
        >
          <UserSquare2 className="w-4 h-4 md:w-3 md:h-3" />
          <span className="hidden md:inline text-xs uppercase tracking-wider font-semibold">Tagged</span>
        </button>
      </div>

      {/* Edit Profile Dialog */}
      {isOwnProfile && (
        <EditProfileDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          profile={profileData}
          onProfileUpdate={(updated) => setProfileData(updated)}
        />
      )}
    </div>
  );
};

export default ProfileHeader;