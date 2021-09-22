const mongoose = require("mongoose");
const { Schema } = mongoose;

const investSchema = new Schema({
  // schema
  fullName: {
    type: String,
    required: true,
  },
  kohtype: {
    type: String,
    required: true,
  },
  roi: {
    type: String,
    require: true
  },
  amount: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});
const Invest = mongoose.model("Invest", investSchema);
module.exports = Invest;
