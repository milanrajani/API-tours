const express = require('express')
const Tour = require('./../models/tourModel')
const factory = require('./handlerFactory')
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const fs = require('fs')

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)


///////////////////////////////////          TO GET ALL THE TOURS             /////////////////////////////////////////
// exports.getAlltours = async (req, res) => {
//     try {
//         //filtering
//         const queryObj = { ...req.query };
//         const excludeFields = ['page', 'sort', 'limit', 'fields'];
//         excludeFields.forEach(el => delete queryObj[el])


//         //Advance filtering
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(get|gt|lte|lt)\b/g, match => `$ ${match}`)


//         let query = Tour.find(JSON.parse(queryStr))
//         //sorting
//         if (req.query.sort) {
//             const sortBy = req.query.sort.split(',').join(' ');
//             query = query.sort(sortBy)
//         } else {
//             query = query.sort('-createdAt')
//         }
//         //field limiting
//         if (req.query.fields) {
//             const fields = req.query.fields.split(',').join(' ');
//             query = query.select(fields);
//         } else {
//             query = query.select('-__v')
//         }
//         //pagination
//         const page = req.query.page * 1 || 1;
//         const limit = req.query.limit * 1 || 100;
//         const skip = (page - 1) * limit;

//         query = query.skip(skip).limit(limit);

//         if (req.query.page){
//             const newTour = await Tour.countDocuments();
//             if (skip>= numTours) throw new Error('This page does not exists')
//         }


//         const tours = await query
//         res.status(200).json({
//             status: "success",
//             results: tours.length,
//             data: {
//                 tours
//             }
//         })
//     } catch (error) {
//         res.status(404).json({
//             status: 'fail',
//             message: 'err'
//         })
//     }


// }

exports.getAlltours = factory.getAll(Tour)


///////////////////////////////////          TO GET A SINGLE TOURS  BY ID          /////////////////////////////////////////
// exports.getTour = async (req, res) => {
//     try {
//         const tour = await Tour.findById(req.params.id).populate('reviews')

        

//         res.status(200).json({
//             status: "success",
//             data: {
//                 tour
//             }
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: 'fail',
//             message: 'error'
//         })
//     }


// }

exports.getTour = factory.getOne(Tour,{ path: 'reviews'})

///////////////////////////////////          TO CREATE NEW TOURS             /////////////////////////////////////////
// exports.createTour = async (req, res) => {
//     try {
//         const newTour = await Tour.create(req.body)
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: 'fail',
//             message: 'error'
//         })
//     }
// }

exports.createTour = factory.createOne(Tour)


///////////////////////////////////          TO UPDATE THE TOURS             /////////////////////////////////////////
// exports.updateTour = async (req, res) => {
//     try {
//         const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         })
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour
//             }
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: 'fail',
//             message: 'error'
//         })
//     }
// }

exports.updateTour = factory.updateOne(Tour)

///////////////////////////////////          TO DELETE THE TOURS             /////////////////////////////////////////
// exports.deleteTour = async (req, res) => {

//     try {
//         await Tour.findByIdAndDelete(req.params.id)
//         return res.status(204).json({
//             status: 'fail',
//             message: "Invalid ID"
//         })
//     } catch (error) {
//         res.status(204).json({
//             status: 'success',
//             data: null
//         })
//     }

// }

exports.deleteTour = factory.deleteOne(Tour)



exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
  
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  
    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }
  
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
  
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours
      }
    });
  });
  
  exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
  
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  
    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }
  
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1]
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier
        }
      },
      {
        $project: {
          distance: 1,
          name: 1
        }
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      data: {
        data: distances
      }
    });
  });
