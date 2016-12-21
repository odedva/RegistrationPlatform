var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
    team_name: String,
    admin_email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    idea: String,
    tags: Object,
    members: Object,
    openDate: String,
    lookingText: {type: String, default: ""},
    isClosed: {type: Boolean, default: false},
    comp: String,
    exp: String

});

mongoose.model('Team', TeamSchema);