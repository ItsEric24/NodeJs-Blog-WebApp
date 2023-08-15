const mongoose = require("mongoose");
const { Schema } = mongoose;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const heroBlogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    snippet:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
}, {timestamps: true});

const userSchema = new Schema({
    username:{
        type: String,
        unique: true,
        required: [true, "Please enter a username"],
    },
    email:{
        type: String,
        unique: true,
        required: [true, "Please enter an email"],
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password:{
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimum password length is 6 characters"]
    }
});

userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to log in a user

userSchema.statics.login = async function(username, password){
    const user = await this.findOne({ username: username});
    if(user){
       const auth = await bcrypt.compare(password, user.password);

       if(auth){
        return user;
       }else{
        throw Error("Incorrect password");
       }
    }else{
        throw Error("Incorrect username");
    }
}

const User = mongoose.model("user", userSchema);

const HeroBlog = mongoose.model("heroBlog", heroBlogSchema);

module.exports ={
    HeroBlog,
    User
};