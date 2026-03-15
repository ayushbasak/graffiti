import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowUp, Flag, RefreshCcw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { userStore } from '../store/store';
import refresh_token from '../middlewares/refresh';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

function Display() {
  const [displayData, setDisplayData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isBumping, setIsBumping] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const { access_token, user_id } = userStore(state => state.user);
  const useTokens = userStore(state => state.useTokens);

  const fetchDisplayImage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/display');

      if (!response.data) {
        setDisplayData({
          imageURL: 'https://i.imgur.com/6Y5YXZp.jpg',
          author: 'Unknown',
          content: 'No image is currently on display.',
          bumps: 0,
          user_has_bumped: false,
          user_has_reported: false
        });
        return;
      }

      setDisplayData({
        imageURL: response.data.url,
        author: response.data.author_name,
        content: response.data.content,
        bumps: response.data.bumps,
        // Since user store tracks user_id, check if user has already acted
        user_has_bumped: response.data.bumped_users?.includes(user_id) || false,
        user_has_reported: response.data.reports?.includes(user_id) || false,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to load current display image.');
    } finally {
      setIsLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchDisplayImage();
  }, [fetchDisplayImage]);

  async function bumpPost() {
    setIsBumping(true);
    try {
      const response = await axios.post('http://localhost:5000/display/bump', null, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      toast.success('Bumped successfully! +10 GC');
      setDisplayData(prev => ({
        ...prev,
        bumps: prev.bumps + 1,
        user_has_bumped: true
      }));
    } catch (error) {
      if (error.response?.status === 401) {
        // Only refresh token on 401 Unauthorized
        try {
          const refresh = await refresh_token();
          useTokens(refresh.access_token, refresh.refresh_token);
          toast.error('Session refreshed, please try bumping again.');
        } catch (e) {
          toast.error('Session expired, please log in again.');
        }
      } else {
        toast.error(error.response?.data?.message || 'Failed to bump post.');
      }
    } finally {
      setIsBumping(false);
    }
  }

  async function reportPost() {
    setIsReporting(true);
    try {
      const response = await axios.post('http://localhost:5000/display/report', null, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      toast.success('Post reported successfully.');
      setDisplayData(prev => ({
        ...prev,
        user_has_reported: true
      }));
    } catch (error) {
      if (error.response?.status === 401) {
        // Only refresh token on 401 Unauthorized
        try {
          const refresh = await refresh_token();
          useTokens(refresh.access_token, refresh.refresh_token);
          toast.error('Session refreshed, please try reporting again.');
        } catch (e) {
          toast.error('Session expired, please log in again.');
        }
      } else {
        toast.error(error.response?.data?.message || 'Failed to report post.');
      }
    } finally {
      setIsReporting(false);
    }
  }

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 py-12 md:p-6 min-h-[calc(100vh-140px)]">
      <Card className="w-full max-w-lg shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-baseline">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {isLoading ? (
                <span className="text-slate-300 dark:text-slate-700">Loading...</span>
              ) : displayData.author ? (
                <Link to={`/profile/${displayData.author}`} className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                  {displayData.author}
                </Link>
              ) : (
                "Unknown Artist"
              )}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                {displayData.bumps || 0} BUMPS
              </span>
              <Button size="icon" variant="ghost" onClick={fetchDisplayImage} disabled={isLoading} className="h-8 w-8">
                <RefreshCcw className={`h-4 w-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
            {displayData.content || "No description provided."}
          </p>
        </CardHeader>

        <CardContent>
          <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center relative">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            ) : (
              <img
                src={displayData.imageURL}
                alt="Current display"
                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                loading="lazy"
              />
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 pt-2">
          <Button
            onClick={bumpPost}
            variant={displayData.user_has_bumped ? 'default' : 'outline'}
            className="flex-1 font-semibold border-2"
            disabled={displayData.user_has_bumped || isBumping || isLoading}
          >
            {isBumping ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="mr-2 h-4 w-4" />
            )}
            {displayData.user_has_bumped ? 'Bumped' : 'Bump (+10 GC)'}
          </Button>

          <Button
            onClick={reportPost}
            variant={displayData.user_has_reported ? "destructive" : "outline"}
            disabled={displayData.user_has_reported || isReporting || isLoading}
            className={`px-3 ${!displayData.user_has_reported && 'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20'}`}
            title="Report this post"
          >
            {isReporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Flag className="h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Helper text about mechanics */}
      <p className="mt-8 text-xs text-slate-400 text-center max-w-sm">
        Bumping a post costs +10 Graffiti Coins. Posts with more bumps stay on the main board longer.
      </p>
    </div>
  );
}

export default Display;
