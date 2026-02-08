import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { notificationQueries } from '@/lib/db/queries';

export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const notifications = await notificationQueries.getNotificationsByStudentId(session.userId);

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Notification ID is required' },
                { status: 400 }
            );
        }

        await notificationQueries.markNotificationAsRead(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json(
            { error: 'Failed to update notification' },
            { status: 500 }
        );
    }
}
