const express = require("express")
const morgan = require("morgan")
const app = express();
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const path = require('path')
const cookieParser = require('cookie-parser')
var cors = require('cors')

app.use(cors())

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require("./routes/tourRoutes");
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

 

// set security HTTP headers

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from thism IP, please try again in an hour"
})
app.use('/api',limiter)

app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));



app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);


app.use(morgan("dev"));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: 'true', limit: '10kb'}));
app.use(cookieParser())

//Data Sanitization against nosql query injection
app.use(mongoSanitize())

//Data sanitization against xss
app.use(xss())

//prevent parameter pollution
app.use(hpp({
  whitelist:[
    'duration',
    'ratingAverage',
    'ratingQuantity',
    'maxGroupSize',
    'difficult',
    'price'
  ]
}))

app.use((req,res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
})
 





app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);



app.all('*',(req,res,next)=>{
  next(new AppError(`Cannot find ${req.originalUrl} on this server`))
})
 
app.use(globalErrorHandler)

module.exports = app;

     


