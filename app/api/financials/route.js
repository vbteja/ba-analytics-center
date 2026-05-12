import { db } from '@/lib/db'
import { financials } from '@/lib/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await db.select().from(financials)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}