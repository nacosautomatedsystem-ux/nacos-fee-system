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

        // Generate CSV content
        const headers = ['Reference', 'Student Name', 'Matric Number', 'Email', 'Fee', 'Amount', 'Status', 'Paid At', 'Created At'];
        const rows = payments.map(p => [
            p.reference,
            p.student_name || '',
            p.student_matric || '',
            p.student_email || '',
            p.fee_title,
            p.amount.toString(),
            p.status,
            p.paid_at ? new Date(p.paid_at).toISOString() : '',
            new Date(p.created_at).toISOString(),
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="payments-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}
