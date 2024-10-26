import { type NextRequest } from 'next/server';
import { searchByFullname } from '../db';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');
  if (!query) return Response.json({ error: 'query should be provided' });

  const limit = Number(searchParams.get('limit'));
  const skip = Number(searchParams.get('skip'));

  const result = searchByFullname({ query, limit, skip });
  return Response.json(result);
}