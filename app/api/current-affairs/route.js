import { NextResponse } from 'next/server';
import { getCurrentAffairs, saveCurrentAffairs } from '@/lib/storage';

export async function GET() {
  try {
    const affairs = getCurrentAffairs();
    return NextResponse.json(affairs || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const affairs = getCurrentAffairs() || [];
    const newAffair = {
      id: affairs.length + 1,
      title: body.title,
      content: body.content,
      category: body.category || 'General',
      date: body.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    affairs.push(newAffair);
    saveCurrentAffairs(affairs);
    return NextResponse.json(newAffair, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
