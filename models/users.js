const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true}
});

UserSchema.methods.serialize = function () {
    return {
        username: this.username
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);
module.exports = {User};