import { Box, Text } from "@mantine/core";
import { userStore } from "../store/store";
function Profile() {
    const user = userStore((state) => state.user);
    const banned = userStore((state) => state.user.banned);
    return (
        <Box
            padding="xl"
            bg={banned ? "yellow" : "white"}
            height="100vh"
        >
            <Text>Username: {user.username}</Text>
            <Text>UserId: {user.user_id}</Text>
            <Text>GrafCoins: {user.user_gc}</Text>
            <Text>Invite: {user.invite_code}</Text>
            {
                banned &&
                <Text
                    color="red"
                    size="xl"
                >
                    You have been banned from posting on the forums.<br /> Please contact an administrator for more information.
                </Text>
            }
        </Box>
    );
}

export default Profile;