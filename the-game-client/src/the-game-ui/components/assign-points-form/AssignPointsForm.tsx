import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

import { UserSearchField } from '@the-game/client/the-game-ui/components';
import { AssignPointsForm as AssignPointsFormModel } from '@the-game/client/the-game-ui/models';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

export const AssignPointsForm = (props: any) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    getValues,
  } = useForm<AssignPointsFormModel>();
  const onSubmit: SubmitHandler<AssignPointsFormModel> = (data) => {
    console.log(errors);
    console.log(data);
  };
  const [values, setValues] = useState(getValues());

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log(errors);
      // console.log(value, name, type);

      const values = getValues();

      setValues(values);
    });

    return () => subscription.unsubscribe();
  });

  return (
    <Box mt={8}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          gap={8}
          flexDirection="column"
        >
          <UserSearchField
            register={register}
            setValue={setValue}
            errors={errors}
          />
          <FormControl>
            <FormLabel>Reason</FormLabel>
            <Input
              {...register('reason', { required: true })}
              placeholder="So good at making websites 🤗"
              _placeholder={{
                color: errors.reason
                  ? 'red.500'
                  : values?.reason?.length > 0
                  ? 'gray.800'
                  : 'gray.400',
              }}
              borderColor={errors.reason ? 'red.500' : 'gray.200'}
              className={errors.reason ? 'hover:border-red-500' : ''}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Points</FormLabel>
            <NumberInput>
              <NumberInputField
                placeholder="50"
                _placeholder={{
                  color: errors.points
                    ? 'red.500'
                    : values?.points
                    ? 'gray.800'
                    : 'gray.400',
                }}
                borderColor={errors.points ? 'red.500' : 'gray.200'}
                className={errors.points ? 'hover:border-red-500' : ''}
                {...register('points', { required: true })}
              />
            </NumberInput>
          </FormControl>
        </Flex>
        <Flex
          mt={8}
          justifyContent="flex-end"
        >
          <Button
            variant="outline"
            mr={3}
            onClick={props.onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
          >
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
