// const stripe = require('stripe')("sk_test_51LLQs6SFLWBzSprK0fRdK9b6MaOCPkXpMmfLjGKeblPI8NHiN2v88AI0HTwKt9OyJZBNab9yPUIu65OzDKQ3GLSx00O4mAgRc0")
const Tour = require('./../models/tourModel')
// const factory = require('./handlerFactory')
// const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');



exports.getCheckoutSession = catchAsync( async (req,res,next)=>{
    // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [   
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});
