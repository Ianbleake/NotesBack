const Note = require('../models/note');
const User = require('../models/user');

const testUserId = '66ec6ba70db3053a515cb486'; 

const createInitialNotes = (userId) => [
  {
    content: 'HTML is easy',
    important: false,
    user: userId 
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
    user: userId 
  }
];

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' });
  await note.save();
  await note.deleteOne();
  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

module.exports = {
  createInitialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  testUserId
};
