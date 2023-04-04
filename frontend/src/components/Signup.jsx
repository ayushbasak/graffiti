import { TextInput, Text, Button, Group, Box, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Notifications, notifications } from '@mantine/notifications';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../middlewares/getUserInfo';
import { userStore } from '../store/store';
function Signup() {
    const navigate = useNavigate();
    const useTokens = userStore((state) => state.useTokens);
    const setName = userStore((state) => state.setName);
    const setUserId = userStore((state) => state.setUserId);
    const setUserGc = userStore((state) => state.setUserGc);
    const setUserInvite = userStore((state) => state.setUserInvite);
    const toggleAuth = userStore((state) => state.toggleAuth);
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            invite: '',
        },
        validate: {
            username: (value) => (value.length > 0 ? null : 'Invalid username'),
            password: (value) => (value.length > 0 ? null : 'Invalid password'),
            invite: (value) => (value.length > 0 ? null : 'Invalid invite'),
        }
    });

    async function login_form(e) {
        e.preventDefault();
        await axios.post('http://localhost:5000/auth/signup', {
            username: form.values.username,
            password: form.values.password,
            invite: form.values.invite,
        })
        .then((response) => {
            notifications.show({
                title: 'Signup',
                message: 'Signup successful. Redirecting...',
                color: 'teal',
                autoClose: 4000,
                radius: 'sm'
            });
            useTokens(response.data.access_token, response.data.refresh_token);
            window.localStorage.setItem('refresh_token', response.data.refresh_token);
            window.localStorage.setItem('username', form.values.username);
            setName(form.values.username);
            setUserId(response.data.user_id);
            toggleAuth(true);
            setTimeout(() => {
                navigate('/', { replace: true })
            }, 5000);
        })
        .then(async (response) => {
            return getUserInfo(response.data.access_token);
        })
        .then((response) => {
            setUserId(response._id);
            setUserGc(response.gc);
            setUserInvite(response.invite)
        })
        .catch((error) => {
            notifications.show({
                title: 'Error',
                message: error.response.data.message,
                color: 'red',
                autoClose: 4000,
                radius: 'sm'
            });
        });
    }

    return (
    <Box
        bg={'#f5f5f5'}
    >
        <form onSubmit={login_form}>
        <Flex
            direction="column"
            align="center"
            justify="center"
            padding="lg"
            shadow="md"
        >
            <Text>
                Signup
            </Text>
            <TextInput
                p={10}
                w='400px'
                withAsterisk
                placeholder="username"
                {...form.getInputProps('username')}
            />
            <TextInput
                p={10}
                w='400px'
                withAsterisk
                placeholder="password"
                type='password'
                {...form.getInputProps('password')}
            />
            <TextInput
                p={10}
                w='400px'
                withAsterisk
                placeholder="invite code"
                {...form.getInputProps('invite')}
            />
            <Notifications position='top-left'/>
            <Group position="center">
                <Button type="submit">Submit</Button>
            </Group>
        </Flex>
        </form>
    </Box>
    );
}

export default Signup;