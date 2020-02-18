const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('mongoose-bcrypt');


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        bcrypt: true,
    },
    image: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    alerts: {
        type: Boolean,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    goals: {
        type: Array,
    },
    following: [{type: Schema.Types.ObjectId, ref: 'Following'}],
    deals: {
        type: Boolean,
        required: true
    },
    companyName: {
        type: String
    },
    city: String,
    state: String,
    address: String
    
});

UserSchema.plugin(bcrypt);



module.exports = mongoose.model('User', UserSchema); 