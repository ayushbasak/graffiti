import { Anchor, Box, Text } from "@mantine/core";

function Footer() {
    return (
        <Box
            p={10}
            bg="gray"
            pos={{ xs: 'static', md: 'fixed' }}
            bottom={0}
            left={0}
            right={0}
        >
            <Text>
                made with ❤️ by <Anchor href="https://www.github.com/ayushbasak" color={'white'}>@ayushbasak</Anchor>
            </Text>
            <Text>&copy; 2023</Text>
        </Box>
    );
}

export default Footer;