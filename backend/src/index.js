const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Allow ALL origins (temporary fix for development)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Manager API is running 🚀',
    status: 'success'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for all origins`);
});