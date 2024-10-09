const jwt=require('jsonwebtoken');
const { Error } = require('mongoose');
const createError = require('http-errors');

module.exports={
    signAccessToken: (userid) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret=process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn:'15s',
                issuer:'localhost',
                audience:userid
             };

             jwt.sign(payload, secret, options, (err,token) => {
                 if(err) reject(err)
                 resolve(token)
             })
        })
    },
    signRefreshToken: (userid) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret=process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn:'1y',
                issuer:'localhost',
                audience:userid
             };

             jwt.sign(payload, secret, options, (err,token) => {
                 if(err) reject(createError.InternalServerError())
                 resolve(token)
             })
        })
    },
    verifyAccessToken: (req, res, next) => {        
        if(!req.headers['authorization']) return next( new Error('unouthorized'));
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
         const errMsg = err.name==='JsonWebTokenError'? "Unauthorized" : err.message;
            return next(createError.Unauthorized(errMsg))
            req.payload=payload
            next()
        })
    }
}