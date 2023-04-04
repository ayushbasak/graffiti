import { Box, Button, Flex, Input, Slider, Text, TextInput } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import axios from "axios";
import { useRef, useState } from "react";
import { userStore } from "../store/store";

function UploadPost() {
    const imageURL = useRef();
    const content = useRef();
    const [duration, setDuration] = useState(1);
    const access_token = userStore(state => state.user.access_token);
    async function uploadImage() {
        await axios.post('http://localhost:5000/iq', {
            url: imageURL.current.value,
            content: content.current.value,
            duration: duration
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then((response) => {
            notifications.show({
                title: 'Upload',
                message: 'Upload successful.',
                color: 'teal',
                autoClose: 4000,
                radius: 'sm'
            });
        })
        .catch((error) => {
            notifications.show({
                title: 'Error',
                message: error.response.data.message,
                color: 'red',
                autoClose: 4000,
                radius: 'sm',
            });
        });
    }

    return (
        <Box>
            <Flex
                direction="column"
                align="center"
                justify="center"
                p={10}
            >
                <Text>Upload Post</Text>
                <TextInput
                    p={10}
                    w='400px'
                    withAsterisk
                    placeholder="image URL"
                    ref={imageURL}
                />
                <TextInput
                    p={10}
                    w='400px'
                    withAsterisk
                    placeholder="content"
                    ref={content}
                />
                <Slider label={(value) => `duration: ${value} m`} p={20} w={'200px'} max='10' min={1} value={duration} onChange={setDuration}/>
                <Button type="submit" onClick={uploadImage}>Upload</Button>
            </Flex>
        </Box>
    );
}

export default UploadPost;