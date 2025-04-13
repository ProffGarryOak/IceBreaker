// app/api/card/save/route.js
import { dbConnect } from '@/lib/dbConnect'
import UserProfile from '@/models/UserProfile'
import { auth } from '@clerk/nextjs'

export async function POST(req) {
  try {
    await dbConnect()
    const { userId } = auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { description, theme, username } = await req.json()
    
    await UserProfile.findOneAndUpdate(
      { userId },
      { 
        iceCard: { description, theme },
        username 
      },
      { upsert: true, new: true }
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error('Save error:', error)
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}