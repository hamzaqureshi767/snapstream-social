import { Home, Search, PlusSquare, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Search, path: "/search", label: "Search" },
    { icon: PlusSquare, path: "/create", label: "Create" },
    { icon: Bookmark, path: "/saved", label: "Saved" },
    { icon: User, path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around h-14">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center justify-center w-full h-full transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={label}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform",
                  isActive && "scale-110"
                )}
                fill={isActive && path !== "/create" ? "currentColor" : "none"}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
