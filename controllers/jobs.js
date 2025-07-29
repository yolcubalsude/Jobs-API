const Job = require ('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require ('../errors')

const getAllJobs = async (req, res ) => {
    console.log("req test");
    
    console.log(req.user);
    const jobs = await Job.find({createdBY:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})

}
const getJob = async (req, res ) => {
    const {user:{userId},
    params:{id: jobId},
} = req

    const job = await Job.findOne({
        _id: jobId, createdBY: userId
    })
    if(!job){
        throw new NotFoundError(('No job with id  ' + jobId ))
    }
    res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res ) => {
    req.body.createdBY = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}


const updateJob = async (req, res ) => {
    const {user:{userId},
    params:{id: jobId},
} = req

console.log("update");
console.log(req.user.userId);

if(req.body.company === '' || req.body.postion === '' ){
    throw new BadRequestError('Company or Position fields cannot be empty')
}

const jobOwner = await Job.findOne({
    _id: jobId
})

if(jobOwner.createdBY != req.user.userId){
    throw new BadRequestError('No permission')

}

const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBY: req.user.userId },
    req.body,
    { runValidators: true, new: true }
)
 if(!job){
    throw new NotFoundError('No job with id ${jobId} ')
}
res.status(StatusCodes.OK).json({ job })
}






const  deleteJob = async (req, res ) => {
    const {user:{userId},
    params:{id: jobId},
} = req

const job = await Job.findByIdAndRemove({
    _id : jobId ,
    createdBY : userId 
})
if(!job){
    throw new NotFoundError('No job with id ${jobId} ')
}
res.status(StatusCodes.OK).send()
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,

}