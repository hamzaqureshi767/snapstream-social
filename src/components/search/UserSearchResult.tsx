import { Link } from "react-router-dom";
import { User, formatNumber } from "@/data/mockData";

interface UserSearchResultProps {
  user: User;
}

const UserSearchResult = ({ user }: UserSearchResultProps) => {
  return (
    <Link
      to={`/profile/${user.username}`}
      className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors rounded-lg"
    >
      <img
        src={user.avatar}
        alt={user.username}
        className="w-11 h-11 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm truncate">{user.username}</span>
          {user.isVerified && (
            <svg className="w-3 h-3 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{user.fullName}</p>
        <p className="text-xs text-muted-foreground">{formatNumber(user.followers)} followers</p>
      </div>
    </Link>
  );
};

export default UserSearchResult;
