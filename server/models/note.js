const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    validate: [arrayLimit, 'Exceeds the limit of 9 tags']
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  reminder: {
    type: Date,
    default: null
  },
  archived: {
    type: Boolean,
    default: false
  },
  trash: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length <= 9;
}

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
