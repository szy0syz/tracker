// Database collection
import mongoose, { Schema } from 'mongoose';

export const EventSchema= new Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  }
})

export const HabitsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  events: [EventSchema]
});

export default mongoose.models.habits || mongoose.model('habits', HabitsSchema);
