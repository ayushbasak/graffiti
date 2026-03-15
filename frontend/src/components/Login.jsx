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

function Login() {
    const navigate = useNavigate();
    const useTokens = userStore((state) => state.useTokens);
    const setName = userStore((state) => state.setName);
    const setUserId = userStore((state) => state.setUserId);
    const setUserGc = userStore((state) => state.setUserGc);
    const setUserInvite = userStore((state) => state.setUserInvite);
    const toggleAuth = userStore((state) => state.toggleAuth);
    const setBanned = userStore((state) => state.setBanned);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!username || username.trim() === '') {
            newErrors.username = 'Username is required';
        }
        if (!password || password.trim() === '') {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function login_form(e) {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/auth/login', {
                username: username,
                password: password,
            });

            toast.success('Login successful. Redirecting...');
            useTokens(response.data.access_token, response.data.refresh_token);

            // Set Cookie to expire in 7 days
            const d = new Date();
            d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();

            document.cookie = `refresh_token=${response.data.refresh_token};${expires};path=/;SameSite=Strict`;
            document.cookie = `username=${username};${expires};path=/;SameSite=Strict`;
            setName(username);
            toggleAuth(true);

            setTimeout(() => {
                navigate('/', { replace: true })
            }, 1000);

            const userInfo = await getUserInfo(response.data.access_token);
            if (userInfo) {
                setUserId(userInfo._id);
                setUserGc(userInfo.gc);
                setUserInvite(userInfo.invite);
                setBanned(userInfo.access_level < 0);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-140px)] px-4 py-8">
            <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-1 text-center mb-4">
                    <CardTitle className="text-3xl font-bold tracking-tight">Login</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={login_form}>
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
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Submit"}
                        </Button>
                        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <a href="/signup" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
                                Sign up
                            </a>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default Login;