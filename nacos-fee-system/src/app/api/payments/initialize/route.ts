import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { feeQueries, paymentQueries, studentQueries } from '@/lib/db/queries';
import { initializePayment, generatePaymentReference } from '@/lib/paystack';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { feeId } = body;

        if (!feeId) {
            return NextResponse.json(
                { error: 'Fee ID is required' },
                { status: 400 }
            );
        }

        // Get student
        const student = await studentQueries.findStudentById(session.userId);
        if (!student) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        // Check if email is verified
        if (!student.email_verified) {
            return NextResponse.json(
                { error: 'Please verify your email before making payments' },
                { status: 403 }
            );
        }

        // Get fee
        const fee = await feeQueries.getFeeById(feeId);
        if (!fee) {
            return NextResponse.json(
                { error: 'Fee not found' },
                { status: 404 }
            );
        }

        if (!fee.is_active) {
            return NextResponse.json(
                { error: 'This fee is no longer active' },
                { status: 400 }
            );
        }

        // Check if already paid
        const alreadyPaid = await paymentQueries.hasStudentPaidFee(session.userId, feeId);
        if (alreadyPaid) {
            return NextResponse.json(
                { error: 'You have already paid this fee' },
                { status: 400 }
            );
        }

        // Generate payment reference
        const reference = generatePaymentReference();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const callbackUrl = `${appUrl}/api/payments/verify?reference=${reference}`;

        // Create payment record (pending)
        const payment = await paymentQueries.createPayment({
            studentId: session.userId,
            feeId: feeId,
            reference,
            amount: Number(fee.amount),
        });

        if (!payment) {
            return NextResponse.json(
                { error: 'Failed to create payment' },
                { status: 500 }
            );
        }

        // Initialize Paystack payment
        const paystackResponse = await initializePayment(
            student.email,
            Number(fee.amount),
            reference,
            callbackUrl,
            {
                student_id: session.userId,
                fee_id: feeId,
                fee_title: fee.title,
                student_name: student.full_name,
                matric_number: student.matric_number,
            }
        );

        if (!paystackResponse || !paystackResponse.status) {
            return NextResponse.json(
                { error: 'Failed to initialize payment' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            authorizationUrl: paystackResponse.data.authorization_url,
            reference: paystackResponse.data.reference,
        });
    } catch (error) {
        console.error('Payment initialization error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
