const User = require('../Models/userSchema')

async function isAdmin(req, res, next) {
  // get the user id from the JWT payload
  const userId = req.payload;

  // get the user from the database
  const user = await User.findById(userId);

  // check if user is an admin
  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).send('Only admins can access this route');
  }
}

module.exports = isAdmin;
