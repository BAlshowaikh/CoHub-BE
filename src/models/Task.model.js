const mongoose = require("mongoose")

// Creating enums
export const TASK_STATUSES = ["todo", "doing", "done"]

const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [120, "Title must be at most 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must be at most 2000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: "Invalid status",
      },
      default: "todo",
      index: true,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    // Relationships
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "projectId is required"],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Auditing
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
    },
  }, {timestamps: true})

const Task = mongoose.model("Task", taskSchema)
module.exports = Task