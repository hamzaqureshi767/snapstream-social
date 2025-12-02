import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Edit, ChevronDown, Phone, Video, Info, ImageIcon, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar: string | null;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  participant: Profile;
  lastMessage?: string;
  lastMessageTime?: Date;
  unread: boolean;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all users for starting new conversations
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '');
      if (data) setAllUsers(data);
    };
    if (user) fetchUsers();
  }, [user]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      const { data: participantData } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (!participantData || participantData.length === 0) return;

      const conversationIds = participantData.map(p => p.conversation_id);

      const convos: Conversation[] = [];
      
      for (const convId of conversationIds) {
        // Get other participant
        const { data: otherParticipant } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', convId)
          .neq('user_id', user.id)
          .single();

        if (otherParticipant) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherParticipant.user_id)
            .single();

          const { data: lastMsg } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (profile) {
            convos.push({
              id: convId,
              participant: profile,
              lastMessage: lastMsg?.content,
              lastMessageTime: lastMsg ? new Date(lastMsg.created_at) : undefined,
              unread: lastMsg ? !lastMsg.is_read && lastMsg.sender_id !== user.id : false,
            });
          }
        }
      }

      setConversations(convos.sort((a, b) => 
        (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0)
      ));
    };

    fetchConversations();
  }, [user]);

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    if (selectedConversation) {
      const channel = supabase
        .channel(`messages-${selectedConversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation.id}`,
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

  const startNewConversation = async (otherUser: Profile) => {
    if (!user) return;

    // Check if conversation already exists
    const existing = conversations.find(c => c.participant.id === otherUser.id);
    if (existing) {
      setSelectedConversation(existing);
      setShowNewChat(false);
      return;
    }

    // Create new conversation
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convError || !conv) {
      toast({ title: "Error creating conversation", variant: "destructive" });
      return;
    }

    // Add participants
    await supabase.from('conversation_participants').insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: otherUser.id },
    ]);

    const newConvo: Conversation = {
      id: conv.id,
      participant: otherUser,
      unread: false,
    };

    setConversations(prev => [newConvo, ...prev]);
    setSelectedConversation(newConvo);
    setShowNewChat(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    if (error) {
      toast({ title: "Failed to send message", variant: "destructive" });
    } else {
      setNewMessage("");
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}w`;
  };

  return (
    <MainLayout showHeader={false}>
      <div className="h-[calc(100vh-56px)] md:h-screen flex">
        {/* Conversations List */}
        <div className={cn(
          "w-full md:w-96 border-r border-border flex flex-col",
          selectedConversation && "hidden md:flex"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Messages</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowNewChat(true)}>
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

          {/* New Chat Modal */}
          {showNewChat && (
            <div className="absolute inset-0 bg-background z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <button onClick={() => setShowNewChat(false)} className="text-sm">Cancel</button>
                <span className="font-semibold">New message</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 overflow-y-auto">
                <p className="px-4 py-2 text-sm font-semibold">Suggested</p>
                {allUsers.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => startNewConversation(profile)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50"
                  >
                    <img
                      src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                      alt={profile.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{profile.username}</p>
                      <p className="text-sm text-muted-foreground">{profile.full_name}</p>
                    </div>
                  </button>
                ))}
                {allUsers.length === 0 && (
                  <p className="text-center text-muted-foreground p-8">
                    No other users yet. Invite friends to join!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Send className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No messages yet</p>
                <Button className="mt-4" onClick={() => setShowNewChat(true)}>
                  Start a conversation
                </Button>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left",
                    selectedConversation?.id === conv.id && "bg-secondary"
                  )}
                >
                  <div className="relative">
                    <img
                      src={conv.participant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                      alt={conv.participant.username}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {conv.unread && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm truncate", conv.unread && "font-semibold")}>
                      {conv.participant.username}
                    </p>
                    <p className={cn(
                      "text-sm truncate",
                      conv.unread ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {conv.lastMessage || 'Start chatting'} 
                      {conv.lastMessageTime && ` · ${formatTime(conv.lastMessageTime)}`}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={cn(
          "flex-1 flex flex-col",
          !selectedConversation && "hidden md:flex"
        )}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedConversation(null)} className="md:hidden mr-2">
                    ←
                  </button>
                  <Link to={`/profile/${selectedConversation.participant.username}`} className="flex items-center gap-3">
                    <img
                      src={selectedConversation.participant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedConversation.participant.username}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{selectedConversation.participant.username}</p>
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon"><Phone className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon"><Info className="w-5 h-5" /></Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex flex-col items-center py-8">
                  <img
                    src={selectedConversation.participant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                    alt={selectedConversation.participant.username}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <p className="font-semibold">{selectedConversation.participant.full_name || selectedConversation.participant.username}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedConversation.participant.username} · Instapic
                  </p>
                  <Link to={`/profile/${selectedConversation.participant.username}`}>
                    <Button variant="secondary" size="sm">View profile</Button>
                  </Link>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.sender_id === user?.id ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2",
                      msg.sender_id === user?.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary"
                    )}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 bg-secondary rounded-full px-4 py-2">
                  <button><ImageIcon className="w-5 h-5 text-primary" /></button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Message..."
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  />
                  {newMessage ? (
                    <button onClick={sendMessage} className="text-primary font-semibold text-sm">
                      Send
                    </button>
                  ) : (
                    <button><Heart className="w-5 h-5" /></button>
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
              <Button onClick={() => setShowNewChat(true)}>Send message</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
