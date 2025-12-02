import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mockData";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Search, path: "/search", label: "Search" },
    { icon: Compass, path: "/explore", label: "Explore" },
    { icon: MessageCircle, path: "/messages", label: "Messages" },
    { icon: Heart, path: "/notifications", label: "Notifications" },
    { icon: PlusSquare, path: "/create", label: "Create" },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[72px] xl:w-[244px] border-r border-border bg-background z-50 p-3 pt-6">
      {/* Logo */}
      <Link to="/" className="mb-8 px-3">
        <h1 className="hidden xl:block text-xl font-bold tracking-tight">Instapic</h1>
        <span className="xl:hidden text-2xl font-bold">📷</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
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
            src={currentUser.avatar}
            alt={currentUser.username}
            className={cn(
              "w-6 h-6 rounded-full object-cover transition-transform group-hover:scale-105",
              location.pathname === "/profile" && "ring-2 ring-foreground"
            )}
          />
          <span className="hidden xl:block">Profile</span>
        </Link>
      </nav>

      {/* More */}
      <button className="flex items-center gap-4 px-3 py-3 rounded-lg transition-colors hover:bg-secondary mt-auto">
        <Menu className="w-6 h-6" />
        <span className="hidden xl:block">More</span>
      </button>
    </aside>
  );
};

export default Sidebar;
