import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, User, Calendar } from "lucide-react";
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';

function Gallery() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchPosts() {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/posts?page=${page}&limit=12`);
                setPosts(response.data.posts);
                setTotalPages(response.data.last_page);
            } catch (error) {
                console.error("Failed to fetch gallery posts", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPosts();
    }, [page]);

    return (
        <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 p-4 md:p-8 min-h-[calc(100vh-140px)]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
                            Graffiti Gallery
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Browse through the history of digital art on Graffiti.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1 || isLoading}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-md disabled:opacity-50 font-medium"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-bold px-4">
                            Page {page} of {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages || isLoading}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-md disabled:opacity-50 font-medium"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-950/50 rounded-xl border-2 border-dashed">
                        <ImageIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-600">The gallery is empty</h3>
                        <p className="text-slate-400">Be the first to upload art!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Card key={post._id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all group bg-white dark:bg-slate-950">
                                <CardContent className="p-0 relative aspect-square">
                                    <img
                                        src={post.url}
                                        alt={post.content || "Graffiti Art"}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <p className="text-white text-sm font-medium line-clamp-2 italic">
                                            {post.content ? `"${post.content}"` : ""}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 flex flex-col items-start gap-2">
                                    <div className="flex items-center justify-between w-full">
                                        <Link
                                            to={`/profile/${post.author_name}`}
                                            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <User className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm font-bold lowercase tracking-tight">{post.author_name}</span>
                                        </Link>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Gallery;
