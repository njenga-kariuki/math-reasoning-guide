import mongoose from 'mongoose';

// Define the schema for math problems
const ProblemSchema = new mongoose.Schema({
  problem_id: {
    type: String,
    required: true,
    unique: true
  },
  problem_category: {
    type: String,
    required: true,
    enum: ['Algebra', 'Calculus', 'Geometry', 'Probability', 'Statistics', 'Number Theory', 'Combinatorics', 'Other']
  },
  difficulty_level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  problem_text: {
    type: String,
    required: true
  },
  // Flag to track if the problem has been used in annotation
  is_annotated: {
    type: Boolean,
    default: false
  },
  // Flag to track if the problem has been discarded
  is_discarded: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
const Problem = mongoose.model('Problem', ProblemSchema);

export default Problem;
