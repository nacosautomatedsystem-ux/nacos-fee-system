import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { paymentQueries } from '@/lib/db/queries';

export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const payments = await paymentQueries.getAllPayments();

        return NextResponse.json({
            payments,
        });
    } catch (error) {
        console.error('Admin payments error:', error);
        return NextResponse.json(
            { error: 'Failed to load payments' },
            { status: 500 }
        );
    }
}
