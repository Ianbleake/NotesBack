const mongoose = require('mongoose');

const usernameRegex = /^[a-zA-Z0-9]+$/;

const isPasswordSecure = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 11,
    unique: true,
    validate: {
      validator: function(value) {
        return usernameRegex.test(value);
      },
      message: 'El nombre de usuario solo puede contener letras y números.'
    }
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return isPasswordSecure(value);
      },
      message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.'
    }
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
