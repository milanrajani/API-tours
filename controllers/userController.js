const express = require('express')
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory')
const User = require('./../models/userModel')
const multer = require('multer')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'public/img/users')
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split('/')[1];
        cb(null,  `user-${req.user.id}- ${Date.now().$(ext)}`)
    }
});

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
            cb(null, true)
    } else{
        cb(new AppError('Not an image'), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})  
exports.uploadUserPhoto = upload.single('photo')

const filterObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el=>{
        if (allowedFields.includes(el))  newObj[el] = obj[el]
    })
}

exports.getMe = (req, res, next)=>{
    req.params.id = req.user.id;
    next()
}


 //////////////////////////////////////////////////////// UPDATE USER DATA ///////////////////////////////////////////////////
exports.updateMe = catchAsync(async(req,res,next) =>{
    console.log(req.file)
    console.log(req.body)
    //1. Create error if user POSTS password date
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password upadate'))
    }
    //2 filtered out unwanted fields names that are not allowed to be updated by user
    const filteredBody = filterObj(req.body, 'name', 'email');
    if(req.file) filteredBody.photo = req.file.filename

    //3 update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
    })
    res.status(500).json({
        status:'error',
        data:{
            user: updatedUser
        },
        message:"This route is not yet implemented"
    })
})

//////////////////////////////////////////////////// DELETE USER DATA //////////////////////////////////////////////////////////

exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status:'success',
        data: null
    })
})


exports.createUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:"This route is not defined! please use signup instead"
    })
}
// Do not update password with this
exports.updateUser =  factory.updateOne(User)
exports.deleteUser =  factory.deleteOne(User)
exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)