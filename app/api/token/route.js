import { getAuth } from "@clerk/nextjs/server"

export async function GET(request) {
  try {
    const { userId, sessionId, getToken } = getAuth(request)

    const token = await getToken()
    return Response.json({ token, userId, sessionId })
  } catch (err) {
    console.error("Error getting token:", err)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
