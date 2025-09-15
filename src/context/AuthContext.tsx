import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type SignUpProfile = {
  full_name?: string;
  phone?: string;
  shipping?: {
    line1?: string;
    city?: string;
    state?: string;
    country?: string;
  };
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<unknown>;
  signUp: (email: string, password: string, profile?: SignUpProfile) => Promise<unknown>;
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
  const [isAdminFlag, setIsAdminFlag] = useState<boolean>(false);

  const isAdmin = isAdminFlag || !!(userProfile && userProfile.isadmin === true) || !!(user && (user.user_metadata?.is_admin || user.user_metadata?.isAdmin));

  useEffect(() => {
  let initialized = false;
  let safetyTimer: number | undefined;

    // Get current session (no artificial timeout) and subscribe to auth events
    const init = async () => {
      try {
        const resp = await supabase.auth.getSession();
        const { data: { session: initialSession }, error } = resp;
        if (process.env.NODE_ENV === 'development') console.debug('Auth getSession response', resp);
        if (error) console.error('Error getting session:', error);

        // set immediate values if present
        setSession(initialSession);
        setUser(initialSession?.user || null);

        // fetch profile/admin if we already have a session
        if (initialSession?.user?.id) {
          try {
            const [profileRes, adminRes] = await Promise.all([
              supabase.from('user_profiles').select('isadmin').eq('id', initialSession.user.id).single(),
              supabase.from('admins').select('id').eq('id', initialSession.user.id).maybeSingle(),
            ]);
            const profileData = profileRes.data as { isadmin?: boolean } | null;
            if (profileRes.error) setUserProfile(null); else setUserProfile(profileData || null);
            const adminData = adminRes.data as { id?: string } | null;
            setIsAdminFlag(!!(adminData && adminData.id));
            if (profileData && profileData.isadmin === true) setIsAdminFlag(true);
          } catch (err) {
            console.error('Failed to fetch user profile during init:', err);
            setUserProfile(null);
            setIsAdminFlag(false);
          }
        }
      } catch (err) {
        console.error('Failed to get session during init:', err);
        setSession(null);
        setUser(null);
      }

      // Subscribe to auth state changes; rely on the subscription to mark initialization complete
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sessionPayload) => {
        if (process.env.NODE_ENV === 'development') console.debug('onAuthStateChange', event, sessionPayload);

        setSession(sessionPayload);
        setUser(sessionPayload?.user || null);

        if (sessionPayload?.user?.id) {
          try {
            // retry wrapper for mobile flaky network
            type ProfileRes = { data: { isadmin?: boolean } | null; error: unknown };
            type AdminRes = { data: { id?: string } | null; error: unknown };
            const fetchProfileAndAdmin = async (attempt = 1): Promise<[ProfileRes, AdminRes]> => {
              try {
                const [profileRes, adminRes] = await Promise.all([
                  supabase.from('user_profiles').select('isadmin').eq('id', sessionPayload.user.id).single(),
                  supabase.from('admins').select('id').eq('id', sessionPayload.user.id).maybeSingle(),
                ]);
                return [profileRes, adminRes];
              } catch (err) {
                if (attempt < 3) return fetchProfileAndAdmin(attempt + 1);
                throw err;
              }
            };
            const [profileRes, adminRes] = await fetchProfileAndAdmin();
            const profileData = profileRes.data as { isadmin?: boolean } | null;
            if (profileRes.error) setUserProfile(null); else setUserProfile(profileData || null);
            const adminData = adminRes.data as { id?: string } | null;
            setIsAdminFlag(!!(adminData && adminData.id));
            if (profileData && profileData.isadmin === true) setIsAdminFlag(true);
          } catch (err) {
            console.error('Failed to fetch user profile on auth change:', err);
            setUserProfile(null);
            setIsAdminFlag(false);
          }
        } else {
          setUserProfile(null);
          setIsAdminFlag(false);
        }

        if (!initialized) {
          initialized = true;
          setLoading(false);
          if (safetyTimer) window.clearTimeout(safetyTimer);
        }
      });

      // Safety: if no auth event arrives in 3s, end loading (handles some mobile webview cases)
      safetyTimer = window.setTimeout(() => {
        if (!initialized) {
          initialized = true;
            setLoading(false);
        }
      }, 3000);

      return () => {
        subscription.unsubscribe();
        if (safetyTimer) window.clearTimeout(safetyTimer);
      };
    };

    // start init
    const cleanupPromise = init();

    // ensure we return a cleanup that cancels subscription when effect unmounts
    return () => {
      cleanupPromise.then((maybeCleanup) => {
        if (typeof maybeCleanup === 'function') maybeCleanup();
      }).catch(() => {});
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, profile?: SignUpProfile) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: profile?.full_name || undefined,
          phone: profile?.phone || undefined,
        },
      },
    });
    if (error) throw error;
    try {
      const userId = data.user?.id;
      if (userId) {
        const shippingAddress = profile?.shipping && Object.values(profile.shipping).some(v => !!v)
          ? {
              line1: profile.shipping.line1 || null,
              city: profile.shipping.city || null,
              state: profile.shipping.state || null,
              country: profile.shipping.country || null,
            }
          : null;
        const { error: upsertError } = await supabase.from('user_profiles').upsert({
          id: userId,
          full_name: profile?.full_name || null,
          phone: profile?.phone || null,
          default_shipping_address: shippingAddress,
        }, { onConflict: 'id' });
        if (upsertError) console.warn('Profile upsert after sign up failed', upsertError);
      }
    } catch (e) {
      console.warn('Post-signup profile creation failed', e);
    }
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
