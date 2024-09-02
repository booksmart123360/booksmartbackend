function generateOTP() {
    // Implement your preferred OTP generation logic (e.g., random numbers)
    return Math.floor(Math.random() * 100000).toString().padStart(6, '0');
  }
  
  module.exports = { generateOTP };