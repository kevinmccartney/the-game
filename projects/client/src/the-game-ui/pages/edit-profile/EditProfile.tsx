'use client';

import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

import { AuthGuard, MultipleInput } from '@the-game/ui/components';
import { DefaultContainer } from '@the-game/ui/layouts';
import { EditProfileForm } from '@the-game/ui/models';
import { useGetMeQuery } from '@the-game/ui/services';

export const EditProfile = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<EditProfileForm>();
  const { data } = useGetMeQuery();

  const submissionHandler = (vals: { [key: string]: any }) => {
    console.log(vals);
  };

  if (data && !isHydrated) {
    setValue('username', data.username);
    setValue('display_name', data.display_name);
    setValue('email', data.email);
    setValue('phone_number', data.phone_number);
    setValue('location', data.location);
    setValue('about_me', data.about_me);

    setIsHydrated(true);
  }

  useEffect(() => {
    const values = watch();

    console.log(values);
  }, [watch]);

  return (
    <AuthGuard>
      <Helmet>
        <title>The Game | Edit Profile</title>
      </Helmet>
      <DefaultContainer>
        <Flex flexDirection="column">
          <Card>
            <CardBody>
              <Heading>Edit Profile</Heading>
              <form
                onSubmit={
                  handleSubmit(
                    submissionHandler,
                  ) as React.FormEventHandler<HTMLFormElement>
                }
                className="flex flex-col"
              >
                <Flex
                  flexDirection={{ base: 'column', md: 'row' }}
                  flexWrap="wrap"
                  gap={6}
                  mt={4}
                >
                  <FormControl isInvalid={!!errors.username}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      {...register('username', { required: 'Required' })}
                    />
                    {errors.username && (
                      <FormErrorMessage>
                        {errors.username.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.display_name}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      {...register('display_name', { required: 'Required' })}
                    />
                    {errors.display_name && (
                      <FormErrorMessage>
                        {errors.display_name.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      {...register('email', { required: 'Required' })}
                    />
                    {errors.email && (
                      <FormErrorMessage>
                        {errors.email.message}
                      </FormErrorMessage>
                    )}
                    <FormHelperText>
                      Your email is not public, it is only used for account
                      access & communications
                    </FormHelperText>
                  </FormControl>
                  <FormControl isInvalid={!!errors.phone_number}>
                    <FormLabel>Phone number</FormLabel>
                    <Input
                      type="tel"
                      {...register('phone_number')}
                    />
                    {errors.phone_number && (
                      <FormErrorMessage>
                        {errors.phone_number.message}
                      </FormErrorMessage>
                    )}
                    <FormHelperText>
                      Your email is not public, it is only used for account
                      access & communications
                    </FormHelperText>
                  </FormControl>
                  <FormControl isInvalid={!!errors.location}>
                    <FormLabel>Location</FormLabel>
                    <Input
                      type="text"
                      {...register('location')}
                    />
                    {errors.location && (
                      <FormErrorMessage>
                        {errors.location.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.about_me}>
                    <FormLabel>About me</FormLabel>
                    <Textarea {...register('about_me')} />
                    {errors.about_me && (
                      <FormErrorMessage>
                        {errors.about_me.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <MultipleInput
                    errors={errors}
                    fieldName="likes"
                    label="Likes"
                    register={register}
                    setValue={setValue}
                  />
                  <MultipleInput
                    errors={errors}
                    fieldName="dislikes"
                    label="Dislikes"
                    register={register}
                    setValue={setValue}
                  />
                </Flex>
                <Button
                  // leftIcon={
                  //   isLoading ? (
                  //     <FontAwesomeIcon
                  //       icon={faSpinner}
                  //       spin={true}
                  //     />
                  //   ) : undefined
                  // }
                  colorScheme="blue"
                  // colorScheme={isLoading ? 'gray' : 'blue'}
                  justifySelf="flex-end"
                  // disabled={isLoading}
                  mt={8}
                  type="submit"
                >
                  {/* {isLoading ? 'Loading...' : 'Submit'} */}
                  Submit
                </Button>
              </form>
            </CardBody>
          </Card>
        </Flex>
      </DefaultContainer>
    </AuthGuard>
  );
};
