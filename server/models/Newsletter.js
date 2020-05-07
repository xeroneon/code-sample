const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NewsletterSchema = new Schema({
    contentful_id: {
        type: String,
        required: true,
        trim: true,
    }
    
});


module.exports = mongoose.model('Newsletter', NewsletterSchema);