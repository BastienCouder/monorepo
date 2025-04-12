import { initQueue, consumeUserRegistered } from '@repo/email';
import { sendMail } from './sendMail';
import { registerEmailTemplate } from '@repo/email/templates/register-email';

(async () => {
  await initQueue();

  await consumeUserRegistered(async ({ email }) => {
    const { subject, html } = registerEmailTemplate(email);
    await sendMail(email, subject, html);
  });

  console.log('✅ Email worker listening on RabbitMQ...');
})();
