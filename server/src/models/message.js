let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
  conversationId: Schema.Types.ObjectId,
  text: {type: String},
  from: {type: Schema.Types.ObjectId, ref: 'Contact'}
}, {
  timestamps: true
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;
