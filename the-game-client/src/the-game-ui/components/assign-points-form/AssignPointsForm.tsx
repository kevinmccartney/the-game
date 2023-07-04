import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';

import { UserSearchField } from '@the-game/client/the-game-ui/components';
import { AssignPointsForm as AssignPointsFormModel } from '@the-game/client/the-game-ui/models';
import { getAuth } from 'firebase/auth';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faS, faSpinner } from '@fortawesome/free-solid-svg-icons';

export const AssignPointsForm = ({
  showCancel,
  onClose,
  form,
}: {
  showCancel?: boolean;
  onClose?: () => void;
  form: UseFormReturn<AssignPointsFormModel, any, undefined>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    getValues,
  } = form;
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const auth = getAuth();
  const onSubmit: SubmitHandler<AssignPointsFormModel> = () => {
    setIsLoading(true);
    postPoint(toast);
  };
  const [values, setValues] = useState(getValues());

  useEffect(() => {
    const subscription = watch(() => {
      const values = getValues();

      setValues(values);
    });

    return () => subscription.unsubscribe();
  });

  const postPoint = async (toast: any) => {
    const token = await auth.currentUser?.getIdToken();

    await fetch(
      `https://api.the-game.kevinmccartney.dev/v1/users/${values.subject}/points`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: values.reason,
          // value from number field comes through as a string
          points: parseInt(values.points as unknown as string),
        }),
      },
    );

    setIsLoading(false);

    if (onClose) {
      onClose();
    }

    toast({
      title: 'Point Created.',
      // description: "Point cre.",
      status: 'success',
      duration: 9000,
      isClosable: true,
      variant: 'top-accent',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        gap={8}
        mt={{ base: 8, md: 0 }}
        flexDirection={{ base: 'column', md: 'row' }}
        flexWrap={{ md: 'wrap' }}
      >
        <UserSearchField
          register={register}
          setValue={setValue}
          errors={errors}
          containerProps={{ width: { md: '75%' } }}
          form={form}
        />
        <FormControl
          width={{ md: '45%' }}
          isInvalid={!!errors.reason}
        >
          <FormLabel>Reason</FormLabel>
          <Input
            {...register('reason', { required: 'Required' })}
            placeholder="So good at making websites 🤗"
            _placeholder={{
              color: errors.reason ? 'red.500' : 'gray.400',
            }}
            borderColor={errors.reason ? 'red.500' : 'gray.200'}
            className={errors.reason ? 'hover:border-red-500' : ''}
            colorScheme="red"
          />
          {errors.reason && (
            <FormErrorMessage>{errors.reason.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          width={{ md: '45%' }}
          isInvalid={!!errors.points}
        >
          <FormLabel>Points</FormLabel>
          {/* <NumberInput> */}
          <Input
            placeholder="50"
            _placeholder={{
              color: errors.points ? 'red.500' : 'gray.400',
            }}
            borderColor={errors.points ? 'red.500' : 'gray.200'}
            className={errors.points ? 'hover:border-red-500' : ''}
            {...register('points', {
              required: 'Required',
              validate: (value) => {
                return (
                  !isNaN(parseInt(value as any)) ||
                  'Must be a positive or negative number'
                );
              },
            })}
            inputMode="numeric"
          />
          {/* </NumberInput> */}
          {errors.points && (
            <FormErrorMessage>{errors.points.message}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
      <Flex
        mt={8}
        justifyContent="flex-end"
      >
        {showCancel && (
          <Button
            variant="outline"
            mr={3}
            onClick={onClose || noop}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          colorScheme={isLoading ? 'gray' : 'blue'}
          disabled={isLoading}
          leftIcon={
            isLoading ? (
              <FontAwesomeIcon
                icon={faSpinner}
                spin
              />
            ) : undefined
          }
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </Button>
      </Flex>
    </form>
  );
};

AssignPointsForm.defaultProps = {
  showCancel: false,
  onClose: () => {},
  inverse: false,
};
