import {
  Button,
  CreateToastFnReturn,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useToast,
} from '@chakra-ui/react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noop } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';

import { UserSearchField } from '@the-game/ui/components/user-search-field';
import { AssignPointsForm as AssignPointsFormModel } from '@the-game/ui/models';
import { usePostPointsMutation } from '@the-game/ui/services';

export const AssignPointsForm = ({
  form,
  onClose,
  onSubmitSuccess,
  showCancel,
}: Readonly<{
  form: Readonly<UseFormReturn<AssignPointsFormModel, any, undefined>>;
  onClose?: () => void;
  onSubmitSuccess?: () => Promise<void>;
  showCancel?: boolean;
}>) => {
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    watch,
  } = form;
  const toast: CreateToastFnReturn = useToast();
  const [values, setValues] = useState(getValues());
  const [usePostPoints, { isLoading }] = usePostPointsMutation();
  useEffect(() => {
    const subscription = watch(() => {
      const formValues = getValues();

      setValues(formValues);
    });

    return () => subscription.unsubscribe();
  });

  const postPoint = async (toastFn: CreateToastFnReturn) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await usePostPoints({
      body: {
        points: parseInt(values.points as unknown as string, 10),
        reason: values.reason,
      },
      userId: values.subject,
    });

    if (onClose) {
      onClose();
    }

    if (onSubmitSuccess) {
      await onSubmitSuccess();
    }

    reset();

    toastFn({
      duration: 9000,
      isClosable: true,
      status: 'success',
      title: 'Point Created.',
      variant: 'top-accent',
    });
  };

  const localOnSubmit: SubmitHandler<AssignPointsFormModel> = async () => {
    await postPoint(toast);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(localOnSubmit)}>
      <Flex
        columnGap={8}
        flexDirection={{ base: 'column', md: 'row' }}
        flexWrap={{ md: 'wrap' }}
        mt={{ base: 8, md: 0 }}
        rowGap={2}
      >
        <UserSearchField
          containerProps={{ width: { md: '75%' } }}
          errors={errors}
          form={form}
        />
        <FormControl
          isInvalid={!!errors.reason}
          width={{ md: '45%' }}
        >
          <FormLabel>Reason</FormLabel>
          <Input
            {...register('reason', { required: 'Required' })}
            _placeholder={{
              color: errors.reason ? 'red.500' : 'gray.400',
            }}
            borderColor={errors.reason ? 'red.500' : 'gray.200'}
            className={errors.reason ? 'hover:border-red-500' : ''}
            colorScheme="red"
            placeholder="So good at making websites 🤗"
          />
          {errors.reason && (
            <FormErrorMessage>{errors.reason.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isInvalid={!!errors.points}
          width={{ md: '45%' }}
        >
          <FormLabel>Points</FormLabel>
          <NumberInput>
            <NumberInputField
              _placeholder={{
                color: errors.points ? 'red.500' : 'gray.400',
              }}
              borderColor={errors.points ? 'red.500' : 'gray.200'}
              className={errors.points ? 'hover:border-red-500' : ''}
              placeholder="50"
              {...register('points', {
                required: 'Required',
                validate: (value) =>
                  !Number.isNaN(parseInt(value as unknown as string, 10)) ||
                  'Must be a positive or negative number',
              })}
              pattern="-?[0-9]*"
            />
          </NumberInput>
          {errors.points && (
            <FormErrorMessage>{errors.points.message}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
      <Flex
        justifyContent="flex-end"
        mt={8}
      >
        {showCancel && (
          <Button
            mr={3}
            onClick={onClose || noop}
            variant="outline"
          >
            Cancel
          </Button>
        )}

        <Button
          leftIcon={
            isLoading ? (
              <FontAwesomeIcon
                icon={faSpinner}
                spin={true}
              />
            ) : undefined
          }
          colorScheme={isLoading ? 'gray' : 'blue'}
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </Button>
      </Flex>
    </form>
  );
};

AssignPointsForm.defaultProps = {
  inverse: false,
  onClose: () => {},
  showCancel: false,
};
