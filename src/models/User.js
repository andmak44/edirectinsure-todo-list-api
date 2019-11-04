const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: value => {
          if (!validator.isEmail(value)) {
              throw new Error('Invalid Email address')
          }
      }
  },
  password: {
      type: String,
      required: true,
      minLength: 7
  }
})

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const errorMsg = "Invalid login credentials"
    const user = await User.findOne({ email: email } )
    if (!user) {
        throw new Error(errorMsg)
    }

    const compareResult = await bcrypt.compare(password, user.password)
    
    if(!compareResult){
        throw new Error(errorMsg)
    }
    // user.password = null
    return user
}

userSchema.statics.findByEmail = async (email) => {
    // Search for a user by email.
    const user = await User.findOne({ email: email })
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
