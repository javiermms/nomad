const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  rent: { type: String, required: true },
  description: { type: String, required: true },
  district: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Listing", ListingSchema);