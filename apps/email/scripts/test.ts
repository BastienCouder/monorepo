import { initQueue, sendEmail } from '@repo/email';

async function run() {
  console.log('Trying to connect to RabbitMQ...');

  const channel = await initQueue(15);

  await sendEmail({
    email: 'test-user@example.com',
  });

  console.log('Test message sent');

  await channel.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Test failed:', err.message);
  process.exit(1);
});