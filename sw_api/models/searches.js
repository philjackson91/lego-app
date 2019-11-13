const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  query: {
    type: String
  },
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model("PreviousSearches", userSchema);
