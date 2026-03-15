import { Box, Flex, Text } from "@mantine/core";
import Display from "./Display";
import { userStore } from "../store/store";

function Home() {
    const authenticated = userStore(state => state.authenticated);
    const username = userStore(state => state.user.username);
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-140px)]">
            {authenticated ? (
                <Display />
            ) : (
                <div className="flex flex-col items-center gap-4 text-center px-4">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Welcome to Graffiti
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-[500px]">
                        You need to be logged in to view and interact with the daily art board.
                    </p>
                </div>
            )}
        </div>
    );
}

export default Home;