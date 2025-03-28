import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key length:', supabaseKey?.length || 0);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Supabase database
const initSupabase = async () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or key is missing. Please check your environment variables.');
    return false;
  }

  try {
    // Test the connection
    const { data, error } = await supabase.from('problems').select('count');
    
    if (error) {
      throw error;
    }
    
    console.log('Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

export { supabase, initSupabase };
export default supabase;
