import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { API_BASE_URL } from '../api';

function StatsBar() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await axios.get(`${API_BASE_URL}/posts/stats`);
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch global stats", err);
            }
        }
        fetchStats();
        // Poll every 30 seconds for non-websocket "live" feel
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!stats) return null;

    return (
        <div className="w-full bg-slate-900 text-slate-400 py-1.5 px-4 md:px-6 flex items-center justify-center gap-6 md:gap-12 text-[10px] md:text-xs font-bold tracking-widest uppercase border-b border-white/5">
            <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-blue-500" />
                <span>{stats.totalUsers} Artists</span>
            </div>
            <div className="flex items-center gap-2">
                <ImageIcon className="h-3 w-3 text-amber-500" />
                <span>{stats.totalPosts} Graffitis</span>
            </div>
            <div className="flex items-center gap-2">
                <LayoutGrid className="h-3 w-3 text-green-500" />
                <span>{stats.queueSize} in Queue</span>
            </div>
        </div>
    );
}

export default StatsBar;
