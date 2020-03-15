import Habits from './habits';

export const habitsMutations = {
  Mutation: {
    async addHabit(_, { habit }) {
      try {
        const newHabit = await Habits.create({ ...habit });
        return newHabit;
      } catch (e) {
        console.error(e);
      }
    },

    async addEvent(_, { habitId, eventId }) {
      console.log('add event');
    },

    async removeEvent(_, { habitId, eventId }) {
      console.log('revemo event');
    },
  },
};
