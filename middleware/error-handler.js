const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const errorHandlerMiddleware = (err, req, res, next) => {

  const customError = {
    statusCode : err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  }

  console.log(err) 

  if(err.name === 'ValidationError'){  
    customError.msg = Object.values(err.errors)
    .map((item) => item.message)
    .join(',')
    customError.statusCode = 400
  }

  if(err.code && err.code == 11000){
     customError.msg= `Duplicate value entered for object ${Object.keys(err.keyValue)} field, please choose another value`
     customError.statusCode = 400 
  }

  if(err.name === 'CastError'){
    customError.msg = `No item with id : ${ err.value}`
    customError.statusCode = 404 
  }
   
  return res.status(customError.statusCode).json({ msg:  customError.msg })
  }

module.exports = errorHandlerMiddleware
