import Habits from './habits';

export const habitsresolvers = {
  Query: {
    async habits() {
      try {
        const habits = await Habits.find();
        return habits;
      } catch (e) {
        console.error(e);
      }
    },
  },
};
