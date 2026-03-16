function Footer() {
    return (
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-4 md:py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-slate-500 dark:text-slate-400">
                <p>
                    &copy; {new Date().getFullYear()} Graffiti. All rights reserved.
                </p>
                <p className="mt-2 md:mt-0 flex items-center gap-2">
                    Built by{' '}
                    <a
                        href="https://github.com/ayushbasak"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-slate-900 dark:text-slate-50 hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        @ayushbasak
                    </a>
                    <span className="text-xs text-slate-500 dark:text-slate-400"> & co-authored by Gemini</span>
                </p>
            </div>
        </footer>
    );
}

export default Footer;