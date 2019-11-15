const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  previousSearches: [
    {
      type: Schema.Types.ObjectId,
      ref: "PreviousSearches"
    }
  ],
  sets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sets"
    }
  ],
  minifigures: [
    {
      type: Schema.Types.ObjectId,
      ref: "Minifigures"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
