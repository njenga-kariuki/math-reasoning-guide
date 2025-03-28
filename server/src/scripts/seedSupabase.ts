/**
 * Script to seed Supabase with sample problems
 */
import * as dotenv from 'dotenv';
import supabase from '../config/supabase';
import sampleProblems from '../data/sampleProblems';

// Load environment variables
dotenv.config();

const seedSupabase = async () => {
  try {
    console.log('Connecting to Supabase...');
    
    // Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('problems')
      .select('count');
    
    if (testError) {
      throw new Error(`Supabase connection error: ${testError.message}`);
    }
    
    console.log('Connected to Supabase');
    
    // Clear existing problems
    const { error: deleteError } = await supabase
      .from('problems')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (deleteError) {
      throw new Error(`Error clearing problems: ${deleteError.message}`);
    }
    
    console.log('Cleared existing problems');
    
    // Insert sample problems
    const { data, error } = await supabase
      .from('problems')
      .insert(sampleProblems);
    
    if (error) {
      throw new Error(`Error inserting problems: ${error.message}`);
    }
    
    console.log(`Inserted ${sampleProblems.length} sample problems`);
    console.log('Database seeded successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedSupabase();
