const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let setSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    images: {
      type: String,
      required: true
    },
    SetNumber: {
      type: Number,
      required: true
    },
    appearsIn: {
      type: Number,
      required: false
    },
    quality: {
      type: String,
      required: true
    },
    filters: {
      type: Array,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    included: {
      type: String,
      required: false
    },
    year: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Minifigures", setSchema);
