/**
 * Email dispatcher utility for password resets and verification
 * In development, provides formatted simulation output and token payload.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  console.log(`\n================== [OUTGOING EMAIL NOTIFICATION] ==================`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message Preview:\n${text || html}`);
  console.log(`===================================================================\n`);

  return {
    success: true,
    messageId: `msg_${Date.now()}`,
  };
};
