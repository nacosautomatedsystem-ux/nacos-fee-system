import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { feeQueries, paymentQueries } from '@/lib/db/queries';

export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get active fees
        const activeFees = await feeQueries.getActiveFees();

        // Mark fees as paid or unpaid
        const feesWithStatus = await Promise.all(
            activeFees.map(async (fee) => {
                const isPaid = await paymentQueries.hasStudentPaidFee(session.userId, fee.id);
                return {
                    ...fee,
                    isPaid,
                };
            })
        );

        return NextResponse.json({
            fees: feesWithStatus,
        });
    } catch (error) {
        console.error('Fees error:', error);
        return NextResponse.json(
            { error: 'Failed to load fees' },
            { status: 500 }
        );
    }
}
