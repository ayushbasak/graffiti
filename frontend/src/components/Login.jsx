import { TextInput, Text, Button, Group, Box, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Notifications, notifications } from '@mantine/notifications';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../middlewares/getUserInfo';
import { userStore } from '../store/store';
function Login() {
    const navigate = useNavigate();
    const useTokens = userStore((state) => state.useTokens);
    const setName = userStore((state) => state.setName);
    const setUserId = userStore((state) => state.setUserId);
    const setUserGc = userStore((state) => state.setUserGc);
    const setUserInvite = userStore((state) => state.setUserInvite);
    const toggleAuth = userStore((state) => state.toggleAuth);
    const setBanned = userStore((state) => state.setBanned);
    const authenticated = userStore((state) => state.authenticated);
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },
        validate: {
            username: (value) => (value.length > 0 ? null : 'Invalid username'),
            password: (value) => (value.length > 0 ? null : 'Invalid password'),
        }
    });

    async function login_form(e) {
        e.preventDefault();
        await axios.post('http://localhost:5000/auth/login', {
            username: form.values.username,
            password: form.values.password,
        })
        .then((response) => {
            notifications.show({
                title: 'Login',
                message: 'Login successful. Redirecting...',
                color: 'teal',
                autoClose: 4000,
                radius: 'sm'
            });
            useTokens(response.data.access_token, response.data.refresh_token);
            window.localStorage.setItem('refresh_token', response.data.refresh_token);
            window.localStorage.setItem('username', form.values.username);
            setName(form.values.username);
            toggleAuth(true);
            setTimeout(() => {
                navigate('/', { replace: true })
            }, 5000);

            return response;
        })
        .then((response) => {
            return getUserInfo(response.data.access_token)
        })
        .then((response) => {
            setUserId(response._id);
            setUserGc(response.gc);
            setUserInvite(response.invite)
            setBanned(response.access_level < 0);
        })
        .catch((error) => {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red',
                autoClose: 4000,
                radius: 'sm'
            });
        });
    }

    return (
    <Box>
        <form onSubmit={login_form}>
            <Flex
                mih={50}
                bg='red'
                p={10}
                radius='sm'
                direction='column'
                align='center'
                justify='center'
                height='100%'
            >
                <Text
                    size='2rem'
                    color='white'
                >
                    Login
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
                {/* <Notifications position='top-left'/> */}
                <Group position="center">
                    <Button type="submit">Submit</Button>
                </Group>
            </Flex>
        </form>
    </Box>
    );
}

export default Login;