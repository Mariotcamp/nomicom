import { useState, useEffect, useCallback } from 'react';
import type { Profile } from '../types';
import { GAS_API_URL, MOCK_PROFILES } from '../constants';

interface UseProfilesReturn {
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProfiles = (): UseProfilesReturn => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if API URL is configured
      if (!GAS_API_URL || GAS_API_URL.trim() === '' || GAS_API_URL.includes('YOUR_SCRIPT_ID')) {
        // Use mock data for development
        console.log('Using mock data (GAS URL not configured)');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        setProfiles(MOCK_PROFILES);
        return;
      }

      // Google Apps ScriptのWebアプリはCORSを自動的に処理します
      // GETリクエストではContent-Typeヘッダーは不要（プリフライトリクエストを避けるため）
      // redirect: 'follow'でリダイレクトを追跡
      const response = await fetch(GAS_API_URL, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success && Array.isArray(data.data)) {
        console.log(`Loaded ${data.data.length} profiles from API`);
        setProfiles(data.data);
      } else if (Array.isArray(data)) {
        // Handle direct array response
        console.log(`Loaded ${data.length} profiles from API (direct array)`);
        setProfiles(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
      const errorMessage = err instanceof Error 
        ? err.message.includes('CORS') || err.message.includes('cors')
          ? 'CORSエラーが発生しました。Google Apps ScriptのWebアプリの設定を確認してください。'
          : err.message
        : 'Failed to fetch profiles';
      setError(errorMessage);
      // Fallback to mock data on error
      setProfiles(MOCK_PROFILES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return {
    profiles,
    isLoading,
    error,
    refetch: fetchProfiles,
  };
};
