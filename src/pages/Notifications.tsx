import MainLayout from "@/components/layout/MainLayout";
import { users, formatTimestamp } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "follow" | "like" | "comment";
  user: typeof users[0];
  timestamp: Date;
  postImage?: string;
  comment?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "follow",
    user: users[0],
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    type: "like",
    user: users[1],
    timestamp: new Date(Date.now() - 7200000),
    postImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    type: "comment",
    user: users[2],
    timestamp: new Date(Date.now() - 14400000),
    postImage: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=100&h=100&fit=crop",
    comment: "This is amazing! 🔥",
  },
  {
    id: "4",
    type: "follow",
    user: users[3],
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "5",
    type: "like",
    user: users[4],
    timestamp: new Date(Date.now() - 172800000),
    postImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop",
  },
];

const Notifications = () => {
  return (
    <MainLayout showHeader={false}>
      <div className="max-w-xl mx-auto">
        <div className="sticky top-0 z-40 bg-background p-4 border-b border-border md:border-none">
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>

        <div className="divide-y divide-border">
          {/* Today */}
          <div className="py-2">
            <p className="px-4 py-2 font-semibold text-sm">Today</p>
            {notifications.slice(0, 3).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>

          {/* This Week */}
          <div className="py-2">
            <p className="px-4 py-2 font-semibold text-sm">This Week</p>
            {notifications.slice(3).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const getMessage = () => {
    switch (notification.type) {
      case "follow":
        return "started following you.";
      case "like":
        return "liked your photo.";
      case "comment":
        return `commented: ${notification.comment}`;
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
      <Link to={`/profile/${notification.user.username}`}>
        <img
          src={notification.user.avatar}
          alt={notification.user.username}
          className="w-11 h-11 rounded-full object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <Link
            to={`/profile/${notification.user.username}`}
            className="font-semibold hover:underline"
          >
            {notification.user.username}
          </Link>{" "}
          {getMessage()}{" "}
          <span className="text-muted-foreground">
            {formatTimestamp(notification.timestamp)}
          </span>
        </p>
      </div>
      {notification.type === "follow" ? (
        <Button variant="follow" size="xs">
          Follow
        </Button>
      ) : notification.postImage ? (
        <img
          src={notification.postImage}
          alt=""
          className="w-11 h-11 object-cover rounded"
        />
      ) : null}
    </div>
  );
};

export default Notifications;
