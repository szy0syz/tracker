import { Form, Field } from '@leveluptuts/fresh';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const ADD_HABIT = gql`
  mutation addHabit($habit: HabitInput) {
    addHabit(habit: $habit) {
      _id
      name
    }
  }
`;

const HabitForm = () => {
  const [addHabit] = useMutation(ADD_HABIT, {
    //* 注意：这里只能拿到前端的 Query，别去后端找！
    refetchQueries: ['getHabits'],
  });

  return (
    <Form
      onSubmit={data => {
        addHabit({
          variables: {
            habit: {
              name: data.habit,
            },
          },
        });
      }}
    >
      <Field>Habit</Field>
    </Form>
  );
};

export default HabitForm;
