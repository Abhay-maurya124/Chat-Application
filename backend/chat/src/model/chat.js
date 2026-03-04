import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    users:{
        type:String,
        require:true
    },
    latestMessage:{
        text:String,
        sender:String
    },
    
},{
    timestamps:true
})
module.exports = mongoose.model('chats',chatSchema)