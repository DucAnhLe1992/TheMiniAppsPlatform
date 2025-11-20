import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import type { App } from '../types/app.types';

export function useApps() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('apps')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setApps(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  return { apps, loading, error };
}
