const Review = require('./../models/reviewModel');
// const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory')



exports.setTourUserIds = (req, res, next) =>{
    //Allow nestted reviews
    if(!req.body.tour) req.body.tour = req.params.tourID;
    if(!req.body.user) req.body.user = req.user.tourID;
    next()
}


exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.createReview = factory.createOne(Review)

