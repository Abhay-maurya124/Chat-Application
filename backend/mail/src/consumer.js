import amqp from "amqplib";
import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

export const StartSendTopConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqps",
            hostname: process.env.RABBITMQ_HOST,
            port: 5671,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD,
            vhost: process.env.RABBITMQ_USERNAME,
        });
        const channel = await connection.createChannel();
        const queuename = "send-otp";
        await channel.assertQueue(queuename, { durable: true });

        console.log("Mail service listening for OTP emails...");

        channel.consume(queuename, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASS,
                        },
                    });

                    await transporter.sendMail({
                        from: process.env.USER,
                        to: to,
                        subject: subject || "Your OTP Code",
                        text: body,
                    });

                    console.log(`OTP sent to ${to} ✅`);
                    channel.ack(msg);
                } catch (error) {
                    console.log("Failed to send email:", error);
                }
            }
        });
    } catch (error) {
        console.log("Unable to connect with Rabbitmq", error);
    }
};