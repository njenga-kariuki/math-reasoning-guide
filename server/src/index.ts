import express, { Request, Response } from 'express';
import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import { initSupabase, supabase } from './config/supabase';
import problemRoutes from './routes/problemRoutes';
import annotationRoutes from './routes/annotationRoutes';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenvConfig();

// Connect to Supabase
(async () => {
  await initSupabase();
  console.log('Server ready to handle requests');
})();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://math-annotation-tool.repl.co'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/problems', problemRoutes);
app.use('/api/annotations', annotationRoutes);

// Test route to check database connectivity
app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('problems').select('count').single();

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

// Debug endpoint to help diagnose path issues
app.get('/api/debug', (req, res) => {
  const possiblePaths = [
    path.resolve(__dirname, '../../../dist'),
    path.resolve(__dirname, '../../dist'),
    path.resolve(__dirname, '../dist'),
    path.resolve(__dirname, './dist'),
    path.resolve(process.cwd(), 'dist')
  ];

  const results = possiblePaths.map(p => ({
    path: p,
    exists: fs.existsSync(p),
    isDirectory: fs.existsSync(p) ? fs.lstatSync(p).isDirectory() : false,
    contents: fs.existsSync(p) && fs.lstatSync(p).isDirectory() ? fs.readdirSync(p) : []
  }));

  res.json({
    currentDir: __dirname,
    processCwd: process.cwd(),
    possiblePaths: results
  });
});

// Try multiple possible paths for the frontend build
const possibleBuildPaths = [
  path.resolve(__dirname, '../../../dist'), // If server is in /server/dist/
  path.resolve(__dirname, '../../dist'),    // If server is in /server/
  path.resolve(process.cwd(), 'dist')       // From current working directory
];

let buildPath = '';
for (const p of possibleBuildPaths) {
  if (fs.existsSync(p) && fs.lstatSync(p).isDirectory()) {
    buildPath = p;
    break;
  }
}

if (buildPath) {
  console.log('Found frontend build at:', buildPath);
  // Serve static files from the React app build directory
  app.use(express.static(buildPath));

  // For any other request, send the React app's index.html
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        success: false,
        error: 'API endpoint not found'
      });
    }
    
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    } else {
      return res.status(404).send('Frontend build not found. Please make sure the frontend has been built.');
    }
  });
} else {
  console.warn('Frontend build directory not found! Serving API only.');
  // Fallback for the root route if no frontend is found
  app.get('/', (req, res) => {
    res.json({
      message: 'Math Annotation Tool API (Frontend not found)',
      version: '1.0.0',
      note: 'The frontend build was not found. Please make sure it is built and properly located.'
    });
  });
}

// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;