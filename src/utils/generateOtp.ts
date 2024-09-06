export const generateOtp = async (length: number = 6) => {
    const digits = '0123456789';
    let otp = ' ';
    for (let i = length; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)]
    }
    return otp;
}