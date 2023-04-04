import { Anchor, Box, Button, Flex, Switch, Text } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../store/store";
import axios from "axios";
import refresh_token from "../middlewares/refresh";
import { themeStore } from '../store/store';
import {
    FaMoon, FaSun
} from 'react-icons/fa';
function Navbar() {
    const toggle = themeStore(state => state.toggle);
    const theme = themeStore(state => state.theme);
    const navigate = useNavigate();
    const authenticated = userStore(state => state.authenticated);
    const user = userStore(state => state.user);
    const toggleAuth = userStore(state => state.toggleAuth);
    const access_token = userStore(state => state.user.access_token);
    const useTokens = userStore(state => state.useTokens);
    const banned = userStore(state => state.user.banned);
    async function Logout() {
        await axios.get('http://localhost:5000/auth/logout', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then((response) => {
            userStore.setState({
                authenticated: false,
                user: {
                    username: '',
                }
            });
            notifications.show({
                title: 'Logout',
                message: 'Logout successful. Redirecting to home.' + response.data,
                color: 'teal',
                autoClose: 4000,
                radius: 'sm'
            });
            window.localStorage.removeItem('refresh_token');
            window.localStorage.removeItem('username');
            toggleAuth(false);
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 2000);
        })
        .catch(async (error) => {

            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red',
                autoClose: 4000,
                radius: 'sm'
            });
            const refresh = await refresh_token();
            useTokens(refresh.access_token, refresh.refresh_token);
        });
    }

    return (
        <Box>
            <Text
                sx={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                backgroundColor: 'purple',
                }}
            >Graffiti</Text>
            <Flex
                mih={50}
                bg='teal'
                gap='md'
                justify='space-evenly'
                align='center'
                direction='row'
            >
                {/* <Notifications position='top-left'/> */}
                {
                    !authenticated &&
                    <>
                        <Link to='/signup'>Signup</Link>
                        <Link to='/login'>Login</Link>
                    </>
                }
                <Link to='/'>Home</Link>
                {
                    authenticated && (
                        <>
                            {
                                !banned &&
                                <Link to='/upload'>Upload</Link>
                            }
                            <Flex
                                gap='md'
                                align='center'
                                direction='row'

                            >
                                <Link to='/profile'>{user.username}</Link>
                                <Button onClick={Logout}>Logout</Button>
                            </Flex>
                        </>
                    )
                }
                <Switch
                    onChange={toggle}
                    thumbIcon={theme === 'dark' ? (<FaMoon />) : (<FaSun />)}
                ></Switch>
            </Flex>
        </Box>
    );
}

export default Navbar;