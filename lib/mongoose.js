import mongoose from 'mongoose';

const connnectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return handler(req, res);
};

const db = mongoose.connection;
db.once('open', () => {
  console.info('[ info ]', 'Connected to mongo');
});

export default connnectDB;
