const Feedback = require('../Models/FeedbackSchema')



exports.submitFeedback = async (req, res) => {
  try {
    const userId = req.payload;
    const { message } = req.body;

    // Create a new Feedback instance with userId and message
    const newFeedback = new Feedback({ user: userId, message });

    // Save the feedback to the database
    const savedFeedback = await newFeedback.save();

    res.json(savedFeedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// .admin
exports.getAllFeedback = async (req, res) => {
    try {
      const allFeedback = await Feedback.find();
      res.json(allFeedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };