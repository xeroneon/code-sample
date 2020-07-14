const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SharedLinkSchema = new Schema({
    url: String,
    image: String,
    title: String,
    description: String,
    tags: Array,
    sharedLink: {
        type: Boolean,
        default: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
}
);


module.exports = mongoose.model('SharedLink', SharedLinkSchema);