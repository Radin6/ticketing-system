import 'dotenv/config';
import mongoose from "mongoose";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

// Connect to the local database
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected to DB'))
  .catch(error => console.log("failed to connect to the DB",error))

  const users = [
    { name: 'user', role: 'user', email: 'user@email.com', password: '12345678'},
    { name: 'admin', role: 'admin', email: 'admin@email.com', password: '12345678'}
  ]

  const status = ['open', 'closed', 'in-progress']
  const priorities = ['high', 'medium', 'low']

async function deleteColletion() {
  await User.deleteMany({});
  console.log("User collection deleted")
  await Ticket.deleteMany({});
  console.log("Ticket collection deleted")
}

async function createUsers() {
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
  }
}

async function createTickets() {
  const fetchedUsers = await User.find({});

  for (let num = 0; num < 15; num++) {
    const ticket = new Ticket({
      user: fetchedUsers[Math.floor(Math.random() * fetchedUsers.length)].id,
      createdAt: Date.now(),
      status: status[Math.floor(Math.random() * 3)],
      priority: priorities[Math.floor(Math.random() * 3)],
      title: `Title number ${num}`,
      description: `This is a description for ticket number ${num}`
    })

    await ticket.save()
  }
}

async function populateDB() {
  await deleteColletion();
  await createUsers();
  await createTickets();
  console.log("Database populates");
  mongoose.disconnect();
}

populateDB();