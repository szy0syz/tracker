// Database collection
import mongoose, { Schema } from 'mongoose';

export const HabitsSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

export default mongoose.models.habits || mongoose.model('habits', HabitsSchema);
