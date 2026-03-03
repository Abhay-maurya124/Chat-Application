import { redisClient } from "../index.js";
import { publishToQueue } from "../config/rabbitmq.js";
import tryCatch from "../config/tryCatch.js";


export const login = tryCatch(async(req,res)=>{
    const {email} = req.body
    const rateLimitkey  = `OTP:ratelimit:${email}`
    const ratelimit = await redisClient.get(rateLimitkey)
    if(ratelimit){
        res.status(429).json({
            message:"Too many requests.Plase wait before requesting new OTP"
        })
        return;
    }
    const Otp = Math.floor(100000+Math.random() * 900000).toString()
    const otpkey = `OTP :${email}`
    await redisClient.set(otpkey,Otp,{
        EX:300
    })
    await redisClient.set(rateLimitkey,"true",{
        EX:60,
    })
    const massege = {
        to:email,
        subject:'your OTP code',
        body:`your OTP is ${Otp}.it is valid for 5 minutes`
    }   

    await publishToQueue('send-otp',massege)
    res.status(200).json({
        message:'Otp sent to your mail'
    })
})

export const verifyemail = tryCatch(async())