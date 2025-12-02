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
  {
    id: "7",
    username: "photo_james",
    fullName: "James Williams",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Photography is my passion 📸",
    followers: 23400,
    following: 345,
    postsCount: 234,
    isFollowing: false,
  },
  {
    id: "8",
    username: "art_sophia",
    fullName: "Sophia Martinez",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Artist & Dreamer 🎨",
    followers: 56700,
    following: 890,
    postsCount: 189,
    isFollowing: true,
  },
  {
    id: "9",
    username: "music_david",
    fullName: "David Kim",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    bio: "Music Producer 🎵",
    followers: 12300,
    following: 567,
    postsCount: 78,
    isFollowing: false,
  },
  {
    id: "10",
    username: "yoga_maya",
    fullName: "Maya Thompson",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    bio: "Yoga instructor 🧘‍♀️ Peace & Balance",
    followers: 34500,
    following: 234,
    postsCount: 456,
    isFollowing: true,
  },
  {
    id: "11",
    username: "tech_ryan",
    fullName: "Ryan Cooper",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
    bio: "Software Engineer 💻 Building the future",
    website: "ryancooper.dev",
    followers: 45600,
    following: 321,
    postsCount: 167,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "12",
    username: "fashion_nina",
    fullName: "Nina Patel",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    bio: "Fashion Blogger 👗 Style is eternal",
    website: "ninapatel.fashion",
    followers: 128000,
    following: 567,
    postsCount: 892,
    isFollowing: true,
    isVerified: true,
  },
  {
    id: "13",
    username: "chef_marco",
    fullName: "Marco Rossi",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    bio: "Executive Chef 👨‍🍳 Michelin Star Restaurant",
    followers: 89000,
    following: 234,
    postsCount: 534,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "14",
    username: "adventure_zoe",
    fullName: "Zoe Williams",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    bio: "Adventure Seeker 🏔️ Living on the edge",
    followers: 67800,
    following: 456,
    postsCount: 345,
    isFollowing: true,
  },
  {
    id: "15",
    username: "gamer_jake",
    fullName: "Jake Morrison",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
    bio: "Pro Gamer 🎮 Streaming daily",
    website: "twitch.tv/gamerjake",
    followers: 234000,
    following: 123,
    postsCount: 678,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "16",
    username: "beauty_aria",
    fullName: "Aria Johnson",
    avatar: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=150&h=150&fit=crop&crop=face",
    bio: "Beauty & Skincare 💄 Self-care advocate",
    website: "ariabeauty.com",
    followers: 156000,
    following: 678,
    postsCount: 723,
    isFollowing: true,
    isVerified: true,
  },
  {
    id: "17",
    username: "pet_lover_max",
    fullName: "Max Turner",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    bio: "Dog dad 🐕 Rescue advocate",
    followers: 34500,
    following: 567,
    postsCount: 234,
    isFollowing: false,
  },
  {
    id: "18",
    username: "dance_luna",
    fullName: "Luna Garcia",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
    bio: "Professional Dancer 💃 Movement is life",
    followers: 89000,
    following: 345,
    postsCount: 456,
    isFollowing: true,
    isVerified: true,
  },
  {
    id: "19",
    username: "coffee_bean",
    fullName: "Ben Carter",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
    bio: "Coffee Enthusiast ☕ Barista life",
    followers: 23400,
    following: 432,
    postsCount: 167,
    isFollowing: false,
  },
  {
    id: "20",
    username: "bookworm_eva",
    fullName: "Eva Mitchell",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    bio: "Book reviewer 📚 300+ books read",
    website: "evareads.blog",
    followers: 45600,
    following: 234,
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
      { id: "c1", user: users[1], text: "Absolutely stunning! 😍", timestamp: new Date(Date.now() - 3600000), likes: 12 },
      { id: "c2", user: users[2], text: "Where is this?", timestamp: new Date(Date.now() - 7200000), likes: 5 },
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
      { id: "c3", user: users[3], text: "Take me there! 🙌", timestamp: new Date(Date.now() - 1800000), likes: 23 },
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
      { id: "c4", user: users[0], text: "I need this recipe ASAP! 😋", timestamp: new Date(Date.now() - 900000), likes: 8 },
      { id: "c5", user: users[4], text: "Looks delicious!", timestamp: new Date(Date.now() - 1200000), likes: 3 },
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
      { id: "c6", user: users[1], text: "This is so peaceful 🙏", timestamp: new Date(Date.now() - 3600000), likes: 15 },
    ],
    timestamp: new Date(Date.now() - 172800000),
    isLiked: false,
    isSaved: true,
  },
  {
    id: "6",
    user: users[5],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    caption: "Chasing waterfalls 💦 Nature's masterpiece #waterfall #photography #explore",
    likes: 9234,
    comments: [
      { id: "c7", user: users[6], text: "Incredible shot! 📸", timestamp: new Date(Date.now() - 5400000), likes: 18 },
    ],
    timestamp: new Date(Date.now() - 259200000),
    isLiked: true,
    isSaved: false,
    location: "Iceland",
  },
  {
    id: "7",
    user: users[6],
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=800&fit=crop",
    caption: "Lake reflections 🏞️ Perfect symmetry in nature #landscape #reflection #calm",
    likes: 6543,
    comments: [],
    timestamp: new Date(Date.now() - 345600000),
    isLiked: false,
    isSaved: false,
    location: "Lake Como, Italy",
  },
  {
    id: "8",
    user: users[7],
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop",
    caption: "Studio vibes 🎵 Working on something special #music #producer #studio",
    likes: 4321,
    comments: [
      { id: "c8", user: users[8], text: "Can't wait to hear it! 🔥", timestamp: new Date(Date.now() - 7200000), likes: 9 },
    ],
    timestamp: new Date(Date.now() - 432000000),
    isLiked: false,
    isSaved: true,
  },
  {
    id: "9",
    user: users[8],
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=800&fit=crop",
    caption: "Inner peace 🧘‍♀️ Morning meditation by the ocean #yoga #meditation #wellness",
    likes: 8765,
    comments: [
      { id: "c9", user: users[9], text: "So calming 🌊", timestamp: new Date(Date.now() - 10800000), likes: 21 },
    ],
    timestamp: new Date(Date.now() - 518400000),
    isLiked: true,
    isSaved: false,
    location: "Bali, Indonesia",
  },
  {
    id: "10",
    user: users[9],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop",
    caption: "Building the future 💻 New project coming soon #coding #tech #developer",
    likes: 5432,
    comments: [],
    timestamp: new Date(Date.now() - 604800000),
    isLiked: false,
    isSaved: false,
  },
  {
    id: "11",
    user: users[10],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
    caption: "New collection dropping soon 👗 Stay tuned! #fashion #style #newcollection",
    likes: 12345,
    comments: [
      { id: "c10", user: users[11], text: "Can't wait! 😍", timestamp: new Date(Date.now() - 14400000), likes: 34 },
    ],
    timestamp: new Date(Date.now() - 691200000),
    isLiked: true,
    isSaved: true,
    location: "Paris Fashion Week",
  },
  {
    id: "12",
    user: users[11],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
    caption: "Tonight's special 👨‍🍳 Five-course tasting menu #finedining #chef #culinary",
    likes: 7654,
    comments: [
      { id: "c11", user: users[2], text: "This looks incredible! 🤤", timestamp: new Date(Date.now() - 18000000), likes: 15 },
    ],
    timestamp: new Date(Date.now() - 777600000),
    isLiked: false,
    isSaved: false,
    location: "Le Bernardin, NYC",
  },
  {
    id: "13",
    user: users[12],
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=800&fit=crop",
    caption: "Summit reached! 🏔️ 14,000 feet of pure adrenaline #climbing #adventure #extreme",
    likes: 9876,
    comments: [],
    timestamp: new Date(Date.now() - 864000000),
    isLiked: true,
    isSaved: false,
    location: "Colorado",
  },
  {
    id: "14",
    user: users[13],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop",
    caption: "Tournament day! 🎮 Wish me luck #esports #gaming #competitive",
    likes: 15678,
    comments: [
      { id: "c12", user: users[14], text: "You got this! 💪", timestamp: new Date(Date.now() - 21600000), likes: 45 },
    ],
    timestamp: new Date(Date.now() - 950400000),
    isLiked: false,
    isSaved: true,
  },
  {
    id: "15",
    user: users[14],
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
    caption: "New skincare routine ✨ Glowing from within #beauty #skincare #selfcare",
    likes: 11234,
    comments: [
      { id: "c13", user: users[15], text: "Drop the routine! 🙏", timestamp: new Date(Date.now() - 25200000), likes: 28 },
    ],
    timestamp: new Date(Date.now() - 1036800000),
    isLiked: true,
    isSaved: false,
  },
  {
    id: "16",
    user: users[15],
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
    caption: "Adopted this little guy today 🐕 Meet Cooper! #rescue #adoptdontshop #dogs",
    likes: 18765,
    comments: [
      { id: "c14", user: users[16], text: "So adorable! 😍", timestamp: new Date(Date.now() - 28800000), likes: 67 },
    ],
    timestamp: new Date(Date.now() - 1123200000),
    isLiked: false,
    isSaved: true,
  },
  {
    id: "17",
    user: users[16],
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=800&fit=crop",
    caption: "Dance like nobody's watching 💃 New choreography #dance #movement #art",
    likes: 8765,
    comments: [],
    timestamp: new Date(Date.now() - 1209600000),
    isLiked: true,
    isSaved: false,
    location: "Dance Studio NYC",
  },
  {
    id: "18",
    user: users[17],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop",
    caption: "Perfect pour ☕ The art of latte making #coffee #barista #latteart",
    likes: 5432,
    comments: [
      { id: "c15", user: users[18], text: "Teach me your ways! ☕", timestamp: new Date(Date.now() - 32400000), likes: 12 },
    ],
    timestamp: new Date(Date.now() - 1296000000),
    isLiked: false,
    isSaved: false,
  },
  {
    id: "19",
    user: users[18],
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop",
    caption: "Currently reading 📚 This one is changing my perspective #books #reading #literature",
    likes: 4321,
    comments: [
      { id: "c16", user: users[0], text: "Adding to my list!", timestamp: new Date(Date.now() - 36000000), likes: 8 },
    ],
    timestamp: new Date(Date.now() - 1382400000),
    isLiked: true,
    isSaved: true,
  },
  {
    id: "20",
    user: users[0],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
    caption: "Crystal clear waters 🌊 Paradise found #beach #tropical #ocean #wanderlust",
    likes: 23456,
    comments: [
      { id: "c17", user: users[1], text: "This is heaven! 😍", timestamp: new Date(Date.now() - 1800000), likes: 45 },
    ],
    timestamp: new Date(Date.now() - 1468800000),
    isLiked: false,
    isSaved: true,
    location: "Maldives",
  },
  {
    id: "21",
    user: users[1],
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=800&fit=crop",
    caption: "Italian dreams 🇮🇹 Streets of Positano at golden hour #italy #amalfi #travel #photography",
    likes: 34567,
    comments: [
      { id: "c18", user: users[2], text: "Adding to my bucket list!", timestamp: new Date(Date.now() - 3600000), likes: 67 },
    ],
    timestamp: new Date(Date.now() - 1555200000),
    isLiked: true,
    isSaved: false,
    location: "Positano, Italy",
  },
  {
    id: "22",
    user: users[2],
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=800&fit=crop",
    caption: "Milky way magic ✨ 3 hours of exposure #astrophotography #nightsky #stars #mountains",
    likes: 45678,
    comments: [
      { id: "c19", user: users[3], text: "How did you capture this?! 🤯", timestamp: new Date(Date.now() - 5400000), likes: 89 },
    ],
    timestamp: new Date(Date.now() - 1641600000),
    isLiked: false,
    isSaved: true,
    location: "Mount Rainier",
  },
  {
    id: "23",
    user: users[3],
    image: "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=800&h=800&fit=crop",
    caption: "Cherry blossom season 🌸 Japan's beauty never disappoints #sakura #japan #spring #travel",
    likes: 56789,
    comments: [
      { id: "c20", user: users[4], text: "Breathtaking! 🌸", timestamp: new Date(Date.now() - 7200000), likes: 123 },
    ],
    timestamp: new Date(Date.now() - 1728000000),
    isLiked: true,
    isSaved: true,
    location: "Kyoto, Japan",
  },
  {
    id: "24",
    user: users[4],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=800&fit=crop",
    caption: "Above the clouds ☁️ Summit views that make everything worth it #mountaineering #adventure #epic",
    likes: 12345,
    comments: [
      { id: "c21", user: users[5], text: "Incredible achievement! 🏔️", timestamp: new Date(Date.now() - 9000000), likes: 34 },
    ],
    timestamp: new Date(Date.now() - 1814400000),
    isLiked: false,
    isSaved: false,
    location: "Patagonia",
  },
  {
    id: "25",
    user: users[5],
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop",
    caption: "Tulip fields forever 🌷 Spring vibes in full bloom #flowers #netherlands #colorful #nature",
    likes: 67890,
    comments: [
      { id: "c22", user: users[6], text: "The colors are insane! 🌈", timestamp: new Date(Date.now() - 10800000), likes: 156 },
    ],
    timestamp: new Date(Date.now() - 1900800000),
    isLiked: true,
    isSaved: false,
    location: "Amsterdam, Netherlands",
  },
  {
    id: "26",
    user: users[6],
    image: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&h=800&fit=crop",
    caption: "Northern lights dancing 💚 Bucket list moment achieved #aurora #norway #nordic #magical",
    likes: 78901,
    comments: [
      { id: "c23", user: users[7], text: "Dream destination! 😍", timestamp: new Date(Date.now() - 12600000), likes: 234 },
    ],
    timestamp: new Date(Date.now() - 1987200000),
    isLiked: false,
    isSaved: true,
    location: "Tromsø, Norway",
  },
  {
    id: "27",
    user: users[7],
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=800&fit=crop",
    caption: "Kayaking through paradise 🛶 Mirror-like reflections #kayaking #nature #peaceful #adventure",
    likes: 23456,
    comments: [
      { id: "c24", user: users[8], text: "So serene! 🙏", timestamp: new Date(Date.now() - 14400000), likes: 56 },
    ],
    timestamp: new Date(Date.now() - 2073600000),
    isLiked: true,
    isSaved: false,
    location: "Lake Louise, Canada",
  },
  {
    id: "28",
    user: users[8],
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=800&fit=crop",
    caption: "Sunlight through the canopy 🌳 Forest therapy is real #forest #nature #greenery #peace",
    likes: 34567,
    comments: [
      { id: "c25", user: users[9], text: "Nature heals 💚", timestamp: new Date(Date.now() - 16200000), likes: 78 },
    ],
    timestamp: new Date(Date.now() - 2160000000),
    isLiked: false,
    isSaved: true,
  },
  {
    id: "29",
    user: users[9],
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=800&fit=crop",
    caption: "Venice at sunrise 🌅 When the city is still asleep #venice #italy #sunrise #photography",
    likes: 45678,
    comments: [
      { id: "c26", user: users[10], text: "This is pure art! 🎨", timestamp: new Date(Date.now() - 18000000), likes: 98 },
    ],
    timestamp: new Date(Date.now() - 2246400000),
    isLiked: true,
    isSaved: true,
    location: "Venice, Italy",
  },
  {
    id: "30",
    user: users[10],
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=800&fit=crop",
    caption: "Hidden waterfall discovered 💦 Off the beaten path #waterfall #explore #hidden #nature",
    likes: 56789,
    comments: [
      { id: "c27", user: users[11], text: "Need the coordinates! 📍", timestamp: new Date(Date.now() - 19800000), likes: 145 },
    ],
    timestamp: new Date(Date.now() - 2332800000),
    isLiked: false,
    isSaved: false,
    location: "Costa Rica",
  },
  {
    id: "31",
    user: users[11],
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop",
    caption: "Fresh catch of the day 🐟 Sashimi perfection #sushi #japanese #foodporn #fresh",
    likes: 12345,
    comments: [
      { id: "c28", user: users[12], text: "My mouth is watering! 🤤", timestamp: new Date(Date.now() - 21600000), likes: 67 },
    ],
    timestamp: new Date(Date.now() - 2419200000),
    isLiked: true,
    isSaved: false,
    location: "Tokyo, Japan",
  },
  {
    id: "32",
    user: users[12],
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=800&fit=crop",
    caption: "Santorini sunsets 🌅 Blue domes and golden skies #santorini #greece #sunset #paradise",
    likes: 89012,
    comments: [
      { id: "c29", user: users[13], text: "Greece is calling! 🇬🇷", timestamp: new Date(Date.now() - 23400000), likes: 234 },
    ],
    timestamp: new Date(Date.now() - 2505600000),
    isLiked: false,
    isSaved: true,
    location: "Santorini, Greece",
  },
  {
    id: "33",
    user: users[13],
    image: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=800&h=800&fit=crop",
    caption: "Lavender fields forever 💜 The scent is incredible #lavender #provence #purple #nature",
    likes: 67890,
    comments: [
      { id: "c30", user: users[14], text: "I can almost smell it! 💜", timestamp: new Date(Date.now() - 25200000), likes: 178 },
    ],
    timestamp: new Date(Date.now() - 2592000000),
    isLiked: true,
    isSaved: true,
    location: "Provence, France",
  },
  {
    id: "34",
    user: users[14],
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop",
    caption: "Misty morning magic 🌫️ When nature puts on a show #fog #mountains #moody #landscape",
    likes: 45678,
    comments: [
      { id: "c31", user: users[15], text: "Ethereal vibes! ✨", timestamp: new Date(Date.now() - 27000000), likes: 89 },
    ],
    timestamp: new Date(Date.now() - 2678400000),
    isLiked: false,
    isSaved: false,
  },
  {
    id: "35",
    user: users[15],
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=800&fit=crop",
    caption: "Underwater world 🐠 Snorkeling in crystal waters #underwater #ocean #fish #tropical",
    likes: 34567,
    comments: [
      { id: "c32", user: users[16], text: "So vibrant! 🌊", timestamp: new Date(Date.now() - 28800000), likes: 67 },
    ],
    timestamp: new Date(Date.now() - 2764800000),
    isLiked: true,
    isSaved: true,
    location: "Great Barrier Reef",
  },
];

export const stories: Story[] = [
  { id: "s1", user: users[0], image: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 3600000), isViewed: false },
  { id: "s2", user: users[1], image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 7200000), isViewed: false },
  { id: "s3", user: users[2], image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 14400000), isViewed: true },
  { id: "s4", user: users[3], image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 21600000), isViewed: false },
  { id: "s5", user: users[4], image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 28800000), isViewed: true },
  { id: "s6", user: users[5], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 36000000), isViewed: false },
  { id: "s7", user: users[6], image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 43200000), isViewed: false },
  { id: "s8", user: users[7], image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 50400000), isViewed: true },
  { id: "s9", user: users[8], image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 57600000), isViewed: false },
  { id: "s10", user: users[9], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 64800000), isViewed: false },
  { id: "s11", user: users[10], image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 72000000), isViewed: true },
  { id: "s12", user: users[11], image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 79200000), isViewed: false },
  { id: "s13", user: users[12], image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 86400000), isViewed: false },
  { id: "s14", user: users[13], image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 93600000), isViewed: true },
  { id: "s15", user: users[14], image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=700&fit=crop", timestamp: new Date(Date.now() - 100800000), isViewed: false },
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