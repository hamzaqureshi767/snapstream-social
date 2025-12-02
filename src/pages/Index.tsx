import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StoriesBar from "@/components/stories/StoriesBar";
import Feed from "@/components/posts/Feed";
import { users, formatNumber } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ username: string; full_name: string | null; avatar: string | null } | null>(
    null,
  );
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("username, full_name, avatar")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  const handleFollow = (userId: string) => {
    setFollowedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  return (
    <MainLayout>
      <div className="flex justify-center gap-8">
        {/* Main Feed */}
        <div className="w-full max-w-[470px]">
          <StoriesBar />
          <Feed />
        </div>

        {/* Suggestions Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-80 pt-8 pr-8">
          <div className="sticky top-8">
            {/* Current User */}
            <div className="flex items-center gap-3 mb-6">
              <Link to="/profile">
                <img
                  src={
                    profile?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                  }
                  alt="Your profile"
                  className="w-11 h-11 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <Link to="/profile" className="font-semibold text-sm">
                  {profile?.username || "yourprofile"}
                </Link>
                <p className="text-sm text-muted-foreground">{profile?.full_name || "Your Name"}</p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">Suggested for you</span>
              <Button type="button" variant="link" className="text-xs p-0 h-auto text-foreground">
                See All
              </Button>
            </div>

            <div className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Link to={`/profile/${user.username}`}>
                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/profile/${user.username}`}
                      className="font-semibold text-sm truncate flex items-center gap-1"
                    >
                      {user.username}
                      {user.isVerified && (
                        <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">{formatNumber(user.followers)} followers</p>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs p-0 h-auto"
                    onClick={() => handleFollow(user.id)}
                  >
                    {followedUsers.includes(user.id) ? "Following" : "Follow"}
                  </Button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <footer className="mt-8 text-xs text-muted-foreground/60">
              <nav className="flex flex-wrap gap-x-1 gap-y-0.5 mb-4">
                <span className="hover:underline cursor-pointer">About</span> ·
                <span className="hover:underline cursor-pointer">Help</span> ·
                <span className="hover:underline cursor-pointer">Press</span> ·
                <span className="hover:underline cursor-pointer">API</span> ·
                <span className="hover:underline cursor-pointer">Jobs</span> ·
                <span className="hover:underline cursor-pointer">Privacy</span> ·
                <span className="hover:underline cursor-pointer">Terms</span>
              </nav>
              <p>© 2025 INSTAGRAM</p>
            </footer>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
};

export default Index;
