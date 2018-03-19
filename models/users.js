
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.methods.serialize = function () {
    return {
        username: this.username,
        password: this.password
    }
}

const User = mongoose.model('User', userSchema);
module.exports = {User};