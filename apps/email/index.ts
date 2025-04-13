import { initQueue, consumeEmail } from '@repo/email';
import { sendMail } from './sendMail';
import { sendEmailTemplate } from '@repo/email/templates/send-email';

(async () => {
  await initQueue();

  await consumeEmail(async ({ email }) => {
    const { subject, html } = sendEmailTemplate(email);
    await sendMail(email, subject, html);
  });

  console.log('Email worker listening on RabbitMQ...');
})();
