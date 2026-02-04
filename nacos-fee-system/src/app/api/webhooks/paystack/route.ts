import { NextRequest, NextResponse } from 'next/server';
import { paymentQueries, clearanceQueries, feeQueries, studentQueries } from '@/lib/db/queries';
import { verifyWebhookSignature } from '@/lib/paystack';
import { sendPaymentConfirmationEmail } from '@/lib/auth/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-paystack-signature');

        // Verify webhook signature
        if (!signature || !verifyWebhookSignature(body, signature)) {
            console.error('Invalid Paystack webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = JSON.parse(body);

        // Handle charge.success event
        if (event.event === 'charge.success') {
            const { reference, status } = event.data;

            if (status === 'success') {
                // Get payment record
                const payment = await paymentQueries.getPaymentByReference(reference);

                if (!payment) {
                    console.error('Payment not found for reference:', reference);
                    return NextResponse.json({ received: true });
                }

                // Skip if already processed
                if (payment.status === 'success') {
                    console.log('Payment already processed:', reference);
                    return NextResponse.json({ received: true });
                }

                // Update payment status
                await paymentQueries.updatePaymentStatus(reference, 'success');

                // Update clearance status
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

                console.log('Payment processed successfully via webhook:', reference);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
