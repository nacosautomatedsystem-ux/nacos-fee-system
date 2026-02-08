'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    type: 'info' | 'alert' | 'success' | 'warning';
    is_read: boolean;
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/student/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch('/api/student/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                // Update local state
                setNotifications(notifications.map(n =>
                    n.id === id ? { ...n, is_read: true } : n
                ));
                router.refresh(); // Refresh to update header count if we implement that later
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Notifications</h2>
                <p className="text-slate-500 mt-2">Stay updated with the latest news and announcements.</p>
            </header>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                        className={`p-6 rounded-xl border transition-all cursor-pointer ${notification.is_read
                            ? 'bg-white border-slate-200'
                            : 'bg-blue-50/50 border-blue-100 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-2.5 rounded-full flex-shrink-0 ${notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                notification.type === 'alert' ? 'bg-orange-100 text-orange-600' :
                                    notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                        'bg-slate-100 text-slate-600'
                                }`}>
                                <span className="material-icons-round">
                                    {notification.type === 'info' ? 'info' :
                                        notification.type === 'alert' ? 'priority_high' :
                                            notification.type === 'success' ? 'celebration' :
                                                'notifications'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                    <h3 className={`font-bold text-lg ${notification.is_read ? 'text-slate-800' : 'text-slate-900'}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                        <span className="material-icons-round text-[14px]">schedule</span>
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    {notification.message}
                                </p>
                            </div>
                            {!notification.is_read && (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" title="Mark as read"></div>
                            )}
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-icons-round text-3xl text-slate-400">notifications_off</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No Notifications</h3>
                        <p className="text-slate-500">You're all caught up!</p>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-sm text-slate-500">
                <p>Notifications are automatically deleted after 30 days.</p>
            </div>
        </div>
    );
}
