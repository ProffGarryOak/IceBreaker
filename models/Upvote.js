import mongoose from "mongoose";

const UpvoteSchema = new mongoose.Schema({
  contentTitle: { type: String, required: true },
  category: { type: String, required: true },
  count: { type: Number, default: 0 },
  // specific users who upvoted to prevent double voting (optional for now, but good practice)
  upvotedBy: [{ type: String }],
});

// Create composite key for uniqueness
UpvoteSchema.index({ contentTitle: 1, category: 1 }, { unique: true });

export default mongoose.models.Upvote || mongoose.model("Upvote", UpvoteSchema);
