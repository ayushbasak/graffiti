import { Link, useNavigate } from "react-router-dom";
import { userStore, themeStore } from "../store/store";
import { Button } from "@/components/ui/button"; // Shadcn Button
import axios from "axios";
import { FaMoon, FaSun } from 'react-icons/fa';

function Navbar() {
    const navigate = useNavigate();
    const { authenticated, user, toggleAuth } = userStore(state => state);
    const { theme, toggle } = themeStore(state => state);

    async function Logout() {
        try {
            await axios.get('http://localhost:5000/auth/logout', {
                headers: {
                    'Authorization': `Bearer ${user.access_token}`
                }
            });
        } catch (error) {
            console.error(error);
        }

        userStore.setState({
            authenticated: false,
            user: {
                username: '',
                user_id: '',
                user_gc: 0,
                invite_code: '',
                banned: false,
                access_token: '',
                refresh_token: ''
            }
        });

        // Clear cookies
        const d = new Date();
        d.setTime(d.getTime() - (7 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = `refresh_token=;${expires};path=/;SameSite=Strict`;
        document.cookie = `username=;${expires};path=/;SameSite=Strict`;

        import("sonner").then(({ toast }) => {
            toast.success('Logged out successfully.');
        });

        navigate('/');
    }
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 px-4 md:px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Logo area */}
                <div className="flex items-center gap-4 md:gap-6">
                    <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter uppercase">
                        Graffiti.
                    </Link>
                    {authenticated && user && !user.banned && (
                        <Link to="/upload" className="text-xs md:text-sm font-medium text-slate-500 hover:text-black dark:hover:text-white transition-colors">
                            Upload Art
                        </Link>
                    )}
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        {theme === 'dark' ? <FaMoon size={14} className="md:w-[16px] md:h-[16px]" /> : <FaSun size={14} className="md:w-[16px] md:h-[16px]" />}
                    </button>

                    {!authenticated ? (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-xs px-2 md:px-4 md:text-sm">Log in</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="text-xs px-2 md:px-4 md:text-sm">Sign up</Button>
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link to={`/profile/${user.username}`}>
                                <span className="text-xs md:text-sm font-semibold hidden sm:inline-block hover:underline">{user.username}</span>
                            </Link>
                            <Button variant="outline" size="sm" onClick={Logout} className="text-xs px-2 md:px-4 md:text-sm">Log out</Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
