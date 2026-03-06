import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    users:[{
        type:String,
        required:true
    }],
    latestMessage:{
        text:String,
        sender:String
    },
    
},{
    timestamps:true
})
export const Chat = mongoose.model('chats',chatSchema)