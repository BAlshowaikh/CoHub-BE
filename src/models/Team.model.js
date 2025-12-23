const { Schema, default: mongoose } = require("mongoose")
const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
)
module.exports = teamSchema
