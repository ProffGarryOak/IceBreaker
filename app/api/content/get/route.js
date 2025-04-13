import { dbConnect } from '@/lib/dbConnect'
import UserContent from '@/models/UserContent'
import { getAuth } from '@clerk/nextjs/server'

export async function GET(req) {
  await dbConnect()
  const { userId } = getAuth(req)
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let data = await UserContent.findOne({ userId })
  if (!data) return Response.json({ error: 'No data' }, { status: 404 })

  return Response.json(data)
}
