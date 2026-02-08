'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';

interface Student {
    fullName: string;
    matricNumber: string;
}

interface Payment {
    id: string;
    reference: string;
    fee_title: string;
    amount: number;
    status: 'pending' | 'success' | 'failed';
    paid_at: string | null;
    created_at: string;
}

interface Fee {
    id: string;
    title: string;
    amount: number;
    session: string;
    isPaid: boolean;
}

function PaymentsContent() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [fees, setFees] = useState<Fee[]>([]);
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<Student | null>(null);
    const [payingFee, setPayingFee] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch student info
                const dashResponse = await fetch('/api/student/dashboard');
                if (dashResponse.ok) {
                    const dashData = await dashResponse.json();
                    setStudent({
                        fullName: dashData.student.fullName,
                        matricNumber: dashData.student.matricNumber,
                    });
                }

                // Fetch payments history
                const paymentsResponse = await fetch('/api/student/payments');
                if (paymentsResponse.ok) {
                    const paymentsData = await paymentsResponse.json();
                    setPayments(paymentsData.payments);
                }

                // Fetch available fees
                const feesResponse = await fetch('/api/student/fees');
                if (feesResponse.ok) {
                    const feesData = await feesResponse.json();
                    setFees(feesData.fees || []);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePayFee = async (feeId: string) => {
        setPayingFee(feeId);
        try {
            const response = await fetch('/api/payments/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feeId }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Failed to initialize payment');
                return;
            }

            // Redirect to Paystack
            window.location.href = data.authorizationUrl;
        } catch {
            alert('Failed to initialize payment');
        } finally {
            setPayingFee(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    // Filter out paid fees from the pending list if desired, or show all with status?
    // The design shows "Pending Fees". So we likely only want unpaid ones.
    const pendingFees = fees.filter(f => !f.isPaid);

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Fee Payment & History</h2>
                </div>
            </header>

            <div className="space-y-8">
                {/* Pending Fees Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                            <span className="material-icons-round text-primary">pending_actions</span>
                            Pending Fees
                        </h3>
                        {pendingFees.length > 0 && (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full uppercase tracking-wider">
                                Action Required
                            </span>
                        )}
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Session</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pendingFees.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                <div className="flex flex-col items-center">
                                                    <span className="material-icons-round text-4xl text-green-500 mb-2">check_circle</span>
                                                    <p>You have no pending fees!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        pendingFees.map((fee) => (
                                            <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5 font-medium text-slate-900">{fee.title}</td>
                                                <td className="px-6 py-5 text-slate-500">{fee.session}</td>
                                                <td className="px-6 py-5 text-right font-bold text-primary">₦{Number(fee.amount).toLocaleString()}</td>
                                                <td className="px-6 py-5">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                                        Unpaid
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        onClick={() => handlePayFee(fee.id)}
                                                        disabled={payingFee === fee.id}
                                                        className="bg-primary hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 mx-auto active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                                    >
                                                        {payingFee === fee.id ? (
                                                            <>
                                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                                Processing
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="material-icons-round text-sm">payment</span>
                                                                Pay Now
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Payment History Section */}
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                            <span className="material-icons-round text-primary">history</span>
                            Payment History
                        </h3>
                        <div className="flex gap-2">
                            <button className="text-sm font-medium text-slate-500 bg-white px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                <span className="material-icons-round text-lg">filter_list</span>
                                Filter
                            </button>
                            <button className="text-sm font-medium text-slate-500 bg-white px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                <span className="material-icons-round text-lg">file_download</span>
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Description</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                                No payment history found.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <p className="font-medium text-slate-900">
                                                        {new Date(payment.paid_at || payment.created_at).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(payment.paid_at || payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5 text-slate-700">{payment.fee_title}</td>
                                                <td className="px-6 py-5 font-semibold text-slate-900">₦{Number(payment.amount).toLocaleString()}</td>
                                                <td className="px-6 py-5 font-mono text-sm text-slate-500">{payment.reference}</td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                        ${payment.status === 'success' ? 'bg-green-100 text-green-700' :
                                                            payment.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                        <span className="material-icons-round text-[14px]">
                                                            {payment.status === 'success' ? 'check_circle' :
                                                                payment.status === 'pending' ? 'pending' : 'error_outline'}
                                                        </span>
                                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {payment.status === 'success' ? (
                                                        <button className="text-primary hover:underline font-semibold flex items-center gap-1 text-sm">
                                                            <span className="material-icons-round text-sm">download</span>
                                                            PDF
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">N/A</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Support Section */}
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                        <span className="material-icons-round">support_agent</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-primary">Need assistance with your payment?</h4>
                        <p className="text-sm text-slate-600">If your payment was successful but reflects as "Failed" or "Pending", please contact the departmental bursar or the NACOS PRO with your transaction reference.</p>
                    </div>
                    <button className="text-primary font-bold hover:underline">Contact Support</button>
                </div>
            </div>

            <footer className="mt-12 py-8 text-center text-slate-500 text-sm border-t border-slate-200">
                <p>© 2026 NACOS SACOETEC Chapter. All Rights Reserved.</p>
                <p className="mt-1">Automated Fee Clearance System v1.0</p>
            </footer>
        </div>
    );
}

export default function StudentPaymentsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-12">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        }>
            <PaymentsContent />
        </Suspense>
    );
}
