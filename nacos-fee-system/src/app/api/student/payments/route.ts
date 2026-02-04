import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { paymentQueries } from '@/lib/db/queries';

export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get student's payments
        const payments = await paymentQueries.getPaymentsByStudentId(session.userId);

        return NextResponse.json({
            payments,
        });
    } catch (error) {
        console.error('Payments error:', error);
        return NextResponse.json(
            { error: 'Failed to load payments' },
            { status: 500 }
        );
    }
}
