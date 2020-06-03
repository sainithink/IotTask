const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
const catchAsync = require('../helpers/catchAsync');
const utility = require('../helpers/utility');
const db = require('../models/index');
const mailer = require('../helpers/mailer');
const { constants } = require('../helpers/constants');
const bcrypt = require('bcrypt');

// API to get a list of users
exports.userslist = catchAsync(async (req, res) => {
    const user = await db.Users.find({});
    if (!user) {
      return apiResponse.successResponseWithData(res, ' No Users Added !', []);
    }
    if (user.length == 0) {
      return apiResponse.successResponseWithData(res, 'No Users added yet', user);
    } else {    
      return apiResponse.successResponseWithData(res, 'Users list', user);
    }
    
  });

// API to get a list of categories

exports.categorieslist = catchAsync(async (req, res) => {
    const user = await db.Categories.find({});
    if (!user) {
      return apiResponse.successResponseWithData(res, ' No categories Added !', []);
    }
    if (user.length == 0) {
      return apiResponse.successResponseWithData(res, 'No categories added yet', user);
    } else {    
      return apiResponse.successResponseWithData(res, 'categories list', user);
    }
    
  });

//   API to create a new user

  


  exports.addusers = [
	// Validate fields.
    body("Name").isLength({ min: 1 }).trim().withMessage("Name must be specified.")
    .isAlphanumeric().withMessage("Name has non-alphanumeric characters."),
    body("Role").isLength({ min: 1 }).trim().withMessage("Role must be specified.")
    .isAlphanumeric().withMessage("Role has non-alphanumeric characters."),
    body("Category").isLength({ min: 1 }).trim().withMessage("Category must be specified.").custom((value) => {
        return db.Categories.findOne({_id : value}).then((user) => {
            if (!user) {
                return Promise.reject("Category is not available");
            }
        });
    }),
    body("Email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
    .isEmail().withMessage("Email must be a valid email address.").custom((value) => {
        return db.Users.findOne({email : value}).then((user) => {
            if (user) {
                return Promise.reject("E-mail already in use");
            }
        });
    }),
    body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("Name").escape(),
	sanitizeBody("Role").escape(),
    sanitizeBody("email").escape(),
    sanitizeBody("Category").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	catchAsync(async(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
                // return apiResponse.ErrorResponse(res, err);
				//hash input password
                user = await db.Users.create(req.body);
                return apiResponse.successResponseWithData(res,'User added succefully .',user);
                
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
    })];
    

    // API to create a new Category

exports.addcategory =
catchAsync(async (req, res) => {

    categories = await db.Categories.create(req.body);
    return apiResponse.successResponseWithData(res,'Category added succefully .',categories);
  });



//   
exports.updateusers = [
    async (req, res) => {
        console.log(req.body);
        const user = db.Users.findById(req.params.id);
        if(user){
            if(req.body.password){
                const isemail = await db.Users.findOne({Email:req.body.Email});
                console.log(`Email:${isemail}`);
                if(isemail == null){
                    const iscategory = await db.Categories.findOne({_id:req.body.category}).count();
                    if(iscategory){
                        req.body.password = await bcrypt.hash(req.body.password, 10);
                        const updated = await db.Users.findByIdAndUpdate(req.params.id,req.body);
                        return apiResponse.successResponseWithData(res,'Updated succefully .',updated);
                    }else{
                        return apiResponse.validationErrorWithData(res, "Category Id Doesent Match our records.");

                    }
                }else{
                    return apiResponse.validationErrorWithData(res, "Email Id Already Exists.");
                }
            }else{
                return apiResponse.validationErrorWithData(res, "Password Must be Specified.");
            }

        }else{

            return apiResponse.validationErrorWithData(res, "Invalid User Id.");
        }

    }];;


// API to Delete user

exports.deleteuser =[
    async (req, res) => {
    user = await db.Users.findByIdAndRemove(req.params.id);
    if(user){

        return apiResponse.successResponseWithData(res,'Deleted Succesfully .',user);
    }else{
        return apiResponse.validationErrorWithData(res, "User Id Doesent Match our Records");
    }
    }];