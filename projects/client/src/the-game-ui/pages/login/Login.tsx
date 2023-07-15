import {
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';
import GoogleButton from 'react-google-button';
import { Helmet } from 'react-helmet-async';

import { DefaultContainer } from '@the-game/ui/layouts';
import { loginClickHandler } from '@the-game/ui/utils';

export const Login = () => {
  const auth = getAuth();
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  return (
    <>
      <Helmet>
        <title>The Game | Login</title>
      </Helmet>
      <DefaultContainer
        sectionProps={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
        containerProps={{ height: '100%' }}
      >
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels
            mt={4}
            p={0}
          >
            <TabPanel p={0}>
              <Card minW="sm">
                <CardBody>
                  <form>
                    <Flex
                      flexDirection="column"
                      gap={4}
                    >
                      <FormControl isDisabled={true}>
                        <FormLabel>Email address</FormLabel>
                        <Input type="email" />
                      </FormControl>
                      <FormControl isDisabled={true}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" />
                      </FormControl>
                      <Button
                        alignSelf="end"
                        colorScheme="blue"
                        isDisabled={true}
                      >
                        Submit
                      </Button>
                    </Flex>
                  </form>
                  <Text
                    fontStyle="italic"
                    mt={4}
                  >
                    We&apos;re still working on sign in with email & password.
                    Use Google for now! 🤝
                  </Text>
                  <Divider my={4} />
                  <Flex justifyContent="center">
                    <GoogleButton
                      onClick={loginClickHandler({ auth, provider, router })}
                    />
                  </Flex>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel p={0}>
              <Card>
                <CardBody>
                  <form>
                    <Flex
                      flexDirection="column"
                      gap={4}
                    >
                      <FormControl isDisabled={true}>
                        <FormLabel>Email address</FormLabel>
                        <Input type="email" />
                      </FormControl>
                      <FormControl isDisabled={true}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" />
                      </FormControl>
                      <Button
                        alignSelf="end"
                        colorScheme="blue"
                        isDisabled={true}
                      >
                        Submit
                      </Button>
                    </Flex>
                  </form>
                  <Text
                    fontStyle="italic"
                    mt={4}
                  >
                    We&apos;re still working on sign up with email & password.
                    Use Google for now! 🤝
                  </Text>
                  <Divider my={4} />
                  <Flex justifyContent="center">
                    <GoogleButton
                      onClick={loginClickHandler({ auth, provider, router })}
                    />
                  </Flex>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DefaultContainer>
    </>
  );
};
