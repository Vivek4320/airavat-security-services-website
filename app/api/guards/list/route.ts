import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAuth();
    const guards = await prisma.guard.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ guards });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load guards.' }, { status: 500 });
  }
}
