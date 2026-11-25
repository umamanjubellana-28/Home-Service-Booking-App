import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  MessageSquare,
  LogOut,
  Search,
  Star,
} from 'lucide-react';
import { useApp, BookingRecord } from '../context/AppContext';
import { SERVICES } from '../data/services';

type AdminTab =
  | 'overview'
  | 'all-bookings'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'payments'
  | 'feedback';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const {
    users,
    bookings,
    payments,
    reviews,
    completeBooking,
    cancelBooking,
    markPaymentPaid,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const registeredCustomers = useMemo(
    () => users.filter((u) => u.role === 'user'),
    [users]
  );

  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'Pending'),
    [bookings]
  );

  const completedBookings = useMemo(
    () => bookings.filter((b) => b.status === 'Completed'),
    [bookings]
  );

  const cancelledBookings = useMemo(
    () => bookings.filter((b) => b.status === 'Cancelled'),
    [bookings]
  );

  const totalPaidAmount = useMemo(
    () =>
      payments
        .filter((p) => p.status === 'Paid')
        .reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  // Service-wise booking breakdown
  const serviceWiseSummary = useMemo(() => {
    return SERVICES.map((srv) => {
      const srvBookings = bookings.filter((b) => b.serviceId === srv.id);
      const pending = srvBookings.filter((b) => b.status === 'Pending').length;
      const completed = srvBookings.filter((b) => b.status === 'Completed').length;
      const cancelled = srvBookings.filter((b) => b.status === 'Cancelled').length;
      const revenue = srvBookings
        .filter((b) => b.status !== 'Cancelled')
        .reduce((sum, b) => sum + b.price, 0);

      return {
        id: srv.id,
        name: srv.name,
        price: srv.price,
        total: srvBookings.length,
        pending,
        completed,
        cancelled,
        revenue,
      };
    });
  }, [bookings]);

  const filterBookings = (list: BookingRecord[]) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.phone.includes(q)
    );
  };

  const handleMarkCompleted = (bookingId: string) => {
    const res = completeBooking(bookingId);
    setActionMsg(res.message);
  };

  const handleCancel = (bookingId: string) => {
    const res = cancelBooking(bookingId);
    setActionMsg(res.message);
  };

  const handleMarkPaid = (bookingId: string) => {
    const res = markPaymentPaid(bookingId);
    setActionMsg(res.message);
  };

  const getStatusClass = (status: string) => {
    if (status === 'Completed' || status === 'Paid') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (status === 'Cancelled') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'all-bookings',
      label: `All Bookings (${bookings.length})`,
      icon: <ClipboardList className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'pending',
      label: `Pending Bookings (${pendingBookings.length})`,
      icon: <Clock className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'completed',
      label: `Completed Bookings (${completedBookings.length})`,
      icon: <CheckCircle2 className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'cancelled',
      label: `Cancelled Bookings (${cancelledBookings.length})`,
      icon: <XCircle className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'payments',
      label: 'Payment Records',
      icon: <CreditCard className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'feedback',
      label: `Customer Feedback (${reviews.length})`,
      icon: <MessageSquare className="h-4 w-4 shrink-0" />,
    },
  ];

  const renderBookingsTable = (title: string, rawList: BookingRecord[]) => {
    const rows = filterBookings(rawList);

    return (
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900">
              {title}
            </h1>
            <p className="text-sm text-slate-600 tabular-nums">
              Showing {rows.length} {rows.length === 1 ? 'record' : 'records'}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, customer, service..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No bookings found in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date & Slot</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 align-top">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">
                      {b.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">
                        {b.customerName}
                      </div>
                      <div className="text-xs text-slate-500 tabular-nums">
                        {b.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {b.serviceName}
                      </div>
                      <div className="text-xs font-semibold text-slate-600 tabular-nums">
                        ₹{b.price}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 tabular-nums whitespace-nowrap">
                      <div>{b.date}</div>
                      <div className="text-xs text-slate-500">{b.timeSlot}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 max-w-[210px]">
                      {b.address}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="text-xs font-medium text-slate-800">
                        {b.paymentMethod}
                      </div>
                      <span
                        className={`mt-1 inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${getStatusClass(
                          b.paymentStatus
                        )}`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        {b.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleMarkCompleted(b.id)}
                              className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              Mark Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancel(b.id)}
                              className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          </>
                        )}
                        {b.paymentStatus === 'Pending' &&
                          b.status !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleMarkPaid(b.id)}
                              className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          )}
                        {(b.status === 'Completed' && b.paymentStatus === 'Paid') ||
                        b.status === 'Cancelled' ? (
                          <span className="text-xs text-slate-400">No actions</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Admin Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-4">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-semibold text-blue-700">Admin Panel</p>
            <p className="mt-0.5 font-display text-base font-bold text-slate-900">
              System Administrator
            </p>
            <p className="text-xs text-slate-500">admin@homeservices.com</p>
          </div>

          <nav
            aria-label="Admin dashboard navigation"
            className="mt-3 flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setActionMsg('');
                }}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 whitespace-nowrap shrink-0 lg:mt-3 lg:border-t lg:border-slate-100 lg:pt-3 cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 space-y-6">
          {actionMsg && (
            <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              <span>{actionMsg}</span>
              <button
                type="button"
                onClick={() => setActionMsg('')}
                className="text-xs font-semibold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 1. Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h1 className="font-display text-2xl font-bold text-slate-900">
                  Admin Dashboard Overview
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Real-time summary of registered users, bookings, payments, and
                  service-wise demand.
                </p>
              </div>

              {/* 6 Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-slate-500">
                    Total Registered Users
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                    {registeredCustomers.length}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-slate-500">Total Bookings</p>
                  <p className="mt-2 font-display text-3xl font-bold text-blue-700 tabular-nums">
                    {bookings.length}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-amber-700">
                    Pending Bookings
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                    {pendingBookings.length}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-emerald-700">
                    Completed Bookings
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                    {completedBookings.length}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-rose-700">
                    Cancelled Bookings
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                    {cancelledBookings.length}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-slate-500">
                    Total Collected Payments
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-emerald-700 tabular-nums">
                    ₹{totalPaidAmount}
                  </p>
                </div>
              </div>

              {/* Service-wise Booking Details */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Service-wise Booking Details
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <tr>
                        <th className="px-5 py-3">Service Name</th>
                        <th className="px-5 py-3 text-right">Base Price</th>
                        <th className="px-5 py-3 text-right">Total Bookings</th>
                        <th className="px-5 py-3 text-right">Pending</th>
                        <th className="px-5 py-3 text-right">Completed</th>
                        <th className="px-5 py-3 text-right">Cancelled</th>
                        <th className="px-5 py-3 text-right">Active Order Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {serviceWiseSummary.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-semibold text-slate-900">
                            {row.name}
                          </td>
                          <td className="px-5 py-3 text-right text-slate-700 tabular-nums">
                            ₹{row.price}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold text-slate-900 tabular-nums">
                            {row.total}
                          </td>
                          <td className="px-5 py-3 text-right text-amber-700 tabular-nums">
                            {row.pending}
                          </td>
                          <td className="px-5 py-3 text-right text-emerald-700 tabular-nums">
                            {row.completed}
                          </td>
                          <td className="px-5 py-3 text-right text-rose-700 tabular-nums">
                            {row.cancelled}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold text-blue-700 tabular-nums">
                            ₹{row.revenue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. All Bookings */}
          {activeTab === 'all-bookings' &&
            renderBookingsTable('All Customer Bookings', bookings)}

          {/* 3. Pending Bookings */}
          {activeTab === 'pending' &&
            renderBookingsTable('Pending Bookings', pendingBookings)}

          {/* 4. Completed Bookings */}
          {activeTab === 'completed' &&
            renderBookingsTable('Completed Bookings', completedBookings)}

          {/* 5. Cancelled Bookings */}
          {activeTab === 'cancelled' &&
            renderBookingsTable('Cancelled Bookings', cancelledBookings)}

          {/* 6. Payment Records */}
          {activeTab === 'payments' && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-4">
                <h1 className="font-display text-xl font-bold text-slate-900">
                  Payment Records
                </h1>
                <p className="text-sm text-slate-600">
                  View all Cash and Scan to Pay records and mark Cash payments as
                  Paid.
                </p>
              </div>

              {payments.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No payment records available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Payment ID</th>
                        <th className="px-4 py-3">Booking ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-800">
                            {p.id}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs font-semibold text-blue-700">
                            {p.bookingId}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-900">
                            {p.customerName}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700">
                            {p.serviceName}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-900 tabular-nums">
                            ₹{p.amount}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700">{p.method}</td>
                          <td className="px-4 py-3.5 text-slate-600 tabular-nums">
                            {p.date}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
                                p.status
                              )}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {p.status === 'Pending' ? (
                              <button
                                type="button"
                                onClick={() => handleMarkPaid(p.bookingId)}
                                className="rounded-md bg-blue-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-800 cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 7. Customer Feedback */}
          {activeTab === 'feedback' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="font-display text-xl font-bold text-slate-900">
                  Customer Ratings & Feedback
                </h1>
                <p className="text-sm text-slate-600">
                  All reviews submitted by customers after service completion.
                </p>
              </div>

              {reviews.length === 0 ? (
                <p className="mt-6 text-center text-sm text-slate-500">
                  No customer feedback submitted yet.
                </p>
              ) : (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {rev.customerName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {rev.serviceName} ·{' '}
                            <span className="font-mono text-blue-700">
                              {rev.bookingId}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2.5 text-sm text-slate-700">{rev.comment}</p>
                      <p className="mt-2 text-xs text-slate-400 tabular-nums">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
