const Community = require('../Models/CommunitySchema');
const users = require(`../Models/userSchema`);
const jwt = require('jsonwebtoken')



// register
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    
  try {  
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(406).json("Account already exist");
    } else {
      const newUser = new users({
        username,
        email,
        password,
      });
      await newUser.save()
      res.status(200).json(newUser)
    }
  } catch(err) {
    res.status(401).json({ error: `Register Api Failed: ${err.message}` });
  }
}



// login
exports.login = async (req, res) => {
  console.log("inside login function");
  const { email, password } = req.body;

  try {
    const existingUser = await users.findOne({ email, password });

    if (existingUser) {
      // Check if the user is blocked
      if (existingUser.isBlocked) {
        return res.status(401).json("Your account is blocked.");
      }

      // Generate JWT token with user information
      const token = jwt.sign({
        userid: existingUser._id,
        isBlocked: existingUser.isBlocked, // Include the isBlocked status in the token
      }, "superkey");
      console.log(token);
      

      // Send user information and token to the client
      res.status(200).json({
        existingUser,
        token
      });
    } else {
      res.status(404).json("Incorrect Email and password");
    }
  } catch (error) {
    res.status(401).json(`Login API failed, Error: ${error}`);
  }
};



// registerAdmin
exports.registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {  
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(406).json("Account already exist");
    } else {
      const newUser = new users({
        username,
        email,
        password,
        isAdmin: true,  // set isAdmin to true for admin user
      });
      await newUser.save()
      res.status(200).json(newUser)
    }
  } catch(err) {
    res.status(401).json({ error: `Register Admin Api Failed: ${err.message}` });
  }
}

exports.editUser  = async(req,res)=>{

   const userId = req.payload
   console.log("hii");
   const {username,email,password,address} = req.body
   try{
          const updateUser = await users.findByIdAndUpdate({_id:userId},{
              username,email,password,address
           },{new:true})
           await updateUser.save()
          res.status(200).json(updateUser)
   }catch(err){
           res.status(401).json(err)
   }
}

exports.deleteAccount = async (req, res) => {
  try {
      await users.findByIdAndDelete(req.payload);
      res.status(200).send();
  } catch (err) {
      console.log(err);
      res.status(500).send();
  }
};



// / pdateSchedule status
exports.updateCommunityStatus = async (req, res) => {
  const { id, status } = req.body;

  try {
    const updatedSchedule = await Community.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error('Error updating Community status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getCoinsForUser = async (req, res) => {
  try {
    const userId = req.payload; // Assuming userId is in the request parameters

    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const coinsData = { coins: user.coins };
    res.status(200).json(coinsData);
    console.log('UserId:', userId);
console.log('User:', user);

  } catch (error) {
    res.status(500).json({ message: 'Error', error });
  }
};







