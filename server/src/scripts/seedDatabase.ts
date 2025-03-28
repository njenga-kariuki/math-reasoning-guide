/**
 * Script to seed the database with sample problems
 */
import dotenv from 'dotenv';
import { Problem } from '../config/inMemoryDb.js';
import sampleProblems from '../data/sampleProblems.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Using in-memory database');

    // Clear existing problems
    await Problem.deleteMany();
    console.log('Cleared existing problems');

    // Insert sample problems
    await Problem.insertMany(sampleProblems);
    console.log(`Inserted ${sampleProblems.length} sample problems`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
