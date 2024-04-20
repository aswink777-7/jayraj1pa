const User = require('../Models/userSchema');
const Schedules =  require("../Models/SchedulingSchema")
const ReportingModel = require('../Models/ReportingSchema')
const Community = require('../Models/CommunitySchema')
const Product = require("../Models/ProductsSchema")
const Order = require("../Models/OrderSchema")

exports.viewAllUsersWithStats = async (req, res) => {
  try {
    const usersWithStats = await User.aggregate([
      {
        $lookup: {
          from: 'schedules',
          localField: '_id',
          foreignField: 'userId',
          as: 'schedules',
        }
      },
      {
        $lookup: {
          from: 'reports',
          localField: '_id',
          foreignField: 'userId',
          as: 'reports',
        }
      },
      {
        $lookup: {
          from: 'communities',
          localField: '_id',
          foreignField: 'userId',
          as: 'joinedCommunities',
        }
      },
      {
        $lookup: {
          from: 'feedbacks', // assuming 'feedbacks' is the name of your feedback collection
          localField: '_id',
          foreignField: 'user',
          as: 'feedbacks',
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          isAdmin: 1,
          profileImage: 1,
          address: 1,
          coins: 1,
          schedulesCount: { $size: '$schedules' },
          reportsCount: { $size: '$reports' },
          joinedCommunitiesCount: { $size: '$joinedCommunities' },
          feedbacks: '$feedbacks.message',        },
      },
    ]);

    console.log('Users with stats after $lookup:', usersWithStats);
    res.status(200).json(usersWithStats);
  } catch (error) {
    console.error('Error fetching users with stats:', error);
    res.status(500).json('Internal Server Error');
  }
};





exports.viewAllReports = async (req, res) => {
  try {
    const reports = await ReportingModel.find().populate('userId');
    res.send(reports);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};



exports.viewAllSchedulings = async (req,res)=>{
  try {
    const sch  = await Schedules.find().populate('userId')
    res.status(200).json(sch)
  } catch (error) {
    console.log("Error Fetching Result ",error);
    res.status(500).json("internal server error")
  }
}



exports.addCommunity = async (req, res) => {
  const userId = req.payload;
  const communityImage = req.file.filename;
  const { title,eDate,Desc} = req.body;

  try {
    const existingCommunity = await Community.findOne({ title });

    if (existingCommunity) {
      // If community with the same title exists
      return res.status(200).json({ message: "Community already exists" });
    } else {
      // If community with the title doesn't exist, create a new one
      console.log("hii");
      const newCommunity = new Community({
        communityImage,
        title,
        userId,
        eDate,
        Desc,
        status: null, // or status: ""
    });
    // community.users.push(user._id);

    
    await newCommunity.save();
    
      return res.status(200).json(newCommunity);
    }
  } catch (error) {
    return res.status(401).json({ message: `Request Failed. Error: ${error}` });
  }
};


exports.viewCommunity = async (req,res)=>{
  try {
    const community = await Community.find()
    res.status(200).json(community)
  } catch (error) {
    res.status(500).json("internel server Error",error)
  }
}



// communityController.js





// addProducts
exports.addProduct = async (req, res) => {
  console.log("admin shopping");
  const userId = req.payload;
  const productImage = req.file.filename;
  const { productPrice,productName, productDesc} = req.body;

  try {
    const existingProduct = await Product.findOne({ productName });

    if (existingProduct) {
      return res.status(200).json({ message: "Product already exists" });
    } else {
      const newProduct = new Product({
        productPrice,
        productName,
        productImage,
        productDesc,
        userId
      });

      await newProduct.save();
      return res.status(200).json(newProduct);
    }
  } catch (error) {
    return res.status(500).json({ message: `Request Failed. Error: ${error}` });
  }
};



exports.viewProducts = async (req,res)=>{
  try {
    const community = await Product.find()
    res.status(200).json(community)
  } catch (error) {
    res.status(500).json("internel server Error",error)
  }
}


// delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) return res.status(404).send('User not found');
    res.status(200).send('User deleted successfully');
  } catch (e) {
    res.status(500).send('Server error');
  }
};


exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    } else {
      return res.status(200).send('Logged out successfully.');
    }
  });
};


// updateReport status
exports.updateReportStatus = async (req, res) => {
  const { reportId, status } = req.body;

  try {
    const updatedReport = await ReportingModel.findByIdAndUpdate(
      reportId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// updateSchedule status
exports.updateSheduleStatus = async (req, res) => {
  const { scheduleId, status } = req.body;

  try {
    const updatedSchedule = await Schedules.findByIdAndUpdate(
      scheduleId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.blockUser = async (req, res) => {
  const { userId } = req.params;
  const { adminId } = req.payload; // Assuming you have admin information in the request payload

  try {
    // Find the admin user
    const admin = await User.findById(adminId);

    // Check if the admin has the authority to block users (add your authorization logic here)

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user is already blocked
    if (user.isBlocked) {
      return res.status(400).json({ message: 'User is already blocked.' });
    }

    // Set the block status and blockedBy field
    user.isBlocked = true;
    user.blockedBy = adminId;
    user.blockedUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days

    // Save the user
    await user.save();
    console.log('User object:', user);


    res.status(200).json({ message: 'User blocked successfully.' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.unblockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user is already unblocked
    if (!user.isBlocked) {
      return res.status(400).json({ message: 'User is not blocked.' });
    }

    // Set the isBlocked status to false
    user.isBlocked = false;
    user.blockedUntil = null; // Reset the blockedUntil field

    // Save the user
    await user.save();

    res.status(200).json({ message: 'User unblocked successfully.' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.deleteProduct = async(req, res) => {
  console.log("deleteProduct");
  const scheduleId = req.params.scheduleId;
  console.log(scheduleId);
  try {
      const ScheduleReport = await Product.findByIdAndDelete(scheduleId);
      res.status(200).json(ScheduleReport);
  } catch (error) {
      res.status(401).json(error);
  }
};


exports.deleteCommunity = async(req, res) => {
  console.log("deleteCommunity");
  const scheduleId = req.params.scheduleId;
  console.log(scheduleId);
  try {
      const ScheduleReport = await Community.findByIdAndDelete(scheduleId);
      res.status(200).json(ScheduleReport);
  } catch (error) {
      res.status(401).json(error);
  }
};





exports.checkout = async (req, res) => {
  const {  items } = req.body;
  const userId  = req.payload
  console.log("cart",userId);
  
  // Fetch the user's details
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // Create a new order
  const newOrder = new Order({
    userId,
    userName: user.username,
    userAddress: user.address,
    items
  });

  await newOrder.save();

  res.status(200).json({
    order: newOrder,
    userName: user.username,
    userAddress: user.address
  });};





exports.viewCheckout = async (req,res)=>{
  try {
    const checkout = await Order.find()
  res.status(200).json(checkout)

  } catch (error) {
    res.status(500).json("internel server Error",error)
  }
  
}



