const axios = require('axios');
const QuizAttempt = require('../models/QuizAttempt.js');
const LearningActivity = require('../models/LearningActivity.js');
const Course = require('../models/Course.js');

// Hosted FastAPI ML Endpoint URL
const ML_API_URL = 'https://learning-management-system-1ej4.onrender.com/recommend/';

const getMLRecommendations = async (userId, currentCourseTitle, customMetrics = {}) => {
  try {
    let currentCourse = currentCourseTitle || customMetrics.current_course || 'HTML & CSS';

    // 1. Fetch Assessment Attempts
    const allAttempts = await QuizAttempt.find({ user: userId });
    const assessment_count = customMetrics.assessment_count !== undefined 
      ? Number(customMetrics.assessment_count) 
      : allAttempts.length;

    // 2. Calculate Mean Score
    let mean_score = 0.0;
    if (allAttempts.length > 0) {
      const sumScores = allAttempts.reduce((acc, curr) => acc + curr.percentage, 0);
      mean_score = parseFloat((sumScores / allAttempts.length).toFixed(1));
    }
    if (customMetrics.mean_score !== undefined) {
      mean_score = Number(customMetrics.mean_score);
    }

    // 3. Calculate Specific Course Score
    let course_score = mean_score;
    const courseDoc = await Course.findOne({ title: currentCourse });

    if (courseDoc) {
      const courseAttempts = await QuizAttempt.find({ user: userId, course: courseDoc._id });
      if (courseAttempts.length > 0) {
        const courseSum = courseAttempts.reduce((acc, curr) => acc + curr.percentage, 0);
        course_score = parseFloat((courseSum / courseAttempts.length).toFixed(1));
      }
    }
    if (customMetrics.course_score !== undefined) {
      course_score = Number(customMetrics.course_score);
    }

    // 4. Calculate Total Clicks
    let total_clicks = customMetrics.total_clicks !== undefined 
      ? Number(customMetrics.total_clicks) 
      : await LearningActivity.countDocuments({ user: userId, action: 'click' });

    // 5. Calculate Active Days
    let active_days = customMetrics.active_days !== undefined ? Number(customMetrics.active_days) : 0;
    if (customMetrics.active_days === undefined) {
      const activities = await LearningActivity.find({ user: userId }).select('createdAt');
      const distinctDates = new Set(
        activities.map((a) => a.createdAt.toISOString().split('T')[0])
      );
      active_days = distinctDates.size || 1;
    }

    // 6. Calculate Learning Resources
    let learning_resources = customMetrics.learning_resources !== undefined ? Number(customMetrics.learning_resources) : 0;
    if (customMetrics.learning_resources === undefined) {
      const distinctResources = await LearningActivity.distinct('resourceId', {
        user: userId,
        resourceId: { $ne: null }
      });
      learning_resources = distinctResources.length || 1;
    }

    // Construct ML Request Payload
    const mlPayload = {
      current_course: String(currentCourse),
      mean_score: Number(mean_score),
      assessment_count: Number(assessment_count),
      course_score: Number(course_score),
      total_clicks: Number(total_clicks),
      active_days: Number(active_days),
      learning_resources: Number(learning_resources)
    };

    console.log('Sending Payload to Deployed ML API:', mlPayload);

    // Call Hosted FastAPI Service
    const response = await axios.post(ML_API_URL, mlPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('ML Service Error:', error.response ? error.response.data : error.message);
    
    // Fallback response if ML endpoint is unreachable/times out
    return {
      recommendations: [
        { course: 'JSS', probability: 0.85 },
        { course: 'React JS', probability: 0.65 }
      ],
      note: 'Fallback static recommendations applied due to ML service connectivity'
    };
  }
};

module.exports = { getMLRecommendations };
