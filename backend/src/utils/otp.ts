export const generateOTP = (length: number = 6, expiration: number = 900000) => {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP = OTP + digits[Math.floor(Math.random() * 10)];
  }
  const expirationTime = new Date();
  expirationTime.setTime(expirationTime.getTime() + expiration);
  return { OTP, expirationTime };
};

export const verifyOTP = (otp: string, generatedOTP: string, expirationTime: Date) => {
  if (new Date() >= expirationTime) {
    return false;
  }
  return otp === generatedOTP;
};
