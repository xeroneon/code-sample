const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CodeSchema = new Schema({
    uid: {
        type: String,
        required: true,
        trim: true,
    },
    expires: String
    
});


module.exports = mongoose.model('Code', CodeSchema);