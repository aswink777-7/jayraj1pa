const mongoose = require('mongoose')

const ReportingSchemas = new mongoose.Schema({
    reportingImage:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true,
    },
    type:{
        type: String,
        required: true,
    },
    status:{
        type:String,
        enum : ["Cleared","Not Cleared","Pending"],
        default: "Pending"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }
})


const Reports = mongoose.model("Reports",ReportingSchemas)
module.exports = Reports

