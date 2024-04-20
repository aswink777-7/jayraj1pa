const express = require('express');
const router = new express.Router();
const jwtMiddleware = require('../Middleware.js/jwtMiddleware')
const multermiddleware = require('../Middleware.js/multerMiddleware')
const isAdmin = require('../Middleware.js/adminMiddleware')

const userControl = require('../Controllers/userController');
const reportController = require('../Controllers/reportController')
const scheduleContoller = require('../Controllers/scheduleController')
const adminController = require('../Controllers/adminController')
const paymentController = require('../Controllers/paymentController')
const Feedback = require('../Controllers/FeedbackController')



// payment controller
router.post('/orders', paymentController.createOrder);

// registarion
router.post('/user/register', userControl.register);

// login
router.post('/user/login',userControl.login)

// reporting
router.post('/user/reporting',jwtMiddleware,multermiddleware.single('reportingImage'),reportController.wasteReports)

//sheduling
router.post('/user/scheduling',jwtMiddleware,scheduleContoller.wasteScheduling)

// user-reports
router.get('/user/reportview',jwtMiddleware,reportController.allUserReports)


// user-schedulings
router.get('/user/schedulingview',jwtMiddleware,scheduleContoller.allUserSchedulings)


// Admin registration route
router.post('/admin/registration', userControl.registerAdmin);

// admin-users
router.get('/admin/UsersView', jwtMiddleware, isAdmin, adminController.viewAllUsersWithStats);

// admin view all reports
router.get('/admin/Reportview',jwtMiddleware,isAdmin,adminController.viewAllReports)

// admin view all scheduling
router.get('/admin/Scheduleview',jwtMiddleware,isAdmin,adminController.viewAllSchedulings)

// admin-Communityschema
router.post("/admin/community",jwtMiddleware,multermiddleware.single('communityImage'),isAdmin,adminController.addCommunity)

// view community
router.get("/all/community",adminController.viewCommunity)


// admin-products

router.post("/admin/products",jwtMiddleware,multermiddleware.single('productImage'),isAdmin,adminController.addProduct)


// view products
router.get("/all/products",adminController.viewProducts)



// edit-user
router.put('/user/profile',jwtMiddleware,userControl.editUser)


// deleteuser-Account
router.delete('/account/delete', jwtMiddleware, userControl.deleteAccount);

// deleteReport
router.delete('/delete/report/:reportId',jwtMiddleware,reportController.deleteReport)

// delete schedule

router.delete('/delete/schedule/:scheduleId',jwtMiddleware,scheduleContoller.deleteSchedule)


// delete product

router.delete('/delete/product/:scheduleId',jwtMiddleware,isAdmin,adminController.deleteProduct)

// delete schedule
router.delete('/delete/community/:scheduleId',jwtMiddleware,isAdmin,adminController.deleteCommunity)

// logout
router.get('/logout', jwtMiddleware,adminController.logout);

// /update report status admin
router.put('/admin/reports/update-status',jwtMiddleware,isAdmin,adminController.updateReportStatus);

// update schedule status admin
router.put('/admin/schedule/update-status',jwtMiddleware,isAdmin,adminController.updateSheduleStatus);


router.put('/community/update-status',jwtMiddleware,userControl.updateCommunityStatus);



// feedback
router.post('/sumbit/feedback',jwtMiddleware,Feedback.submitFeedback)


// adminView
router.get('/admin/viewfeedback',jwtMiddleware,isAdmin,Feedback.getAllFeedback)

// block users admin
router.put('/block-user/:userId', jwtMiddleware, isAdmin, adminController.blockUser);

//unblock users admin 
router.put('/unblock/:userId',jwtMiddleware,isAdmin, adminController.unblockUser);

// coins
router.get('/coins',jwtMiddleware,userControl.getCoinsForUser)


// edit report
router.put('/report/edit/:id',jwtMiddleware,multermiddleware.single('reportingImage'),reportController.editReport)



// edit scheduling
router.put('/schedule/edit/:id',jwtMiddleware,scheduleContoller.editScheduling)


// prducts checkout
router.post("/checkout",jwtMiddleware,adminController.checkout)


// admin product checkout view
router.get("/admin/checkout",jwtMiddleware,isAdmin,adminController.viewCheckout)








module.exports = router;
