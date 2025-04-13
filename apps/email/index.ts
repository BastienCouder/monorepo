import { initQueue, consumeEmail } from '@repo/email';
import { sendMail } from './sendMail';
import { registerEmailTemplate } from '@repo/email/templates/register-email';

(async () => {
  await initQueue();

  await consumeEmail(async ({ email }) => {
    const { subject, html } = registerEmailTemplate(email);
    await sendMail(email, subject, html);
  });

  console.log('Email worker listening on RabbitMQ...');
})();
