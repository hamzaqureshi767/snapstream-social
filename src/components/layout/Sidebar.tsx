import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, Bookmark, Instagram, LogOut, Moon, Sun } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<{ username: string; avatar: string | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, avatar')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Search, path: "/search", label: "Search" },
    { icon: Compass, path: "/explore", label: "Explore" },
    { icon: MessageCircle, path: "/messages", label: "Messages" },
    { icon: Heart, path: "/notifications", label: "Notifications" },
    { icon: PlusSquare, path: "/create", label: "Create" },
    { icon: Bookmark, path: "/saved", label: "Saved" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[72px] xl:w-[244px] border-r border-border bg-background z-50 p-3 pt-6">
      {/* Logo */}
      {/* Logo */}
      <Link to="/" className="mb-8 px-3 flex items-center gap-2">
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="story-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(280, 87%, 70%)" />
              <stop offset="25%" stopColor="hsl(330, 90%, 60%)" />
              <stop offset="50%" stopColor="hsl(348, 90%, 55%)" />
              <stop offset="75%" stopColor="hsl(25, 100%, 55%)" />
              <stop offset="100%" stopColor="hsl(45, 100%, 55%)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Mobile icon */}
        <div className="relative xl:hidden">
          <Instagram className="w-7 h-7" style={{ stroke: 'url(#story-gradient)' }} strokeWidth={2.2} />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gradient-to-tr from-[hsl(280,87%,65%)] via-[hsl(348,90%,55%)] to-[hsl(45,100%,55%)]" />
        </div>
        {/* Desktop icon + text */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="relative">
            <Instagram className="w-8 h-8" style={{ stroke: 'url(#story-gradient)' }} strokeWidth={2.2} />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[hsl(280,87%,65%)] via-[hsl(348,90%,55%)] to-[hsl(45,100%,55%)]" />
          </div>
          <span className="text-2xl font-semibold bg-gradient-to-r from-[hsl(280,87%,65%)] via-[hsl(348,90%,55%)] via-[hsl(25,100%,55%)] to-[hsl(45,100%,55%)] bg-clip-text text-transparent">
            Instagram
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "font-semibold"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform group-hover:scale-105",
                  isActive && "scale-105"
                )}
                fill={isActive && path !== "/create" ? "currentColor" : "none"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="hidden xl:block">{label}</span>
            </Link>
          );
        })}

        {/* Profile */}
        <Link
          to="/profile"
          className={cn(
            "flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group",
            location.pathname === "/profile"
              ? "font-semibold"
              : "text-foreground hover:bg-secondary"
          )}
        >
          <img
            src={profile?.avatar || '/default-avatar.jpg'}
            alt={profile?.username || 'Profile'}
            className={cn(
              "w-6 h-6 rounded-full object-cover transition-transform group-hover:scale-105",
              location.pathname === "/profile" && "ring-2 ring-foreground"
            )}
            onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
          />
          <span className="hidden xl:block">Profile</span>
        </Link>
      </nav>

      {/* Theme Toggle */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex items-center gap-4 px-3 py-3 rounded-lg transition-colors hover:bg-secondary"
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        <span className="hidden xl:block">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>

      {/* Sign Out */}
      <button 
        onClick={handleSignOut}
        className="flex items-center gap-4 px-3 py-3 rounded-lg transition-colors hover:bg-secondary"
      >
        <LogOut className="w-6 h-6" />
        <span className="hidden xl:block">Log out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
