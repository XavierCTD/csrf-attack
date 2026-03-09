const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Company is required"],
    trim: true,
    maxlength: [100, "Company name cannot exceed 100 characters"],
  },
  position: {
    type: String,
    required: [true, "Position is required"],
    trim: true,
    maxlength: [100, "Position cannot exceed 100 characters"],
  },
  status : {
    type: String,
    enum: ["interview", "pending", "declined"],
    default: "pending",
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
