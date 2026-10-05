const { getMLRecommendations } = require('../services/mlService.js');

// @desc    Get course recommendations from ML API (Proxy)
// @route   POST /recommend
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { current_course } = req.body; // Optional current course title

    // Pass req.body as 3rd argument (customMetrics) so custom frontend payloads are respected
    const recommendationsData = await getMLRecommendations(userId, current_course, req.body);

    res.status(200).json({
      success: true,
      message: 'Recommendations fetched successfully',
      data: recommendationsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getRecommendations };
