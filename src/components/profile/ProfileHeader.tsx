import { useState } from "react";
import { Settings, Grid3X3, Bookmark, UserSquare2 } from "lucide-react";
import { User, formatNumber } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
}

const ProfileHeader = ({ user, isOwnProfile = false }: ProfileHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");

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
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden ring-2 ring-border">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
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
                  <Button variant="secondary" size="sm">Edit profile</Button>
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
              <button className="hover:opacity-70"><strong>{formatNumber(user.followers)}</strong> followers</button>
              <button className="hover:opacity-70"><strong>{formatNumber(user.following)}</strong> following</button>
            </div>

            {/* Bio - Desktop */}
            <div className="hidden md:block">
              <p className="font-semibold">{user.fullName}</p>
              <p className="whitespace-pre-wrap">{user.bio}</p>
              {user.website && (
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  {user.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bio */}
        <div className="md:hidden mt-4">
          <p className="font-semibold">{user.fullName}</p>
          <p className="whitespace-pre-wrap text-sm">{user.bio}</p>
          {user.website && (
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold text-sm hover:underline"
            >
              {user.website}
            </a>
          )}
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex gap-2 mt-4">
          {isOwnProfile ? (
            <>
              <Button variant="secondary" size="sm" className="flex-1">Edit profile</Button>
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
          <button className="text-center">
            <p className="font-semibold">{formatNumber(user.followers)}</p>
            <p className="text-xs text-muted-foreground">followers</p>
          </button>
          <button className="text-center">
            <p className="font-semibold">{formatNumber(user.following)}</p>
            <p className="text-xs text-muted-foreground">following</p>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-border">
        <button
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
    </div>
  );
};

export default ProfileHeader;
