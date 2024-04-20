const mongoose = require('mongoose')

const SchedulingSchemas = new mongoose.Schema({
    houseNumber:{
        type:String,
        required:true
    },
    wasteQuantity:{
        type:String,
        required:true
    },
    edate:{
        type:String,
        required:true
    },
    etime:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum : ["Cleared","Not Cleared","Pending"],
        default: "Pending"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    }
})

const Schedules = mongoose.model("Schedules",SchedulingSchemas)
module.exports = Schedules