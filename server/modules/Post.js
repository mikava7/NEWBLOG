import mongoose from "mongoose";

const postShcema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      //tu ar gadavcemt tegebs, defoltad mivcem cariel masivs
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageURL: String,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Post", postShcema);
