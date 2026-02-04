import { NextRequest, NextResponse } from 'next/server';
import { paymentQueries, clearanceQueries, feeQueries, studentQueries } from '@/lib/db/queries';
import { verifyPayment } from '@/lib/paystack';
import { sendPaymentConfirmationEmail } from '@/lib/auth/email';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.redirect(new URL('/student/fees?error=invalid_reference', request.url));
        }

        // Get payment record
        const payment = await paymentQueries.getPaymentByReference(reference);
        if (!payment) {
            return NextResponse.redirect(new URL('/student/fees?error=payment_not_found', request.url));
        }

        // If already processed, redirect to appropriate page
        if (payment.status === 'success') {
            return NextResponse.redirect(new URL('/student/payments?status=success', request.url));
        }

        if (payment.status === 'failed') {
            return NextResponse.redirect(new URL('/student/fees?error=payment_failed', request.url));
        }

        // Verify with Paystack
        const verification = await verifyPayment(reference);

        if (!verification || !verification.status) {
            await paymentQueries.updatePaymentStatus(reference, 'failed');
            return NextResponse.redirect(new URL('/student/fees?error=verification_failed', request.url));
        }

        if (verification.data.status === 'success') {
            // Update payment to success
            await paymentQueries.updatePaymentStatus(reference, 'success');

            // Update clearance status to cleared
            await clearanceQueries.setClearanceCleared(payment.student_id);

            // Send confirmation email
            const student = await studentQueries.findStudentById(payment.student_id);
            const fee = await feeQueries.getFeeById(payment.fee_id);

            if (student && fee) {
                await sendPaymentConfirmationEmail(
                    student.email,
                    student.full_name,
                    fee.title,
                    Number(payment.amount),
                    reference
                );
            }

            return NextResponse.redirect(new URL('/student/payments?status=success', request.url));
        } else {
            await paymentQueries.updatePaymentStatus(reference, 'failed');
            return NextResponse.redirect(new URL('/student/fees?error=payment_failed', request.url));
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.redirect(new URL('/student/fees?error=verification_error', request.url));
    }
}
