import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.updatedAt = new Date();
  }
  next();
});

export const Note = mongoose.model("Note", noteSchema);
