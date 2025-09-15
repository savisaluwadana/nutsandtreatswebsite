import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Status = 'idle' | 'loading' | 'ok' | 'error';

export const SupabaseDiagnostics: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const run = async () => {
      setStatus('loading');
      setMessage('Testing connection...');
      try {
        const { data, error } = await supabase.from('products').select('id', { count: 'exact', head: true });
        if (error) throw error;
        setCount(data?.length || 0); // head:true returns no rows
        setStatus('ok');
        setMessage('Supabase connection OK. Products table accessible.');
      } catch (err: unknown) {
        setStatus('error');
        const msg = (() => {
          if (typeof err === 'string') return err;
            if (err && typeof err === 'object' && 'message' in err) {
              const m = (err as { message?: unknown }).message;
              if (typeof m === 'string') return m;
            }
          return 'Unknown error';
        })();
        setMessage(msg);
      }
    };
    run();
  }, []);

  const color = status === 'ok' ? 'green' : status === 'error' ? 'red' : 'gray';

  return (
    <div style={{ fontFamily: 'monospace', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 4, margin: '1rem 0' }}>
      <strong>Supabase Diagnostics:</strong> <span style={{ color }}>{status.toUpperCase()}</span><br />
      {message}<br />
      {status === 'ok' && <span>Products count (approx): {count}</span>}
    </div>
  );
};

export default SupabaseDiagnostics;
