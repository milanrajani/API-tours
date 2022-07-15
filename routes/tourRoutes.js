const express = require('express')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
// const reviewController = require('./../controllers/reviewController')
const reviewRouter = require('./../routes/reviewRoutes');


//tours using middleware
const router = express.Router();


router.use('/:tourId/reviews', reviewRouter)



router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router.get('/', tourController.getAlltours)
router.get('/:id', tourController.getTour)
router.post('/', authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
)
router.delete('/:id',
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
    )
router.patch('/:id', authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
)




// reviews route

// router.route('/:tourId/reviews').post( authController.protect, authController.restrictTo('user'), reviewController.createReview)


module.exports = router; 