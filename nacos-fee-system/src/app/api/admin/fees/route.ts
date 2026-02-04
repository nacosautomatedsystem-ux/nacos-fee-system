import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { feeQueries } from '@/lib/db/queries';

export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }


        const fees = await feeQueries.getActiveFees();

        return NextResponse.json({
            fees,
        });
    } catch (error) {
        console.error('Admin fees error:', error);
        return NextResponse.json(
            { error: 'Failed to load fees' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, amount, session: academicSession } = body;

        if (!title || !amount || !academicSession) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const fee = await feeQueries.createFee({
            title,
            amount: Number(amount),
            session: academicSession,
        });

        if (!fee) {
            return NextResponse.json(
                { error: 'Failed to create fee' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            fee,
        });
    } catch (error) {
        console.error('Create fee error:', error);
        return NextResponse.json(
            { error: 'Failed to create fee' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, title, amount, session: academicSession, is_active } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Fee ID is required' },
                { status: 400 }
            );
        }

        const fee = await feeQueries.updateFee(id, {
            title,
            amount: amount ? Number(amount) : undefined,
            session: academicSession,
            is_active,
        });

        if (!fee) {
            return NextResponse.json(
                { error: 'Failed to update fee' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            fee,
        });
    } catch (error) {
        console.error('Update fee error:', error);
        return NextResponse.json(
            { error: 'Failed to update fee' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Fee ID is required' },
                { status: 400 }
            );
        }

        try {
            await feeQueries.deleteFee(id);
        } catch (error: any) {
            // If FK violation (payments exist), soft delete instead
            if (error.code === '23503') {
                await feeQueries.updateFee(id, { is_active: false });
                return NextResponse.json({
                    success: true,
                    message: 'Fee deactivated as it has associated payments'
                });
            }
            throw error;
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error('Delete fee error:', error);
        return NextResponse.json(
            { error: 'Failed to delete fee' },
            { status: 500 }
        );
    }
}
