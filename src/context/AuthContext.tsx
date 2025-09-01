import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<unknown>;
  signUp: (email: string, password: string) => Promise<unknown>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  userProfile: { isadmin?: boolean } | null;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAdmin: false,
  userProfile: null,
});

// Export the context so it can be used in the useAuth hook
export { AuthContext };

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<{ isadmin?: boolean } | null>(null);

  const isAdmin = !!(userProfile && userProfile.isadmin === true) || !!(user && (user.user_metadata?.is_admin || user.user_metadata?.isAdmin));

  useEffect(() => {
    // Get current session with timeout
    const getSession = async () => {
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Session fetch timeout')), 5000))
        ]);
        
        const { data: { session }, error } = result;
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        setSession(session);
        setUser(session?.user || null);
        // fetch profile if session user exists
        if (session?.user?.id) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('isadmin')
              .eq('id', session.user.id)
              .single();
            if (profileError) setUserProfile(null); else setUserProfile(profileData || null);
          } catch (err) {
            console.error('Failed to fetch user profile:', err);
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Failed to get session:', err);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user?.id) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('isadmin')
            .eq('id', session.user.id)
            .single();
          if (profileError) setUserProfile(null); else setUserProfile(profileData || null);
        } catch (err) {
          console.error('Failed to fetch user profile on auth change:', err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, isAdmin, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context - moved to a separate file
