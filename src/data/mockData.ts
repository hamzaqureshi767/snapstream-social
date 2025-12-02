export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  website?: string;
  followers: number;
  following: number;
  postsCount: number;
  isFollowing: boolean;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  isLiked: boolean;
  isSaved: boolean;
  location?: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
  likes: number;
}

export interface Story {
  id: string;
  user: User;
  image: string;
  timestamp: Date;
  isViewed: boolean;
}

export const currentUser: User = {
  id: "1",
  username: "yourprofile",
  fullName: "Your Name",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
  bio: "Digital creator ✨ Living life one post at a time",
  website: "yourwebsite.com",
  followers: 1234,
  following: 567,
  postsCount: 42,
  isFollowing: false,
};

export const users: User[] = [
  {
    id: "2",
    username: "sarah_designs",
    fullName: "Sarah Anderson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "UI/UX Designer 🎨 Coffee lover ☕",
    website: "sarahdesigns.co",
    followers: 15420,
    following: 892,
    postsCount: 156,
    isFollowing: true,
    isVerified: true,
  },
  {
    id: "3",
    username: "travel_mike",
    fullName: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Exploring the world 🌍 50+ countries",
    website: "travelmike.blog",
    followers: 89320,
    following: 234,
    postsCount: 892,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "4",
    username: "foodie_emma",
    fullName: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Food blogger 🍕 Recipe developer",
    followers: 45600,
    following: 1200,
    postsCount: 423,
    isFollowing: true,
  },
  {
    id: "5",
    username: "alex_fitness",
    fullName: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Fitness coach 💪 Transform your life",
    website: "alexfitness.com",
    followers: 234000,
    following: 150,
    postsCount: 1024,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "6",
    username: "nature_lily",
    fullName: "Lily Park",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    bio: "Nature photographer 🌿 Finding beauty everywhere",
    followers: 67800,
    following: 456,
    postsCount: 312,
    isFollowing: true,
  },
];

export const posts: Post[] = [
  {
    id: "1",
    user: users[0],
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop",
    caption: "Golden hour magic ✨ Sometimes the best moments are the unexpected ones. #photography #goldenHour #sunset",
    likes: 1234,
    comments: [
      {
        id: "c1",
        user: users[1],
        text: "Absolutely stunning! 😍",
        timestamp: new Date(Date.now() - 3600000),
        likes: 12,
      },
      {
        id: "c2",
        user: users[2],
        text: "Where is this?",
        timestamp: new Date(Date.now() - 7200000),
        likes: 5,
      },
    ],
    timestamp: new Date(Date.now() - 14400000),
    isLiked: false,
    isSaved: false,
    location: "Malibu, California",
  },
  {
    id: "2",
    user: users[1],
    image: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=800&h=800&fit=crop",
    caption: "Adventure awaits 🏔️ New journey, new memories. Who else loves mountain vibes? #adventure #mountains #hiking",
    likes: 8923,
    comments: [
      {
        id: "c3",
        user: users[3],
        text: "Take me there! 🙌",
        timestamp: new Date(Date.now() - 1800000),
        likes: 23,
      },
    ],
    timestamp: new Date(Date.now() - 28800000),
    isLiked: true,
    isSaved: true,
    location: "Swiss Alps",
  },
  {
    id: "3",
    user: users[2],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop",
    caption: "Homemade pasta perfection 🍝 Recipe in bio! #foodie #homemade #italianFood #cooking",
    likes: 5621,
    comments: [
      {
        id: "c4",
        user: users[0],
        text: "I need this recipe ASAP! 😋",
        timestamp: new Date(Date.now() - 900000),
        likes: 8,
      },
      {
        id: "c5",
        user: users[4],
        text: "Looks delicious!",
        timestamp: new Date(Date.now() - 1200000),
        likes: 3,
      },
    ],
    timestamp: new Date(Date.now() - 43200000),
    isLiked: false,
    isSaved: false,
  },
  {
    id: "4",
    user: users[3],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop",
    caption: "Morning workout done ✅ Consistency is key 💪 #fitness #workout #motivation #gym",
    likes: 15234,
    comments: [],
    timestamp: new Date(Date.now() - 86400000),
    isLiked: true,
    isSaved: false,
    location: "LA Fitness",
  },
  {
    id: "5",
    user: users[4],
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop",
    caption: "Into the wild 🌲 Sometimes you need to disconnect to reconnect. #nature #forest #peaceful",
    likes: 7845,
    comments: [
      {
        id: "c6",
        user: users[1],
        text: "This is so peaceful 🙏",
        timestamp: new Date(Date.now() - 3600000),
        likes: 15,
      },
    ],
    timestamp: new Date(Date.now() - 172800000),
    isLiked: false,
    isSaved: true,
  },
];

export const stories: Story[] = [
  {
    id: "s1",
    user: currentUser,
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=700&fit=crop",
    timestamp: new Date(Date.now() - 3600000),
    isViewed: false,
  },
  {
    id: "s2",
    user: users[0],
    image: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=400&h=700&fit=crop",
    timestamp: new Date(Date.now() - 7200000),
    isViewed: false,
  },
  {
    id: "s3",
    user: users[1],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop",
    timestamp: new Date(Date.now() - 14400000),
    isViewed: true,
  },
  {
    id: "s4",
    user: users[2],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=700&fit=crop",
    timestamp: new Date(Date.now() - 21600000),
    isViewed: false,
  },
  {
    id: "s5",
    user: users[3],
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop",
    timestamp: new Date(Date.now() - 28800000),
    isViewed: true,
  },
  {
    id: "s6",
    user: users[4],
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=700&fit=crop",
    timestamp: new Date(Date.now() - 36000000),
    isViewed: false,
  },
];

export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return `${weeks}w`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
