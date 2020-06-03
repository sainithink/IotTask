var express = require("express");
var router = express.Router();

const {userslist,categorieslist,addusers,addcategory,updateusers,deleteuser} = require('../controllers/usersController');
/* GET home page. */
router.get("/", function(req, res) {
	res.render("index", { title: "Express" });
});

// API to get a list of users
router.get('/userslist', userslist);


// API to get a list of categories
router.get('/categorieslist', categorieslist);


// API to create a new user
router.post('/addusers', addusers);

// API to update the user
router.put('/updateusers/:id',updateusers);

// API to add a category
router.post('/addcategory',addcategory);

// API to Delete User

router.delete('/deleteuser/:id',deleteuser);

module.exports = router;
