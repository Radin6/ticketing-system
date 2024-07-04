import express from "express";
import Ticket from "../models/Ticket.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import buildFilter from "../middlewares/filter.js";
import paginate from "../middlewares/paginate.js"
import ticketSchema from "../validations/ticketValidation.js";
import ticketOwnerOrAdmin from "../middlewares/ticketOwnerOrAdmin.js";

const router = express.Router();

// GET all tickets
// GET /api/tickets
// GET /api/tickets?pageSize=10&page=1
// GET /api/tickets?status=open&priority=high
// GET /api/tickets?search=bug
// public

router.get("/", buildFilter, paginate(Ticket), async (req, res) => {
  res.status(200).json(req.paginatedResults);
});


// Create a Ticket
// POST /api/tickets/
// Private (only logged users)
// Ticket Schema: user, title, desciption, priority, satus

router.post("/", auth, async (req, res) => {

  const { error } = ticketSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    })
  }

  const ticket = new Ticket({
    userId: req.user.userId,
    ticketId: req.user.ticketId,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
  });

  try {
    const newTicket = await ticket.save();
    res.status(201).json({ ticket: newTicket });
  } catch (err) {
    res.status(500).json({ message: "Server Error" + err.message });
  }
});

// Get a ticket by me
// GET /api/tickets/me
// Public

router.get("/me", auth, async (req, res) => {
  try {
    const ticket = await Ticket.find({ userId: req.user.userId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ ticket: ticket });
  } catch (err) {
    res.status(500).json({ message: "Server Error" + err.message });
  }
});

// Get a ticket by ticket uid
// GET /api/tickets/:ticketId
// Public

router.get("/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ ticket: ticket });
  } catch (err) {
    res.status(500).json({ message: "Server Error" + err.message });
  }
});


// Update a ticket by uid
// PUT /api/tickets/:ticketId
// Private (only logged users)
// Ticket Schema: user, title, desciption, priority, satus

router.put("/:ticketId", auth, async (req, res) => {
  const updates = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.ticketId, updates, {
      new: true,
    });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ ticket: ticket });
  } catch (err) {
    res.status(500).json({ message: "Server Error" + err.message });
  }
});

// Delete a ticket by id
// DELETE /api/tickets/:ticketId
// Private (anly ADMIN or Ticket Owner)

router.delete("/:ticketId", ticketOwnerOrAdmin, async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ticketId: req.params.ticketId});
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ ticket: ticket });
  } catch (err) {
    res.status(500).json({ message: "Server Error" + err.message });
  }
});

export default router;