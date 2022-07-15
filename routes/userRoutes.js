const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
var app = express()
 



const router = express.Router();
// var cors = require('cors')

// app.use(cors())
 
//signup route
router.post('/signup', authController.signup)
//login route 
router.post('/login', authController.login);
router.get('/logout', authController.logout);
 

//protects all routes aftwer this miidewware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me',userController.getMe, userController.getUser)
router.patch('/updateMe', userController.uploadUserPhoto,  userController.updateMe);
router.delete('/deleteMe',  userController.deleteMe);

router.use(authController.restrictTo('admin'))

router.get('/', userController.getAllUsers)
router.post('/', userController.createUser)
router.get('/:id', userController.getUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)



//Reviews routes



module.exports = router