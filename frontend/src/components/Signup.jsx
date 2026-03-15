import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import getUserInfo from '../middlewares/getUserInfo';
import { userStore } from '../store/store';

function Signup() {
    const navigate = useNavigate();
    const useTokens = userStore((state) => state.useTokens);
    const setName = userStore((state) => state.setName);
    const setUserId = userStore((state) => state.setUserId);
    const setUserGc = userStore((state) => state.setUserGc);
    const setUserInvite = userStore((state) => state.setUserInvite);
    const toggleAuth = userStore((state) => state.toggleAuth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invite, setInvite] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!username || username.trim() === '') {
            newErrors.username = 'Username is required';
        }
        if (!password || password.trim() === '') {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!invite || invite.trim() === '') {
            newErrors.invite = 'Invite code is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function signup_form(e) {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/auth/signup', {
                username: username,
                password: password,
                invite: invite,
            });

            toast.success('Signup successful. Redirecting...');
            useTokens(response.data.access_token, response.data.refresh_token);

            // Set Cookie to expire in 7 days
            const d = new Date();
            d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();

            document.cookie = `refresh_token=${response.data.refresh_token};${expires};path=/;SameSite=Strict`;
            document.cookie = `username=${username};${expires};path=/;SameSite=Strict`;

            setName(username);
            setUserId(response.data.user_id);
            toggleAuth(true);

            setTimeout(() => {
                navigate('/', { replace: true })
            }, 1000);

            // Using logic from your original code, grab info if access token was received.
            if (response?.data?.access_token) {
                const userInfo = await getUserInfo(response.data.access_token);
                if (userInfo) {
                    setUserId(userInfo._id);
                    setUserGc(userInfo.gc);
                    setUserInvite(userInfo.invite);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to sign up.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-140px)] px-4 py-8">
            <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-1 text-center mb-4">
                    <CardTitle className="text-3xl font-bold tracking-tight">Sign Up</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Enter your details and invite code to join Graffiti
                    </CardDescription>
                </CardHeader>
                <form onSubmit={signup_form}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                            )}
                        </div>
                        <div className="space-y-2 text-left">
                            <Label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                            )}
                        </div>
                        <div className="space-y-2 text-left">
                            <Label htmlFor="invite" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300">
                                Invite Code
                            </Label>
                            <Input
                                id="invite"
                                type="text"
                                placeholder="XXXX-XXXX-XXXX"
                                value={invite}
                                onChange={(e) => setInvite(e.target.value)}
                                className={errors.invite ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.invite && (
                                <p className="text-sm text-red-500 mt-1">{errors.invite}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
                                Log in
                            </a>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default Signup;