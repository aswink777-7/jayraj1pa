const scheduling = require("../Models/SchedulingSchema")

// waste Scheduling
exports.wasteScheduling = async (req,res)=>{
    console.log("inside waste scheduling function");
    const userId = req.payload
    const {houseNumber,wasteQuantity,edate,etime} = req.body
    // console.log(`${houseNumber},${wasteQuantity},${edate},${etime}`);
    // console.log(`${userId}`);


    try {
        const existingScheduling = await scheduling.findOne({edate,etime})
        if(existingScheduling){
            res.status(406).json("Scheduling Request Already Exist ")
        }else{
            const newScheduling = new scheduling({
                houseNumber,wasteQuantity,edate,etime,userId
            })
            await newScheduling.save()
            res.status(200).json(newScheduling)
        }
    } catch (error) {
        res.status(401).json(`Request Failed Error ${error}`)
    }
}

exports.allUserSchedulings = async  (req,res)=>{
    const userId = req.payload
    try {
        const userSchedulings = await scheduling.find({userId})
        res.status(200).json(userSchedulings)
    } catch (error) {
        res.status(401).json(error)
    }

}

// delete
exports.deleteSchedule = async(req, res) => {
    console.log("deleteSchedule");
    const scheduleId = req.params.scheduleId;
    console.log(scheduleId);
    try {
        const ScheduleReport = await scheduling.findByIdAndDelete(scheduleId);
        res.status(200).json(ScheduleReport);
    } catch (error) {
        res.status(401).json(error);
    }
};


// edit Scheduling
exports.editScheduling = async(req,res)=>{
    const {id} = req.params
    const userId =  req.payload
    const {houseNumber,wasteQuantity,edate,etime,status} = req.body

    try {
        const updateSchedule = await scheduling.findByIdAndUpdate({_id:id},{
            houseNumber,wasteQuantity,edate,etime,status,userId
        },{new:true})
        await updateSchedule.save()
        res.status(200).json(updateSchedule)
    } catch (error) {
        res.status(401).json(error)
    }
}
