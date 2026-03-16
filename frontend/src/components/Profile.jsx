import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { userStore } from "../store/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Key, Coins, AlertCircle, Calendar, Copy, Check, Mail } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from "sonner";
import { API_BASE_URL } from "../api";

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
                const response = await axios.get(`${API_BASE_URL}/users/${username}`);
                setProfileData(response.data);

                // If this is our own profile, force update the global state too!
                if (currentUser.username === username && currentUser.access_token) {
                    try {
                        const info = await axios.get(`${API_BASE_URL}/auth/userinfo`, {
                            headers: { 'Authorization': `Bearer ${currentUser.access_token}` }
                        });
                        userStore.getState().useUserInfo(info.data);
                    } catch (e) {
                        console.error("Silent ignore: Background balance refresh failed", e);
                    }
                }
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
    }, [username, currentUser.access_token]);

    const [copied, setCopied] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isPostsLoading, setIsPostsLoading] = useState(false);

    useEffect(() => {
        async function fetchUserPosts() {
            setIsPostsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/posts?authorName=${username}&limit=100`);
                setPosts(response.data.posts);
            } catch (err) {
                console.error("Failed to fetch user folio", err);
            } finally {
                setIsPostsLoading(false);
            }
        }
        if (username) fetchUserPosts();
    }, [username]);

    const inviteText = `Yo! I'm bombing the digital wall on Graffiti. 🎨 Use my code ${currentUser.invite_code} to join at http://localhost:3000 !`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentUser.invite_code);
        setCopied(true);
        toast.success("Invite code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(inviteText)}`;
        window.open(url, '_blank');
    };

    const shareEmail = () => {
        const subject = encodeURIComponent("Join me on Graffiti!");
        const body = encodeURIComponent(inviteText);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

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

    const displayBanned = isOwnProfile ? currentUser.banned : profileData.access_level < 0;
    const displayGc = isOwnProfile ? currentUser.user_gc : profileData.gc;

    return (
        <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4 py-12 md:p-6 min-h-[calc(100vh-140px)] gap-12">
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
                        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                                        <Key className="text-purple-500 h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none mb-1 text-slate-500">Your Invite Code</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono text-sm tracking-widest font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">
                                                {currentUser.invite_code}
                                            </p>
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                                title="Copy Code"
                                            >
                                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
                                            </button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/10 font-bold"
                                                onClick={shareWhatsApp}
                                                title="Share on WhatsApp"
                                            >
                                                <FaWhatsapp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 gap-2 text-slate-600 dark:text-slate-400 font-bold"
                                                onClick={shareEmail}
                                                title="Share via Email"
                                            >
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isOwnProfile && (
                        <div className="pt-6">
                            <Link to="/shop" className="w-full">
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 font-bold">
                                    <Coins className="mr-2 h-4 w-4" />
                                    Buy More GCs
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="w-full max-w-5xl">
                <div className="flex items-center gap-2 mb-6 ml-2">
                    <div className="h-8 w-1 bg-blue-500 rounded-full" />
                    <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-slate-50">Art Folio</h2>
                    <span className="text-sm font-bold text-slate-400 ml-2">({posts.length})</span>
                </div>

                {isPostsLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-950/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-400 font-medium italic underline decoration-slate-300">No art found in the folio yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {posts.map((post) => (
                            <div key={post._id} className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group relative">
                                <img
                                    src={post.url}
                                    alt={post.content}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                    <p className="text-white text-xs font-medium text-center italic">{post.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;