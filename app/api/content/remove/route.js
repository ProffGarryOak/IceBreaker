// app/api/content/remove/route.js
import { dbConnect } from '@/lib/dbConnect'
import UserContent from '@/models/UserContent'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(req) {
  try {
    await dbConnect()
    const { userId } = getAuth(req)
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { category, list, itemId } = await req.json()
    console.log('Request body:', { category, list, itemId })
    // Validate inputs
    const allowedCategories = ['movies', 'anime', 'shows', 'books', 'songs', 'games']
    const allowedLists = ['planned', 'inProgress', 'completed']
    
    if (!allowedCategories.includes(category) || !allowedLists.includes(list)) {
      console.log('Invalid category or list:', { category, list })
      return Response.json({ error: 'Invalid inputs' }, { status: 400 })
    }

    // Remove item from list
    const userData = await UserContent.findOneAndUpdate(
      { userId },
      { $pull: { [`${category}.${list}`]: { id: itemId } } },
      { new: true }
    )

    if (!userData) {
      return Response.json({ error: 'User data not found' }, { status: 404 })
    }

    return Response.json({ success: true, data: userData })
  } catch (error) {
    console.error('Remove error:', error)
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}