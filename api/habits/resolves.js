export const habitsresolvers = {
  Query: {
    async habits() {
      console.log('habits');
      return [
        {
          _id: 'fake1',
          name: 'data data data 111',
        },
      ];
    },
  },
};
