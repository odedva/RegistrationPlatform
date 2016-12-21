var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ParamSchema = new Schema({
    name: String,
    isOpen: {type: Boolean, default: false}
});

mongoose.model('Param', ParamSchema);