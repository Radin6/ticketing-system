import Ticket from "../models/Ticket.js";
import jwt from "jsonwebtoken";

export default async function ticketOwnerOrAdmin(req, res, next) {

  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).send("Access denied. No token provided");

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log(verified)
    if (verified.role === 'admin') {
      return next();
    }
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }
  
    if (ticket.userId === verified.userId) {
      return next();
    }
  
    return res.status(403).send('Access denied, you are not the Owner or Admin');

  } catch (error) {
    res.status(400).send("Invalid token");
  }

}