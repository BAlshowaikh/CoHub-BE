const { Schema, default: mongoose } = require("mongoose")
const projectSchema = new Schema(
  {
    //name of the project
    name: { type: String, required: true },
    // the description of the project
    description: { type: String, required: true },
    // the deadline of the project
    deadline: { type: Date },
    // project manager id
    PM_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //status of the  project
    status: {
      type: String,
      enum: ["completed", "pending", "On progress"],
      default: "pending",
    },
    // team id for the project
    Team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
)
module.exports = projectSchema
