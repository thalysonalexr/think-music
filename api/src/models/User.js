const { model, Schema } = require('mongoose');

UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = model('User', UserSchema);
