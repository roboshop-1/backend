const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
},
{
  versionKey: false,
  timestamps: true
});
module.exports = mongoose.model("Token", tokenSchema);