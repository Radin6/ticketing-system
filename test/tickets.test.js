import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import server from '../server.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

describe('Tickets API', () => {
  let token;

  beforeAll(async () => {
    await User.deleteMany({});
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        name: 'Test users',
        email: 'test@email.com',
        password: '12345678',
      })
    
    token = response.body.token;
  })

  beforeEach( async () => {
    await Ticket.deleteMany({});
  })

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  test('create a new ticket', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "new ticket test 1",
        description: "new ticket test desciption 1",
        pirority: "high",
        status: "open"
      })

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('ticket');
    expect(response.body.ticket).toHaveProperty('title', 'new ticket test 1');

  });

  test('Get all tickets', async () => {
    const ticket1 = await Ticket.create({
      title: 'Ticket 1',
      description: 'description ticket',
      priority: 'low',
      status: 'open',
      user: 'test-user-id'
    })

    await ticket1.save();

    const ticket2 = await Ticket.create({
      title: 'ticket2',
      description: 'description ticket',
      priority: 'medium',
      status: 'in-progress',
      user: 'test-user-id'
    })
  
    await ticket2.save();

    const response = await request(app).get('/api/tickets');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('results')
    expect(response.body).toHaveProperty('total')
    expect(response.body).toHaveProperty('currentPage')
    expect(response.body.total).toBe(2)
  });
})