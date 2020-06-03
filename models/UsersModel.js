var mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var UsersSchema = new mongoose.Schema({
	Name : {type: String, required: true},
	Email : {type: String, unique: true},
	password: {type: String, required: true},
	Role:{type:String},
	Status:{type:Boolean,default:true},
	Category: {
	
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Categories'
		  
	}
}, {timestamps: true});

// Virtual for user's full name
UsersSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
	  return next();
	}
	const hashedPassword = await bcrypt.hash(this.password, 10);
	this.password = hashedPassword;
	return next();
  });
  
  UsersSchema.methods.correctPassword = async function(
	candidatePassword,
	userPassword
  ) {
	return await bcrypt.compare(candidatePassword, userPassword);
  };

module.exports = mongoose.model("Users", UsersSchema);