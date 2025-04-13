import { dbConnect } from '@/lib/dbConnect'
import UserContent from '@/models/UserContent'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(req) {
  try {
    await dbConnect()

    const { userId } = getAuth(req)
    console.log("User ID:", userId)
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { category, list, item } = await req.json()
    console.log("Payload:", category, list, item)

    const allowedCategories = ['movies', 'anime', 'shows', 'books', 'songs', 'games']
    const allowedLists = ['planned', 'inProgress', 'completed']

    if (!allowedCategories.includes(category) || !allowedLists.includes(list)) {
      return Response.json({ error: 'Invalid category or list' }, { status: 400 })
    }

    let userData = await UserContent.findOne({ userId })
    if (!userData) {
      userData = new UserContent({ userId })
      allowedCategories.forEach(cat => {
        userData[cat] = { planned: [], inProgress: [], completed: [] }
      })
    }

    const exists = userData[category][list].some(i => i.id === item.id)
    if (!exists) userData[category][list].push(item)

    await userData.save()
    return Response.json({ success: true })
  } catch (err) {
    console.error('❌ ERROR in /add:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
