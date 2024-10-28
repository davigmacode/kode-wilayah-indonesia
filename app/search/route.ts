import { type NextRequest } from 'next/server';
import { searchByFullname } from '../db';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');
  if (!query) return Response.json({ message: 'query should be provided' }, { status: 400 });

  const limit = Number(searchParams.get('limit') || 25);
  const skip = Number(searchParams.get('skip') || 0);

  const result = searchByFullname({ query, limit, skip });
  return Response.json(result);
}