import { sendEmail, initQueue } from "@repo/email";

(async () => {
  await initQueue();
  await sendEmail({ email: "down@test.com" });
  console.log("Message published!");
})();
