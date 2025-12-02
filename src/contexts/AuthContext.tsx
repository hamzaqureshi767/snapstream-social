import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (initializedRef.current) {
      console.log('[Auth] Already initialized, skipping');
      return;
    }
    initializedRef.current = true;
    console.log('[Auth] Initializing auth...');

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('[Auth] onAuthStateChange:', event, 'hasSession:', !!currentSession);
        
        // Defer state updates to avoid deadlocks
        setTimeout(() => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }, 0);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('[Auth] getSession result:', !!initialSession);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('[Auth] Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username,
          full_name: fullName,
        }
      }
    });
    return { error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('[Auth] signIn called');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('[Auth] signIn result:', error ? 'error' : 'success');
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    console.log('[Auth] signOut called');
    await supabase.auth.signOut();
  }, []);

  console.log('[Auth] Render - user:', !!user, 'loading:', loading);

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
