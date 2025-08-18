// // src/utils/generateToken.js
// const jwt = require('jsonwebtoken');

// const generateToken = (user) => {
//     return jwt.sign(
//         { userId: user.id, emailId: user.emailId }, // Payload
//         process.env.JWT_SECRET_KEY, // Your secret key from .env
//         { expiresIn: '1h' } // Token expires in 1 hour
//     );
// };

// module.exports = generateToken;
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Create the payload for the token. It must include the user's ID.
  const payload = {
    id: user.id,
    email: user.emailId
    // You can add other non-sensitive info here if you want
  };

  // Sign the token with your secret key and set an expiration time
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token will be valid for 1 day
  });
};

module.exports = generateToken;