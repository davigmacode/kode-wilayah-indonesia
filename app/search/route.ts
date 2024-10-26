import { type NextRequest } from 'next/server';
import { datasource } from './datasource';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');
  if (!query) return Response.json({ error: 'query should be provided' });

  const limit = Number(searchParams.get('limit'));
  const skip = Number(searchParams.get('skip'));

  const result = datasource.search(query);
  const entries = result.splice(skip, limit).map((e) => e.item);
  return Response.json({ skip, limit, entries, count: result.length });
}