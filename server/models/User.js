const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('mongoose-bcrypt');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const mongoosePaginate = require('mongoose-paginate');

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
        // required: true
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
        // required: true
    },
    tags: {
        type: Array,
        required: true
    },
    goals: {
        type: Array,
    },
    following: [{type: Schema.Types.ObjectId, ref: 'Following'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'Followers'}],
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
    phone: String
    
});
UserSchema.index({ location: "2dsphere" });
UserSchema.plugin(bcrypt);
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongoose_fuzzy_searching, {fields: [
    {
        name: 'name',
        minSize: 1,
        weight: 5
    },
    {
        name: 'lastname',
        minSize: 1,
        weight: 5
    }
]});




module.exports = mongoose.model('User', UserSchema); 