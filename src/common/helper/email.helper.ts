export function createEmailBody(data: string, code: number) {
  return {
    recipient: [data],
    subject: 'Verification Code for Scrap Ready Application',
    from: 'scrapreadyapp@gmail.com',
    body: `Your code is ${code}`,
  };
}

export function generateRandomSixDigitCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code;
}
