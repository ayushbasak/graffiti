import { Box, Button, Flex, Image, Text } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import axios from 'axios';
import { useState, useEffect } from 'react';
import refresh_token from '../middlewares/refresh';
import { userStore } from '../store/store';
function Display() {
  const [displayData, setDisplayData] = useState({});
  const access_token = userStore(state => state.user.access_token);
  const user_id = userStore(state => state.user.user_id);
  const useTokens = userStore((state) => state.useTokens);
  async function fetchDisplayImage() {
    await axios.get('http://localhost:5000/display')
      .then((response) => {
        if (!response.data) {
          setDisplayData({
            imageURL: 'https://i.imgur.com/6Y5YXZp.jpg',
          })
          return;
        }
        setDisplayData({
          imageURL: response.data.url,
          author: response.data.author_name,
          content: response.data.content,
          bumps: response.data.bumps,
          user_has_bumped: response.data.bumped_users.includes(user_id),
          user_has_reported: response.data.reports.includes(user_id),
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function bumpPost() {
    await axios.post('http://localhost:5000/display/bump', null, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then((response) => {
        notifications.show({
          title: 'Bump',
          message: 'Bump successful. ' + response.data,
          color: 'teal',
          autoClose: 4000,
          radius: 'sm'
        });
        setDisplayData({
          ...displayData,
          user_has_bumped: !displayData.user_has_bumped 
        });
      })
      .catch(async (error) => {
        const refresh = await refresh_token();
        useTokens(refresh.access_token, refresh.refresh_token);
        notifications.show({
          title: 'Error',
          message: error.response.data.message,
          color: 'red',
          autoClose: 4000,
          radius: 'sm'
        });
      });
  }

  async function reportPost() {
    await axios.post('http://localhost:5000/display/report', null, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then((response) => {
        notifications.show({
          title: 'Report',
          message: 'Report successful. ' + response.data,
          color: 'teal',
          autoClose: 4000,
          radius: 'sm'
        });
      })
      .catch(async (error) => {
        const refresh = await refresh_token();
        useTokens(refresh.access_token, refresh.refresh_token);
        notifications.show({
          title: 'Error',
          message: error.response.data.message,
          color: 'red',
          autoClose: 4000,
          radius: 'sm'
        });
      });
  }

  useEffect(() => {
    fetchDisplayImage();
  }, []);

  return (
    <Box
      bg={'#f5f5f5'}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Flex
        direction='column'
        align='center'
        justify='center'
        padding='lg'
      >
        {/* <Notifications position='top-left'/> */}
        <Image alt = "Random Image" src={displayData.imageURL} maw={400} mx='auto' radius='md'/>
        <Text>Author: {displayData.author}</Text>
        <Text>Content: {displayData.content}</Text>
        <Text>Bumps: {displayData.bumps}</Text>
        <Button.Group>
          <Button
            onClick={bumpPost}
            variant={displayData.user_has_bumped ? 'filled' : 'outline'}
          >Bump{displayData.user_has_bumped ? 'ed' : ''}</Button>
          <Button
            color={'red'}
            onClick={reportPost}
            disabled={displayData.user_has_reported}
          >
            Report
          </Button>
        </Button.Group>
      </Flex>
    </Box>
  );
}

export default Display;
