let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let contactSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, unique: true},
  avatarUrl: {type: String},
  firstName: {type: String},
  lastName: {type: String}
}, {
  timestamps: true
});

contactSchema.virtual('fullName').get(() => {
    return this.firstName + ' ' + this.lastName;
});

let Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
