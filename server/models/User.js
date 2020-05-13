const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('mongoose-bcrypt');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const mongoosePaginate = require('mongoose-paginate');

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        bcrypt: true,
    },
    image: {
        type: String,
        required: true
    },
    country: {
        type: String,
        // required: true
    },
    zip: {
        type: String,
    },
    accountType: {
        type: String,
    },
    alerts: {
        type: Boolean,
        // required: true
    },
    tags: {
        type: Array,
    },
    personalTags: {
        type: Array,
    },
    goals: {
        type: Array,
    },
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    deals: {
        type: Boolean,
        // required: true
    },
    companyName: {
        type: String
    },
    city: String,
    state: String,
    address: String,
    location: {
        type: { type: String },
        coordinates: []
    },
    lat: String,
    lng: String,
    bio: String,
    tier: String,
    subActive: Boolean,
    specialty: Object,
    secondarySpecialties: Array,
    website: String,
    phone: String,
    prefix: String,
    suffix: String,
    shortBio: String,
    title: String,
    isAdmin: Boolean,
    coverPhoto: String,
    coverVideo: String,
    favorites: Array,
    isReviewBoard: Boolean,
    industry: String,
    placement: Number
    
});
UserSchema.index({ location: "2dsphere" });
UserSchema.plugin(bcrypt);
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongoose_fuzzy_searching, {fields: [
    {
        name: 'name',
        minSize: 1,
        weight: 5,
        prefixOnly: true
    },
    {
        name: 'lastname',
        minSize: 1,
        weight: 5,
        prefixOnly: true
    },
    {
        name: 'companyName',
        minSize: 1,
        weight: 5,
        prefixOnly: true
    }
]});




module.exports = mongoose.model('User', UserSchema); 