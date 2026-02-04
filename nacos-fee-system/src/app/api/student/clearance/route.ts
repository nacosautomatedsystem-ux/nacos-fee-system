import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { clearanceQueries, studentQueries, paymentQueries } from '@/lib/db/queries';

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
        const clearance = await clearanceQueries.getClearanceByStudentId(session.userId);

        // Get successful payments
        const payments = await paymentQueries.getSuccessfulPaymentsByStudent(session.userId);

        return NextResponse.json({
            student: {
                fullName: student.full_name,
                matricNumber: student.matric_number,
                department: student.department,
                level: student.level,
            },
            clearance: {
                status: clearance?.status || 'uncleared',
                updatedAt: clearance?.updated_at,
            },
            payments,
        });
    } catch (error) {
        console.error('Clearance error:', error);
        return NextResponse.json(
            { error: 'Failed to load clearance status' },
            { status: 500 }
        );
    }
}
