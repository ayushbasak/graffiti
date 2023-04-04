import { Box, Flex, Text } from "@mantine/core";
import Display from "./Display";
import { userStore } from "../store/store";

function Home() {
    const authenticated = userStore(state => state.authenticated);
    const username = userStore(state => state.user.username);
    return (
        <Box
            bg={'green'}
        >
            <Flex
                mih={50}
                p={20}
                radius='sm'
                justify='space-between'
                align='center'
                direction={'column'}
            >
                {
                    authenticated ?
                    <Display /> :
                    <Text>You need to be logged in to access this page</Text>
                }
            </Flex>
        </Box>
    );
}

export default Home;