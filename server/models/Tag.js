const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');


const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String
    }
    
});

TagSchema.plugin(mongoose_fuzzy_searching, {fields: [{
    name: 'name',
    minSize: 1,
    weight: 5
}]});



module.exports = mongoose.model('Tag', TagSchema); 