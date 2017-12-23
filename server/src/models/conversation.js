let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let conversationSchema = new Schema({
  startedBy: {type: Schema.Types.ObjectId, ref: 'Contact'},
  participants: [{type: Schema.Types.ObjectId, ref: 'Contact'}],
  messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
  name: {type: String}
}, {
  timestamps: true
});

conversationSchema.virtual('numberOfParticipants').get(() => {
  return this.participants.length;
});

let Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
