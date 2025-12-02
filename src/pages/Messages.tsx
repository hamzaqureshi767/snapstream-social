import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { users, currentUser, formatTimestamp } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Edit, ChevronDown, Phone, Video, Info, ImageIcon, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  user: typeof users[0];
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const conversations: Conversation[] = [
  {
    id: "1",
    user: users[0],
    lastMessage: "Thanks! See you tomorrow 😊",
    timestamp: new Date(Date.now() - 1800000),
    unread: true,
  },
  {
    id: "2",
    user: users[1],
    lastMessage: "That photo is incredible!",
    timestamp: new Date(Date.now() - 7200000),
    unread: false,
  },
  {
    id: "3",
    user: users[2],
    lastMessage: "Sent you the recipe",
    timestamp: new Date(Date.now() - 86400000),
    unread: false,
  },
  {
    id: "4",
    user: users[3],
    lastMessage: "Let's catch up soon",
    timestamp: new Date(Date.now() - 172800000),
    unread: true,
  },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");

  return (
    <MainLayout showHeader={false}>
      <div className="h-[calc(100vh-56px)] md:h-screen flex">
        {/* Conversations List */}
        <div className={cn(
          "w-full md:w-96 border-r border-border flex flex-col",
          selectedChat && "hidden md:flex"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{currentUser.username}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages/Requests Toggle */}
          <div className="flex border-b border-border">
            <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-foreground">
              Messages
            </button>
            <button className="flex-1 py-3 text-sm text-muted-foreground">
              Requests
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left",
                  selectedChat?.id === conv.id && "bg-secondary"
                )}
              >
                <div className="relative">
                  <img
                    src={conv.user.avatar}
                    alt={conv.user.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {conv.unread && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm truncate",
                    conv.unread && "font-semibold"
                  )}>
                    {conv.user.username}
                  </p>
                  <p className={cn(
                    "text-sm truncate",
                    conv.unread ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {conv.lastMessage} · {formatTimestamp(conv.timestamp)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={cn(
          "flex-1 flex flex-col",
          !selectedChat && "hidden md:flex"
        )}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden mr-2"
                  >
                    ←
                  </button>
                  <Link to={`/profile/${selectedChat.user.username}`} className="flex items-center gap-3">
                    <img
                      src={selectedChat.user.avatar}
                      alt={selectedChat.user.username}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm flex items-center gap-1">
                        {selectedChat.user.username}
                        {selectedChat.user.isVerified && (
                          <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Active 2h ago</p>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex flex-col items-center py-8">
                  <img
                    src={selectedChat.user.avatar}
                    alt={selectedChat.user.username}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <p className="font-semibold">{selectedChat.user.fullName}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedChat.user.username} · Instagram
                  </p>
                  <Link to={`/profile/${selectedChat.user.username}`}>
                    <Button variant="secondary" size="sm">View profile</Button>
                  </Link>
                </div>

                {/* Sample messages */}
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-secondary rounded-2xl px-4 py-2">
                    <p className="text-sm">Hey! How are you?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-primary text-primary-foreground rounded-2xl px-4 py-2">
                    <p className="text-sm">I'm good! Just uploaded a new photo 📸</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-secondary rounded-2xl px-4 py-2">
                    <p className="text-sm">{selectedChat.lastMessage}</p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 bg-secondary rounded-full px-4 py-2">
                  <button>
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  />
                  {message ? (
                    <button className="text-primary font-semibold text-sm">
                      Send
                    </button>
                  ) : (
                    <>
                      <button>
                        <Heart className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-foreground flex items-center justify-center mb-4">
                <Send className="w-10 h-10" />
              </div>
              <h2 className="text-xl mb-1">Your messages</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Send private photos and messages to a friend or group
              </p>
              <Button>Send message</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
