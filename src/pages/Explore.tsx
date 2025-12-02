import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { formatNumber } from "@/data/mockData";

// Extended explore posts with more variety
const explorePosts = [
  { id: "1", image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop", likes: 1234, comments: 56 },
  { id: "2", image: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=800&h=800&fit=crop", likes: 8923, comments: 234 },
  { id: "3", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop", likes: 5621, comments: 89 },
  { id: "4", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop", likes: 15234, comments: 445 },
  { id: "5", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop", likes: 7845, comments: 123 },
  { id: "6", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop", likes: 23456, comments: 567 },
  { id: "7", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=800&fit=crop", likes: 34567, comments: 890 },
  { id: "8", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=800&fit=crop", likes: 12345, comments: 234 },
  { id: "9", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=800&fit=crop", likes: 9876, comments: 345 },
  { id: "10", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=800&fit=crop", likes: 45678, comments: 678 },
  { id: "11", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop", likes: 56789, comments: 1234 },
  { id: "12", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=800&fit=crop", likes: 23456, comments: 456 },
  { id: "13", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=800&fit=crop", likes: 34567, comments: 789 },
  { id: "14", image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=800&fit=crop", likes: 12345, comments: 234 },
  { id: "15", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=800&fit=crop", likes: 67890, comments: 1456 },
  { id: "16", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=800&fit=crop", likes: 8765, comments: 234 },
  { id: "17", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=800&fit=crop", likes: 45678, comments: 890 },
  { id: "18", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop", likes: 34567, comments: 567 },
  { id: "19", image: "https://images.unsplash.com/photo-1482049016gy9k50e?w=800&h=800&fit=crop", likes: 23456, comments: 345 },
  { id: "20", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop", likes: 56789, comments: 1234 },
  { id: "21", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=800&fit=crop", likes: 12345, comments: 456 },
  { id: "22", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop", likes: 78901, comments: 2345 },
  { id: "23", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop", likes: 34567, comments: 678 },
  { id: "24", image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=800&fit=crop", likes: 23456, comments: 456 },
  { id: "25", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=800&fit=crop", likes: 89012, comments: 1678 },
  { id: "26", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=800&fit=crop", likes: 45678, comments: 890 },
  { id: "27", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=800&fit=crop", likes: 67890, comments: 1234 },
];

const Explore = () => {
  return (
    <MainLayout showHeader={false}>
      <div className="max-w-4xl mx-auto pt-4 md:pt-8">
        <h1 className="hidden md:block text-xl font-semibold mb-6 px-4">Explore</h1>
        
        <div className="grid grid-cols-3 gap-0.5 md:gap-1">
          {explorePosts.map((post, index) => (
            <Link
              key={`${post.id}-${index}`}
              to={`/post/${post.id}`}
              className="relative aspect-square group"
            >
              <img
                src={post.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Heart className="w-5 h-5" fill="white" />
                  {formatNumber(post.likes)}
                </div>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <MessageCircle className="w-5 h-5" fill="white" />
                  {post.comments}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Explore;
