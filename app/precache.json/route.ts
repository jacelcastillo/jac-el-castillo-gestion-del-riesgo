import { NextResponse } from 'next/server'
import { precachePaths } from '@/lib/precache'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ pages: precachePaths() })
}
