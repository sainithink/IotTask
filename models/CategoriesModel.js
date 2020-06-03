var mongoose = require("mongoose");

var CategoriesSchema = new mongoose.Schema({
    Name :{type:String},
    
}, {timestamps: true});


module.exports = mongoose.model("Categories", CategoriesSchema);