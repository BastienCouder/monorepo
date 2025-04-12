import { publishUserRegistered, initQueue } from '@repo/email';

(async () => {
  await initQueue();
  await publishUserRegistered({ email: 'down@test.com' });
  console.log('📤 Message published!');
})();