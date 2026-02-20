import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { studentQueries, clearanceQueries, paymentQueries, feeQueries } from '@/lib/db/queries';

export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get student details
        const student = await studentQueries.findStudentById(session.userId);

        if (!student) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        // Get clearance status
        const clearance = await clearanceQueries.getClearanceByStudentId(student.id);
        const clearanceStatus = clearance?.status || 'uncleared';
        const clearanceId = clearance?.id || null;

        // Get payments
        const payments = await paymentQueries.getPaymentsByStudentId(student.id);
        const successfulPayments = payments.filter(p => p.status === 'success');

        // Get active fees and check which are paid
        const activeFees = await feeQueries.getActiveFees();
        const unpaidFees = [];
        for (const fee of activeFees) {
            const isPaid = await paymentQueries.hasStudentPaidFee(student.id, fee.id);
            if (!isPaid) {
                unpaidFees.push(fee);
            }
        }

        // Calculate total amount paid
        const totalPaid = successfulPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const totalOutstanding = unpaidFees.reduce((sum, f) => sum + Number(f.amount), 0);

        return NextResponse.json({
            student: {
                id: student.id,
                fullName: student.full_name,
                matricNumber: student.matric_number,
                email: student.email,
                department: student.department,
                level: student.level,
            },
            clearanceStatus,
            clearanceId,
            summary: {
                totalPaid,
                totalOutstanding,
                paidFeesCount: successfulPayments.length,
                unpaidFeesCount: unpaidFees.length,
            },
            recentPayments: successfulPayments.slice(0, 5),
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: 'Failed to load dashboard' },
            { status: 500 }
        );
    }
}
