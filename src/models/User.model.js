//user
const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String, required: true },
    fullname: { type: String, required: true },
    user_role: { type: String, enum:["PM","Employee","Manager"], required: true },
    department: { type: String, enum:["IT","HR","Marketing"], required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
