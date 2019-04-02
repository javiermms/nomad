const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  criticed_user: { type: String, required: true },
  stars: { type: String, required: true },
  comment: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Review", ReviewSchema);


