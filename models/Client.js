const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    mobile: {
      type: String,
      unique: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
    },

    address: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema);
