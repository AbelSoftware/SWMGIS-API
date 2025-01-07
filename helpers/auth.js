const jwt = require('jsonwebtoken');
const { executeQuery } = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')
const userAuth = async (req, res, next) => {
    // if (!req.cookies) {
    //     throw new Error('Unauthorised User')
    // }
    try {
        const { token } = req.cookies;
        const decodeToken = await jwt.verify(token, 'ABEL@2024');
        const { id } = decodeToken;
        let checkuser = `EXEC spUser_IsAuthenticatedUser @UserId = '${id}'`
        checkuser = await executeQuery(checkuser)
        if (!checkuser[0]) {
            throw new Error('Unauthorised User')
            // res.status(401).send(error)
        }
        next();
    } catch (err) {
        // res.status(401).send(err.message)
        return sendError(res, 'Unauthorised User', 401)
    }

}
const validateToken = async (req, res, next) => {
    try {
   
  
      // Get Authorization header
      const authHeader = req.headers['authorization'];
  
      // Check if Authorization header exists
      if (!authHeader) {
        return sendError(res, 'Authorization header missing', 401);
      }
  
      // Extract token (assuming format: "Bearer <token>")
      const token = authHeader.split(' ')[1];
      if (!token) {
        return sendError(res, 'Token missing in Authorization header', 401);
      }
  
      // Verify token using a promise-based approach
      const user = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err); // Reject the promise if token verification fails
          }
          resolve(decoded); // Resolve the promise with the decoded user
        });
      });
  
      const { id } = user; // Extract user ID from the token payload
      //console.log('User ID from token:', id);
  
      // Check if the user is authenticated in the database
      let checkuserQuery = `EXEC spUser_IsAuthenticatedUser @UserId = '${id}'`;
      const checkuser = await executeQuery(checkuserQuery);
  
      //console.log('User Authentication Check:', checkuser);
  
      // If the user is not found in the database
      if (!checkuser[0]) {
        return sendError(res, 'Unauthorised User', 403);
      }
  
      // Attach user info to the request object (optional)
      req.user = user;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
     // console.error('Error in validateToken:', error.message);
     return sendError(res, 'Invalid or expired token', 403);
     // return res.status(403).json({ error: 'Invalid or expired token' });
    }
  };
  

module.exports = {
    userAuth, validateToken
}