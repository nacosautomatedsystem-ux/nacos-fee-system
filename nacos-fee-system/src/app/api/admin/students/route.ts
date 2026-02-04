import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { studentQueries, clearanceQueries } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        // Get all students with clearance status using searchStudents
        const students = await studentQueries.searchStudents(search || undefined, status || undefined);

        // Transform to expected format
        const formattedStudents = students.map((student) => ({
            id: student.id,
            fullName: student.full_name,
            matricNumber: student.matric_number,
            email: student.email,
            department: student.department,
            level: student.level,
            emailVerified: student.email_verified,
            clearanceStatus: student.clearance_status || 'uncleared',
            createdAt: student.created_at,
        }));

        return NextResponse.json({
            students: formattedStudents,
            total: formattedStudents.length,
        });
    } catch (error) {
        console.error('Admin students error:', error);
        return NextResponse.json(
            { error: 'Failed to load students' },
            { status: 500 }
        );
    }
}
