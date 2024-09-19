const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const User = require('../models/user')

describe('when there is initially one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('Sekret123!', 10) 
    const user = new User({ username: 'rootUser123', passwordHash })
  
    await user.save()
  })
  

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: 'mluukkainen123', 
      name: 'Matti Luukkainen',
      password: 'Salainen123!',
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: 'rootUser123',
      name: 'Superuser',
      password: 'Salainen123!',
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
  
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  


})

after(async () => {
  await mongoose.connection.close()
})