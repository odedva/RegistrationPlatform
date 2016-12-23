var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    config = require('../../config/config');

var UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: String,
    inst: String,
    degree: String,
    tshirt: String,
    food: String,
    tags: Object,
    gender: String,
    yearOfDegree: String,
    degreeType: String,
    needPC: {type: Boolean, default: false},
    regDate: String,
    accepted: {type: Boolean, default: false},
    isMember: {type: Boolean, default: false},
    team: {type: String, default: ''},
    resetPass: String,
    password: String,
    provider: String,
    providerId: String,
    providerData: {}

});

UserSchema.static('findByEmail', function (email, callback) {
    return this.findOne({email: email}, callback);
});

UserSchema.pre('save',
    function (next) {
        if (this.password) {
            var md5 = crypto.createHash('md5');
            this.password = md5.update(this.password).digest('hex');
        }

        next();
    }
);

UserSchema.pre('findOneAndUpdate', function (next) {
    if (this._update.password) {
        var md5 = crypto.createHash('md5');
        this._update.password = md5.update(this._update.password).digest('hex');
    }
    next();
});

UserSchema.methods.authenticate = function (password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function (email, suffix, callback) {
    var _this = this;
    var possibleEmail = email + (suffix || '');

    _this.findOne(
        {email: possibleEmail},
        function (err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleEmail);
                }
                else {
                    return _this.findUniqueUsername(email, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};

UserSchema.statics.isAdmin = function (user) {
    if (user && user.email.toLowerCase() === config.adminEmail.toLowerCase()) {
        return true;
    }
    return false;
};

mongoose.model('User', UserSchema);