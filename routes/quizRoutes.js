const express = require('express');
const {
  getQuizByCourse,
  submitQuiz,
  seedQuizzes
} = require('../controllers/quizController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/seed', protect, seedQuizzes);
router.get('/:courseId', protect, getQuizByCourse);
router.post('/:quizId/submit', protect, submitQuiz);

module.exports = router;
