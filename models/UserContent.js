import mongoose from 'mongoose'

const listSchema = {
  planned: [Object],
  inProgress: [Object],
  completed: [Object]
}

const UserContentSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  movies: listSchema,
  anime: listSchema,
  shows: listSchema,
  books: listSchema,
  songs: listSchema,
  games: listSchema,
})

export default mongoose.models.UserContent || mongoose.model('UserContent', UserContentSchema)
