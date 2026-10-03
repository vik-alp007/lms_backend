// @desc    Get logged in user profile
// @route   GET /api/users/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getProfile };
