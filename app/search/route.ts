import { type NextRequest } from 'next/server';
import { searchByFullname } from '../db';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get('type') || 'all';
  const query = searchParams.get('query') || '';
  const limit = Number(searchParams.get('limit') || 25);
  const skip = Number(searchParams.get('skip') || 0);

  const result = searchByFullname({ type, query, limit, skip });
  return Response.json(result);
}