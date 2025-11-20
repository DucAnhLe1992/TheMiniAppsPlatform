import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import type { UserPreferences } from '../types/app.types';

export function useUserPreferences(userId: string | undefined) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchPreferences() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          const { data: newPrefs, error: insertError } = await supabase
            .from('user_preferences')
            .insert({ user_id: userId })
            .select()
            .single();

          if (insertError) throw insertError;
          setPreferences(newPrefs);
        } else {
          setPreferences(data);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [userId]);

  const toggleFavorite = async (appSlug: string) => {
    if (!preferences || !userId) return;

    const isFavorite = preferences.favorite_apps.includes(appSlug);
    const newFavorites = isFavorite
      ? preferences.favorite_apps.filter((slug) => slug !== appSlug)
      : [...preferences.favorite_apps, appSlug];

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ favorite_apps: newFavorites })
        .eq('user_id', userId);

      if (error) throw error;

      setPreferences({ ...preferences, favorite_apps: newFavorites });
    } catch (err) {
      setError(err as Error);
    }
  };

  return { preferences, loading, error, toggleFavorite };
}
