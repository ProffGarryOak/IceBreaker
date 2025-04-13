// app/api/profile/[userId]/route.js
import { dbConnect } from '@/lib/dbConnect'
import UserContent from '@/models/UserContent'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  await dbConnect()
  const { userId } = params

  try {
    // Find user by userId and return public data
    const userData = await UserContent.findOne({ userId })
      .select('-_id -__v')
      .lean()

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}