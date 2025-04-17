import { connect, type Channel, type Connection } from "amqplib";

let channel: Channel;

export async function initQueue(retries = 10): Promise<Channel> {
  const url = process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";

  for (let i = 0; i < retries; i++) {
    try {
      const connection = await connect(url);
      channel = await connection.createChannel();
      console.log("Connected to RabbitMQ");
      return channel;
    } catch (err) {
      console.warn(`RabbitMQ not ready yet (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  throw new Error("Failed to connect to RabbitMQ after retries");
}

export async function sendEmail(data: { email: string }) {
  await channel.assertQueue("email.send");
  channel.sendToQueue("email.send", Buffer.from(JSON.stringify(data)));
}

export async function consumeEmail(
  callback: (data: { email: string }) => void,
) {
  await channel.assertQueue("email.send");
  channel.consume("email.send", (msg) => {
    if (!msg) return;
    const data = JSON.parse(msg.content.toString());
    callback(data);
    channel.ack(msg);
  });
}
