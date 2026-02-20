import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { studentQueries, paymentQueries, clearanceQueries } from '@/lib/db/queries';

export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get statistics
        const totalStudents = await studentQueries.countStudents();
        const totalRevenue = await paymentQueries.getTotalRevenue();
        const paymentStats = await paymentQueries.getPaymentStats();
        const clearanceStats = await clearanceQueries.getClearanceStats();

        // Get recent payments
        const recentPayments = await paymentQueries.getRecentPayments(10);

        return NextResponse.json({
            stats: {
                totalStudents,
                totalRevenue,
                successfulPayments: paymentStats.successCount,
                pendingPayments: paymentStats.pendingCount,
                clearedCount: clearanceStats.clearedCount,
                unclearedCount: totalStudents - clearanceStats.clearedCount,
            },
            recentPayments,
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        return NextResponse.json(
            { error: 'Failed to load dashboard' },
            { status: 500 }
        );
    }
}
