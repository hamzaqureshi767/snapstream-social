import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PostCard from "./PostCard";
import { posts as mockPosts } from "@/data/mockData";

interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  location: string | null;
  likes_count: number;
  created_at: string;
  profile: {
    id: string;
    username: string;
    full_name: string | null;
    avatar: string | null;
  };
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profile:profiles!posts_user_id_fkey (
            id,
            username,
            full_name,
            avatar
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();

    // Subscribe to new posts
    const channel = supabase
      .channel('posts-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        async (payload) => {
          // Fetch the profile for the new post
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar')
            .eq('id', payload.new.user_id)
            .single();

          if (profile) {
            const newPost = { ...payload.new, profile } as Post;
            setPosts(prev => [newPost, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-[470px] mx-auto">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-secondary rounded-lg h-96" />
          ))}
        </div>
      </div>
    );
  }

  // Show real posts if available, otherwise show mock posts
  if (posts.length === 0) {
    return (
      <div className="max-w-[470px] mx-auto">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-[470px] mx-auto">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={{
            id: post.id,
            user: {
              id: post.profile.id,
              username: post.profile.username,
              fullName: post.profile.full_name || '',
              avatar: post.profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
              bio: '',
              followers: 0,
              following: 0,
              postsCount: 0,
              isFollowing: false,
            },
            image: post.image_url,
            caption: post.caption || '',
            likes: post.likes_count,
            comments: [],
            timestamp: new Date(post.created_at),
            location: post.location || undefined,
            isLiked: false,
            isSaved: false,
          }}
        />
      ))}
    </div>
  );
};

export default Feed;
