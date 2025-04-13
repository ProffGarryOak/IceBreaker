// app/api/content/move/route.js
import { dbConnect } from '@/lib/dbConnect'
import UserContent from '@/models/UserContent'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(req) {
  try {
    await dbConnect()
    const { userId } = getAuth(req)
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

      const { category, fromList, toList, itemId } = await req.json()
      
      // Validate inputs
      const allowedCategories = ['movies', 'anime', 'shows', 'books', 'music', 'games']
      const allowedLists = ['planned', 'inProgress', 'completed']
      
      if (!allowedCategories.includes(category) || 
          !allowedLists.includes(fromList) || 
          !allowedLists.includes(toList) ||
          !itemId) {
        return Response.json({ error: 'Invalid inputs' }, { status: 400 })
      }
  
      // Find the user's document
      const userData = await UserContent.findOne({ userId })
      if (!userData) {
        return Response.json({ error: 'User data not found' }, { status: 404 })
      }
  
      // Find the item to move
      const itemToMove = userData[category][fromList].find(item => item.id === itemId)
      if (!itemToMove) {
        return Response.json({ error: 'Item not found' }, { status: 404 })
      }
  
      // Perform the move operation
      await UserContent.findOneAndUpdate(
        { userId },
        { 
          $pull: { [`${category}.${fromList}`]: { id: itemId } },
          $addToSet: { [`${category}.${toList}`]: itemToMove }
        },
        { new: true }
      )
  
      return Response.json({ success: true })
    } catch (error) {
      console.error('Move error:', error)
      return Response.json(
        { error: 'Internal server error', details: error.message },
        { status: 500 }
      )
    }
  }