import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const AuthDebug: React.FC = () => {
  const [session, setSession] = useState<unknown>(null);
  const [tokenInfo, setTokenInfo] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
        setSession(data.session || null);
        try {
          const raw = localStorage.getItem('supabase.auth.token');
          if (raw) {
            // mask token for safety
            const preview = raw.length > 24 ? `${raw.slice(0,6)}...${raw.slice(-6)} (len ${raw.length})` : raw;
            setTokenInfo(preview);
          } else {
            setTokenInfo(null);
          }
        } catch {
          setTokenInfo('unavailable');
        }
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s || null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', padding: 8, background: '#fff8', borderRadius: 6 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div><strong>Auth session:</strong> {session ? 'present' : 'none'}</div>
        <div>
          <strong>User ID:</strong>
          {(() => {
            if (session && typeof session === 'object') {
              const s = session as Record<string, unknown>;
              if (s.user && typeof s.user === 'object') {
                const u = s.user as Record<string, unknown>;
                return String(u.id ?? 'none');
              }
            }
            return 'none';
          })()}
        </div>
        <div><strong>Local token:</strong> {tokenInfo ?? 'none'}</div>
      </div>
    </div>
  );
};

export default AuthDebug;
