import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { studentQueries } from '@/lib/db/queries';

export async function PUT(request: Request) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await request.json();

        // Basic validation
        if (!data.fullName || !data.department || !data.level) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Only allow updating specific fields for security
        // Matric number and email should typically not be changeable here
        const updatedStudent = await studentQueries.updateStudent(session.userId, {
            full_name: data.fullName,
            department: data.department,
            level: data.level,
        });

        if (!updatedStudent) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            student: {
                id: updatedStudent.id,
                fullName: updatedStudent.full_name,
                matricNumber: updatedStudent.matric_number,
                email: updatedStudent.email,
                department: updatedStudent.department,
                level: updatedStudent.level,
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
