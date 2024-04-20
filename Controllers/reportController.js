const reports = require("../Models/ReportingSchema")
const users = require('../Models/userSchema')

// waste Reporting
exports.wasteReports = async (req, res) => {
    console.log("inside Waste Reporting Function");
    const userId = req.payload;
    const reportingImage = req.file.filename;
    const { location, type } = req.body;
  
    try {
      const existingReport = await reports.findOne({ location, type, userId });
      if (existingReport) {
        res.status(200).json("Request already exists");
      } else {
        const newReport = new reports({
          reportingImage,
          location,
          type,
          userId,
        });
  
        await newReport.save();
        console.log('Report saved');
  
        // Find the user and increment their coins
        const user = await users.findById(userId);
        user.coins += 1;
        console.log('Coins incremented:', user.coins);
  
        await user.save();
        console.log('User saved');
  
        res.status(200).json(newReport);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(401).json(`Request Failed Error: ${error}`);
    }
  };
  


exports.allUserReports = async (req,res)=>{
    const userId = req.payload
    try {
        const userReports = await reports.find({userId})
        res.status(200).json(userReports) 
    } catch (error) {
        res.status(401).json(error)
    }
}



// delete Report
exports.deleteReport = async(req, res) => {
    console.log("deleteReport");
    const reportId = req.params.reportId;
    try {
        const deleteReport = await reports.findByIdAndDelete(reportId);
        res.status(200).json(deleteReport);
    } catch (error) {
        res.status(401).json(error);
    }
};

// /edit Report
exports.editReport = async(req,res)=>{
  const {id} = req.params
  const userId = req.payload
  const { location,type,reportingImage,status} = req.body
  const uploadReportImage =  req.file?req.file.filename:reportingImage


  try {
    const updateReport = await reports.findByIdAndUpdate({_id:id},{
      reportingImage:uploadReportImage,type,location,status,userId
    },{new:true})
    await updateReport.save()
    res.status(200).json(updateReport)
  } catch (error) {
    res.status(401).json(error)
  }

}