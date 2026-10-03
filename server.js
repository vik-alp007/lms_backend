const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Route Imports
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const courseRoutes = require('./routes/courseRoutes.js');
const enrollmentRoutes = require('./routes/enrollmentRoutes.js');
const progressRoutes = require('./routes/progressRoutes.js');
const quizRoutes = require('./routes/quizRoutes.js');
const certificateRoutes = require('./routes/certificateRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const extraRoutes = require('./routes/extraRoutes.js');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', extraRoutes); // Search, Live Classes, Notifications

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LMS Backend Server is up and running smoothly!'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
