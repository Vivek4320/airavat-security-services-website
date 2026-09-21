import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    const { name, contact, age, oldExperience, payment, address, shift, remarks, permanentWork, temporaryWork } = body;

    if (!name || !contact || !age || !oldExperience || !payment || !address || !shift) {
      return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 });
    }

    const guard = await prisma.guard.create({
      data: {
        name: String(name).trim(),
        contact: String(contact).trim(),
        age: Number(age),
        oldExperience: String(oldExperience).trim(),
        payment: String(payment).trim(),
        address: String(address).trim(),
        shift: String(shift),
        remarks: remarks ? String(remarks).trim() : null,
        permanentWork: Boolean(permanentWork),
        temporaryWork: Boolean(temporaryWork),
      },
    });

    return NextResponse.json({ success: true, guard });
  } catch (error) {
    console.error('Guard create error:', error);
    return NextResponse.json({ error: 'Failed to register guard.' }, { status: 500 });
  }
}
