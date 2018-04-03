
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: String
    //images here from multer
});

postSchema.methods.serialize = function () {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        image: this.image
    };
};

const Post = mongoose.model('post', postSchema);
module.exports = {Post};
