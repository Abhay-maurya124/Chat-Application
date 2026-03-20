import amqp from 'amqplib'; 

let channel;

export const connectRabbitmq = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqps",
            hostname: process.env.RABBITMQ_HOST,
            port: 5671,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD,
            vhost: process.env.RABBITMQ_USERNAME,
        });
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ ✅");
    } catch (error) {
        console.log("Error in RabbitMQ connection:", error);
    }
}

export const publishToQueue = async (queueName, message) => {
    if (!channel) {
        console.log("RabbitMQ channel is not initialized");
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
}