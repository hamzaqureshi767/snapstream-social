import { Heart, MessageCircle, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Instagram className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">Instagram</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="relative">
            <Heart className="w-6 h-6" />
          </Link>
          <Link to="/messages" className="relative">
            <MessageCircle className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
