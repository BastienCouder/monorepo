import { connect, type Channel, type Connection } from 'amqplib';

let channel: Channel;

export async function initQueue(retries = 10): Promise<Channel> {
  const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

  for (let i = 0; i < retries; i++) {
    try {
      const connection = await connect(url);
      channel = await connection.createChannel();
      console.log('✅ Connected to RabbitMQ');
      return channel;
    } catch (err) {
      console.warn(`❌ RabbitMQ not ready yet (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  throw new Error('❌ Failed to connect to RabbitMQ after retries');
}

export async function publishUserRegistered(data: { email: string }) {
  await channel.assertQueue('user.registered');
  channel.sendToQueue('user.registered', Buffer.from(JSON.stringify(data)));
}

export async function consumeUserRegistered(callback: (data: { email: string }) => void) {
  await channel.assertQueue('user.registered');
  channel.consume('user.registered', (msg) => {
    if (!msg) return;
    const data = JSON.parse(msg.content.toString());
    callback(data);
    channel.ack(msg);
  });
}

