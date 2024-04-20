const mongoose = require('mongoose')

const CommunitySchemas = new mongoose.Schema({
    communityImage:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true,
    },
    Desc:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        enum: ["join", "left"],
        default: "", // or default: ""
    },
    
    eDate: {
        type: String,
        required: true,
    },
    
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }
})


const Community = mongoose.model("Community",CommunitySchemas)
module.exports = Community

