import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Edit, ChevronDown, Phone, Video, Info, ImageIcon, Heart, Send, Trash2 } from "lucide-react";
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
  const [userSearch, setUserSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredUsers = allUsers.filter(
    (profile) =>
      profile.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      (profile.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ?? false)
  );

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

  // Fetch conversations - optimized to reduce API calls
  useEffect(() => {
    let isMounted = true;
    
    const fetchConversations = async () => {
      if (!user) return;

      try {
        // Get all conversation IDs the user is part of
        const { data: participantData, error: participantError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);

        if (participantError || !participantData || participantData.length === 0) return;

        const conversationIds = participantData.map(p => p.conversation_id);

        // Get all participants for these conversations in one query
        const { data: allParticipants, error: allParticipantsError } = await supabase
          .from('conversation_participants')
          .select('conversation_id, user_id')
          .in('conversation_id', conversationIds)
          .neq('user_id', user.id);

        if (allParticipantsError || !allParticipants) return;

        // Get unique other user IDs
        const otherUserIds = [...new Set(allParticipants.map(p => p.user_id))];
        
        if (otherUserIds.length === 0) return;

        // Fetch all profiles in one query
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', otherUserIds);

        if (profilesError || !profiles) return;

        // Create a map for quick lookup
        const profileMap = new Map(profiles.map(p => [p.id, p]));
        const convParticipantMap = new Map<string, string>();
        
        // Map conversation to other participant (use first one found per conversation)
        for (const p of allParticipants) {
          if (!convParticipantMap.has(p.conversation_id)) {
            convParticipantMap.set(p.conversation_id, p.user_id);
          }
        }

        // Build conversations without fetching messages individually
        const convos: Conversation[] = [];
        const seenParticipants = new Set<string>();

        for (const convId of conversationIds) {
          const otherUserId = convParticipantMap.get(convId);
          if (!otherUserId || seenParticipants.has(otherUserId)) continue;
          
          const profile = profileMap.get(otherUserId);
          if (!profile) continue;

          seenParticipants.add(otherUserId);
          convos.push({
            id: convId,
            participant: profile,
            lastMessage: undefined,
            lastMessageTime: undefined,
            unread: false,
          });
        }

        if (!isMounted) return;
        setConversations(convos);

        // Fetch last messages in parallel (limited batch)
        const messagePromises = convos.slice(0, 20).map(async (conv) => {
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at, is_read, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          return { convId: conv.id, lastMsg };
        });

        const messageResults = await Promise.all(messagePromises);
        
        if (!isMounted) return;

        setConversations(prev => {
          const updated = prev.map(conv => {
            const result = messageResults.find(r => r.convId === conv.id);
            if (result?.lastMsg) {
              return {
                ...conv,
                lastMessage: result.lastMsg.content,
                lastMessageTime: new Date(result.lastMsg.created_at),
                unread: !result.lastMsg.is_read && result.lastMsg.sender_id !== user.id,
              };
            }
            return conv;
          });
          return updated.sort((a, b) => 
            (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0)
          );
        });
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
    
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

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
      setUserSearch("");
      return;
    }

    try {
      // Generate conversation ID client-side to avoid RLS select issue
      const conversationId = crypto.randomUUID();

      // Create new conversation
      const { error: convError } = await supabase
        .from('conversations')
        .insert({ id: conversationId });

      if (convError) {
        console.error('Error creating conversation:', convError);
        toast({ title: "Error creating conversation", variant: "destructive" });
        return;
      }

      // Add participants - current user first
      const { error: participantError } = await supabase.from('conversation_participants').insert([
        { conversation_id: conversationId, user_id: user.id },
        { conversation_id: conversationId, user_id: otherUser.id },
      ]);

      if (participantError) {
        console.error('Error adding participants:', participantError);
        toast({ title: "Error starting conversation", variant: "destructive" });
        return;
      }

      const newConvo: Conversation = {
        id: conversationId,
        participant: otherUser,
        unread: false,
      };

      setConversations(prev => [newConvo, ...prev]);
      setSelectedConversation(newConvo);
      setShowNewChat(false);
      setUserSearch("");
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
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

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase.from('messages').delete().eq('id', messageId);
    if (error) {
      toast({ title: "Failed to delete message", variant: "destructive" });
    } else {
      setMessages(prev => prev.filter(m => m.id !== messageId));
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
                <button type="button" onClick={() => { setShowNewChat(false); setUserSearch(""); }} className="text-sm">Cancel</button>
                <span className="font-semibold">New message</span>
                <div className="w-12" />
              </div>
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">To:</span>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {!userSearch && (
                  <p className="text-center text-muted-foreground p-8">
                    Search for a user to start a conversation
                  </p>
                )}
                {userSearch && filteredUsers.map((profile) => (
                  <button
                    type="button"
                    key={profile.id}
                    onClick={() => { startNewConversation(profile); setUserSearch(""); }}
                    className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50"
                  >
                    <img
                      src={profile.avatar || '/default-avatar.jpg'}
                      alt={profile.username}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{profile.username}</p>
                      <p className="text-sm text-muted-foreground">{profile.full_name}</p>
                    </div>
                  </button>
                ))}
                {filteredUsers.length === 0 && userSearch && (
                  <p className="text-center text-muted-foreground p-8">
                    No users found for "{userSearch}"
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
                      src={conv.participant.avatar || '/default-avatar.jpg'}
                      alt={conv.participant.username}
                      className="w-14 h-14 rounded-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
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
                      src={selectedConversation.participant.avatar || '/default-avatar.jpg'}
                      alt={selectedConversation.participant.username}
                      className="w-11 h-11 rounded-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
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
                    src={selectedConversation.participant.avatar || '/default-avatar.jpg'}
                    alt={selectedConversation.participant.username}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                    onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
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
                    className={cn("flex group", msg.sender_id === user?.id ? "justify-end" : "justify-start")}
                  >
                    <div className="flex items-center gap-2">
                      {msg.sender_id === user?.id && (
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      )}
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        msg.sender_id === user?.id 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary"
                      )}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
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
