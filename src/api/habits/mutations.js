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

    async addEvent(_, { habitId, date }) {
      try {
        date.setHours(0, 0, 0, 0);
        //* $ne 业务上怎么理解呢？
        //* 只有在events集合里不存在这个日期的任务时才能添加！
        const habit = await Habits.findOneAndUpdate(
          {
            _id: habitId,
            'events.date': {
              $ne: date,
            },
          },
          {
            $addToSet: {
              events: {
                date,
              },
            },
          }
        );
        return habit;
      } catch (e) {
        console.error(e);
      }
    },

    async removeEvent(_, { habitId, eventId }) {
      try {
        const habit = await Habits.findOneAndUpdate(
          {
            _id: habitId,
          },
          {
            $pull: {
              // 从数组中弹出
              events: {
                _id: eventId,
              },
            },
          }
        );
        return habit;
      } catch (e) {
        console.error(e);
      }
    },
  },
};
