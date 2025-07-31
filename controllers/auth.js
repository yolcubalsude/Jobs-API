const User = require('../models/User')
const {StatusCodes} = require ('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async (req, res) => {   
const user = await User.create({...req.body})
const token =  await user.createJWT()
    res.status(StatusCodes.CREATED).json({
         user: { name: user.name }, 
         token
         });
};

const login = async (req , res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email}) 
    
    if(!user){
        throw new BadRequestError('User not found')
    }

    const isPasswordCorrect = await user.comparePassword(password)

   if(!isPasswordCorrect){
    throw new UnauthenticatedError(' Invalid Credentials')
   }

const token = await user.createJWT();
const msg = " sen ahmetsin"
if(email == 'ahmet@gmail.com') {
    return res.status(StatusCodes.OK).json({user:{name: user.name}, msg:msg, token})
}
    return res.status(StatusCodes.OK).json({user:{name: user.name}, token})
};

module.exports = {
    register,
    login,
}; 