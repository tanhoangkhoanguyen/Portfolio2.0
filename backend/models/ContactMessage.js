const mongoose = require("mongoose")

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, maxlength: 254 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true }
)

/*
If the ContactMessage model been created
  -> Reuse the existing model
Otherwise,
  -> Create a new model using the schema
*/
module.exports = mongoose.models.ContactMessage
  ? mongoose.model("ContactMessage")
  : mongoose.model("ContactMessage", contactMessageSchema)