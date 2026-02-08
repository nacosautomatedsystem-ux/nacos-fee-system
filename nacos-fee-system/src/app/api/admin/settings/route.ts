import { NextResponse } from 'next/server';
import { settingsQueries } from '@/lib/db/queries';

// GET /api/admin/settings - Fetch all settings
export async function GET() {
    try {
        const settings = await settingsQueries.getSettings();

        // Transform array of settings into a key-value object (or keep as array depending on frontend need)
        // Frontend likely expects a map of key -> value
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json(settingsMap);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Body should be an object of key-value pairs to update
        // e.g. { active_session: '2025/2026', maintenance_mode: true }

        const updates = Object.entries(body);
        const results = [];

        // Loop through each key-value pair and update/upsert
        for (const [key, value] of updates) {
            const result = await settingsQueries.updateSetting(key, value);
            results.push(result);
        }

        return NextResponse.json({ success: true, updated: results });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
