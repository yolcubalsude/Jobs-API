const User = require ('../models/User')
const jwt = require ('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')


const auth =(req, res, next) =>{
    //check header
const authHeader = req.headers.authorization;
// token Bearer ile başlıyor mu
if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new UnauthenticatedError ('Authentication invalid')
}

// token'ı header'dan ayıklıyoruz
const token = authHeader.split(' ')[1] 

try{
    //geçerli mi?
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the job routes

    const user = User.findById(payload.userId).select('-password')
    req.user = user 

    req.user = {userId:payload.userId, name: payload.name}
    next();

} catch (error) { 
    throw new UnauthenticatedError('Authentication invalid')

}}

module.exports = auth
