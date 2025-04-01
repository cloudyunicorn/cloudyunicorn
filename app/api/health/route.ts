import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error?.message || 'Unknown error',
        details: String(error)
      },
      { status: 500 }
    );
  }
}
