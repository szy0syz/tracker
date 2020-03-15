import Habit from './Habit';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_HABITS = gql`
  query getHabits {
    habits {
      _id
      name
    }
  }
`;

const HabitList = () => {
  const { data, loading } = useQuery(GET_HABITS);
  if (loading) return <section />;

  const { habits } = data;

  return (
    <section>
      <h2>My Habit</h2>
      {habits.map((habit, index) => (
        <Habit key={habit._id} habit={habit} index={index} />
      ))}
    </section>
  );
};

export default HabitList;
