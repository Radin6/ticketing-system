import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, default: uuidv4, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
        delete ret.userId;
      },
      virtuals: true,
    },
  }
);

ticketSchema.index({ ticketId: 1, user: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;