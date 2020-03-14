import { Form, Field } from '@leveluptuts/fresh';

const HabitForm = ({ setHabits }) => {
  return (
    <Form
      onSubmit={data => {
        console.log(data);
        setHabits(preState => [...preState, data.habit]);
      }}
    >
      <Field>Habit</Field>
    </Form>
  );
};
export default HabitForm;
