const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
              return validator.isEmail(v);
            },
            message: props => `${props.value} is not a valid email!`
          },
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[{
        access:{
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
    
});

UserSchema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject();

    return _.pick(userObj, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id : user._id.toHexString(), access }, 'abc123!').toString();
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(()=>{
        return token;
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};