import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { userStore } from "../store/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, User, Key, Coins, AlertCircle, Calendar } from "lucide-react";

function Profile() {
    const { username } = useParams();
    const currentUser = userStore((state) => state.user);

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const isOwnProfile = currentUser.username === username;

    useEffect(() => {
        async function fetchProfile() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:5000/users/${username}`);
                setProfileData(response.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError("User not found");
                } else {
                    setError("Failed to load profile");
                }
            } finally {
                setIsLoading(false);
            }
        }

        if (username) fetchProfile();
    }, [username]);

    if (isLoading) {
        return (
            <div className="flex-1 w-full flex items-center justify-center min-h-[calc(100vh-140px)]">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Oops!</h2>
                <p className="text-slate-500">{error}</p>
            </div>
        );
    }

    // Determine what to show. If it's their own profile, we show their full state config.
    // Otherwise, we show the public API data.
    const displayBanned = isOwnProfile ? currentUser.banned : profileData.access_level < 0;
    const displayGc = isOwnProfile ? currentUser.user_gc : profileData.gc;

    return (
        <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 py-12 md:p-6 min-h-[calc(100vh-140px)]">
            <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50">
                <CardHeader className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <User className="w-10 h-10 text-slate-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        {username}
                    </CardTitle>
                    <CardDescription>
                        {isOwnProfile ? "Your Profile" : "Public Profile"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                    {displayBanned && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900/50 mb-6">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold">Account Banned</p>
                                <p>This account is restricted from posting on the forums.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                            <Coins className="text-amber-500 h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-none mb-1 text-slate-500">Graffiti Coins</p>
                            <p className="text-lg font-bold">{displayGc}</p>
                        </div>
                    </div>

                    {profileData.createdAt && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                                <Calendar className="text-blue-500 h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium leading-none mb-1 text-slate-500">Joined</p>
                                <p className="font-medium">{new Date(profileData.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}

                    {isOwnProfile && currentUser.invite_code && (
                        <div className="flex items-center gap-3 pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                                <Key className="text-purple-500 h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium leading-none mb-1 text-slate-500">Your Invite Code</p>
                                <p className="font-mono text-sm tracking-widest font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">
                                    {currentUser.invite_code}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;