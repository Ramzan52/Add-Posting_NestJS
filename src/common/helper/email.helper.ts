export async function createEmailBody(data: string, code: number) {
  const emailBody = {
    recipient: [data],
    subject: 'Verification Code for Scrap Ready Application',
    from: 'scrapreadyapp@gmail.com',
    body: `Your code is ${code}`,
  };
  return emailBody;
}

export function generateRandomSixDigitCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code;
}
