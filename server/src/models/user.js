let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  email: {type: String, unique: true},
  passwordHash: {type: String},
  avatarUrl: {type: String},
  firstName: {type: String},
  lastName: {type: String}
}, {
  timestamps: true
});

userSchema.virtual('fullName').get(() => {
    return this.firstName + ' ' + this.lastName;
});

let User = mongoose.model('User', userSchema);

module.exports = User;
