import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSupabase } from './config/supabase';
import problemRoutes from './routes/problemRoutes';
import annotationRoutes from './routes/annotationRoutes';

// Load environment variables
dotenv.config();

// Connect to Supabase
(async () => {
  await initSupabase();
  console.log('Server ready to handle requests');
})();

// Initialize express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/problems', problemRoutes);
app.use('/api/annotations', annotationRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Math Annotation Tool API',
    version: '1.0.0'
  });
});

// Test route to check database connectivity
app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('problems').select('count');

    if (error) {
      console.error('Test endpoint - Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Database connection error', 
        details: error 
      });
    }

    // Get all problems to check if we have data
    const { data: problems, error: problemsError } = await supabase.from('problems').select('*');

    if (problemsError) {
      console.error('Test endpoint - Problems query error:', problemsError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error fetching problems', 
        details: problemsError 
      });
    }

    res.json({
      success: true,
      message: 'Database connection successful',
      problemCount: problems?.length || 0,
      problems: problems
    });
  } catch (error) {
    console.error('Test endpoint - Unexpected error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Unexpected error', 
      details: error 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../../dist')));

// API routes go here

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});