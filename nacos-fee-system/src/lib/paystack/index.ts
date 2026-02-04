// Paystack integration utilities

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data: {
        status: string;
        reference: string;
        amount: number;
        paid_at: string;
        channel: string;
        currency: string;
        customer: {
            email: string;
        };
    };
}

/**
 * Initialize a payment transaction with Paystack
 */
export async function initializePayment(
    email: string,
    amount: number, // Amount in Naira
    reference: string,
    callbackUrl: string,
    metadata?: Record<string, unknown>
): Promise<PaystackInitializeResponse | null> {
    try {
        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: amount * 100, // Convert to kobo
                reference,
                callback_url: callbackUrl,
                metadata,
            }),
        });

        const data = await response.json();
        return data as PaystackInitializeResponse;
    } catch (error) {
        console.error('Paystack initialize error:', error);
        return null;
    }
}

/**
 * Verify a payment transaction with Paystack
 */
export async function verifyPayment(
    reference: string
): Promise<PaystackVerifyResponse | null> {
    try {
        const response = await fetch(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        return data as PaystackVerifyResponse;
    } catch (error) {
        console.error('Paystack verify error:', error);
        return null;
    }
}

/**
 * Verify Paystack webhook signature
 */
export function verifyWebhookSignature(
    body: string,
    signature: string
): boolean {
    const crypto = require('crypto');
    const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(body)
        .digest('hex');
    return hash === signature;
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `NACOS-${timestamp}-${random}`.toUpperCase();
}
