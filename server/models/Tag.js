const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');


const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    
});

TagSchema.plugin(mongoose_fuzzy_searching, {fields: ['name']});



module.exports = mongoose.model('Tag', TagSchema); 