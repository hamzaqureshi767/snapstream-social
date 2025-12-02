import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileGrid from "@/components/profile/ProfileGrid";
import { currentUser, users, posts as mockPosts } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileData {
  id: string;
  username: string;
  full_name: string | null;
  avatar: string | null;
  bio: string | null;
  website: string | null;
}

interface PostData {
  id: string;
  image_url: string;
  likes_count: number;
  caption: string | null;
  created_at: string;
}

const Profile = () => {
  const { username } = useParams();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      if (username) {
        // Fetch profile by username
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);

          // Fetch posts for this user
          const { data: postsData } = await supabase
            .from("posts")
            .select("id, image_url, likes_count, caption, created_at")
            .eq("user_id", profileData.id)
            .order("created_at", { ascending: false });

          setUserPosts(postsData || []);
        }
      } else if (authUser) {
        // Own profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);

          // Fetch own posts
          const { data: postsData } = await supabase
            .from("posts")
            .select("id, image_url, likes_count, caption, created_at")
            .eq("user_id", authUser.id)
            .order("created_at", { ascending: false });

          setUserPosts(postsData || []);
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, [username, authUser]);

  // Fallback to mock data if no real profile
  const isOwnProfile = !username || (profile && authUser && profile.id === authUser.id);
  
  const displayUser = profile
    ? {
        id: profile.id,
        username: profile.username,
        fullName: profile.full_name || "",
        avatar: profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        bio: profile.bio || "",
        website: profile.website || "",
        followers: 0,
        following: 0,
        postsCount: userPosts.length,
        isFollowing: false,
      }
    : username
    ? users.find((u) => u.username === username) || currentUser
    : currentUser;

  const [postsList, setPostsList] = useState(userPosts);

  // Update postsList when userPosts changes
  useEffect(() => {
    setPostsList(userPosts);
  }, [userPosts]);

  const displayPosts = postsList.length > 0
    ? postsList.map((p) => ({
        id: p.id,
        user: displayUser,
        image: p.image_url,
        caption: p.caption || "",
        likes: p.likes_count,
        comments: [],
        timestamp: new Date(p.created_at),
        isLiked: false,
        isSaved: false,
      }))
    : mockPosts.filter((p) => p.user.id === displayUser.id).slice(0, 6);

  const handlePostDelete = (postId: string) => {
    setPostsList((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) {
    return (
      <MainLayout showHeader={false}>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4 p-4">
            <div className="flex gap-8">
              <div className="w-20 h-20 md:w-36 md:h-36 rounded-full bg-secondary" />
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-secondary rounded w-32" />
                <div className="h-4 bg-secondary rounded w-48" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={false}>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader user={displayUser} isOwnProfile={!!isOwnProfile} />
        <ProfileGrid 
          posts={displayPosts} 
          isOwnProfile={!!isOwnProfile}
          onPostDelete={handlePostDelete}
        />
      </div>
    </MainLayout>
  );
};

export default Profile;
