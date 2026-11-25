import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Grid,
  CalendarPlus,
  ClipboardList,
  CreditCard,
  MessageSquare,
  LogOut,
  Star,
  AlertCircle,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SERVICES, ServiceItem } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { Booking } from './Booking';

type UserTab =
  | 'overview'
  | 'browse'
  | 'book'
  | 'bookings'
  | 'payments'
  | 'reviews';

interface UserDashboardProps {
  initialTab?: UserTab;
  initialServiceId?: string;
  onViewDetails: (service: ServiceItem) => void;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  initialTab = 'overview',
  initialServiceId,
  onViewDetails,
  onLogout,
}) => {
  const {
    session,
    bookings,
    payments,
    reviews,
    cancelBooking,
    submitReview,
  } = useApp();

  const [activeTab, setActiveTab] = useState<UserTab>(initialTab);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<
    string | undefined
  >(initialServiceId);

  // Browse search
  const [searchQuery, setSearchQuery] = useState('');

  // Feedback form state
  const [reviewBookingId, setReviewBookingId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Status feedback banner on actions
  const [actionMsg, setActionMsg] = useState('');

  const userBookings = useMemo(
    () => bookings.filter((b) => b.userId === session?.userId),
    [bookings, session?.userId]
  );

  const userPayments = useMemo(
    () => payments.filter((p) => p.userId === session?.userId),
    [payments, session?.userId]
  );

  const userReviews = useMemo(
    () => reviews.filter((r) => r.userId === session?.userId),
    [reviews, session?.userId]
  );

  const reviewedBookingIds = useMemo(
    () => new Set(reviews.map((r) => r.bookingId)),
    [reviews]
  );

  const eligibleReviewBookings = useMemo(
    () =>
      userBookings.filter(
        (b) => b.status === 'Completed' && !reviewedBookingIds.has(b.id)
      ),
    [userBookings, reviewedBookingIds]
  );

  const stats = useMemo(() => {
    const pending = userBookings.filter((b) => b.status === 'Pending').length;
    const completed = userBookings.filter((b) => b.status === 'Completed').length;
    const cancelled = userBookings.filter((b) => b.status === 'Cancelled').length;
    return {
      total: userBookings.length,
      pending,
      completed,
      cancelled,
    };
  }, [userBookings]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SERVICES;
    return SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleBookFromBrowse = (service: ServiceItem) => {
    setSelectedServiceForBooking(service.id);
    setActiveTab('book');
  };

  const handleCancelBooking = (bookingId: string) => {
    const res = cancelBooking(bookingId);
    setActionMsg(res.message);
  };

  const handleOpenReviewForBooking = (bookingId: string) => {
    setReviewBookingId(bookingId);
    setReviewError('');
    setReviewSuccess('');
    setActiveTab('reviews');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    const targetId =
      reviewBookingId ||
      (eligibleReviewBookings.length > 0 ? eligibleReviewBookings[0].id : '');

    if (!targetId) {
      setReviewError('Please select a completed booking to review.');
      return;
    }
    if (!comment.trim()) {
      setReviewError('Please write your feedback comment.');
      return;
    }

    const res = submitReview({
      bookingId: targetId,
      rating,
      comment,
    });

    if (!res.ok) {
      setReviewError(res.message);
      return;
    }

    setReviewSuccess(res.message);
    setComment('');
    setRating(5);
    setReviewBookingId('');
  };

  const navItems: { id: UserTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'browse',
      label: 'Browse Services',
      icon: <Grid className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'book',
      label: 'Book a Service',
      icon: <CalendarPlus className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: <ClipboardList className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'payments',
      label: 'Payment Details',
      icon: <CreditCard className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'reviews',
      label: 'My Reviews',
      icon: <MessageSquare className="h-4 w-4 shrink-0" />,
    },
  ];

  const getStatusClass = (status: string) => {
    if (status === 'Completed' || status === 'Paid') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (status === 'Cancelled') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-4">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-medium text-blue-700">Customer Account</p>
            <p className="mt-0.5 font-display text-base font-bold text-slate-900 truncate">
              {session?.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{session?.email}</p>
          </div>

          <nav
            aria-label="User dashboard navigation"
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

          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Welcome, {session?.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Manage your home service bookings, payments, and reviews from
                    one place.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('book')}
                  className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Book New Service
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-slate-500">Total Bookings</p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                    {stats.total}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-amber-700">Pending</p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                    {stats.pending}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-emerald-700">Completed</p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                    {stats.completed}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-rose-700">Cancelled</p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                    {stats.cancelled}
                  </p>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Recent Bookings
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {userBookings.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    You haven't booked any services yet. Click "Book New Service" to
                    schedule your first visit.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                        <tr>
                          <th className="px-5 py-3">Booking ID</th>
                          <th className="px-5 py-3">Service</th>
                          <th className="px-5 py-3">Date & Slot</th>
                          <th className="px-5 py-3">Payment</th>
                          <th className="px-5 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {userBookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="px-5 py-3.5 font-mono text-xs font-semibold text-blue-700">
                              {b.id}
                            </td>
                            <td className="px-5 py-3.5 font-medium text-slate-900">
                              {b.serviceName}
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 tabular-nums">
                              {b.date} · {b.timeSlot}
                            </td>
                            <td className="px-5 py-3.5 text-slate-700 tabular-nums">
                              ₹{b.price} ({b.paymentMethod})
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
                                  b.status
                                )}`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Browse Services */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6">
                <div>
                  <h1 className="font-display text-xl font-bold text-slate-900">
                    Browse Services
                  </h1>
                  <p className="text-sm text-slate-600">
                    Select any service to view details or schedule a booking.
                  </p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services..."
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredServices.map((srv) => (
                  <ServiceCard
                    key={srv.id}
                    service={srv}
                    onBookNow={handleBookFromBrowse}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. Book a Service */}
          {activeTab === 'book' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h1 className="font-display text-xl font-bold text-slate-900">
                  Book a Service
                </h1>
                <p className="text-sm text-slate-600">
                  Choose a service, date, time slot, and payment option.
                </p>
              </div>
              <Booking
                embedded
                initialServiceId={selectedServiceForBooking}
                onViewBookings={() => setActiveTab('bookings')}
              />
            </div>
          )}

          {/* 4. My Bookings */}
          {activeTab === 'bookings' && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h1 className="font-display text-xl font-bold text-slate-900">
                    My Bookings
                  </h1>
                  <p className="text-sm text-slate-600">
                    Track booking status, cancel pending requests, or review
                    completed services.
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {userBookings.length} total
                </span>
              </div>

              {userBookings.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-sm text-slate-600">No bookings found yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('book')}
                    className="mt-3 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 cursor-pointer"
                  >
                    Book a Service
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Booking ID</th>
                        <th className="px-4 py-3">Service Name</th>
                        <th className="px-4 py-3">Date & Time Slot</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Payment Method</th>
                        <th className="px-4 py-3">Payment Status</th>
                        <th className="px-4 py-3">Booking Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userBookings.map((b) => {
                        const isReviewed = reviewedBookingIds.has(b.id);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50 align-top">
                            <td className="px-4 py-3.5 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">
                              {b.id}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-semibold text-slate-900">
                                {b.serviceName}
                              </span>
                              <p className="mt-0.5 text-xs text-slate-500 max-w-xs">
                                {b.address}
                              </p>
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 tabular-nums whitespace-nowrap">
                              <div>{b.date}</div>
                              <div className="text-xs text-slate-500">{b.timeSlot}</div>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                              ₹{b.price}
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                              {b.paymentMethod}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span
                                className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${getStatusClass(
                                  b.paymentStatus
                                )}`}
                              >
                                {b.paymentStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span
                                className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${getStatusClass(
                                  b.status
                                )}`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              {b.status === 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelBooking(b.id)}
                                  className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                              {b.status === 'Completed' && !isReviewed && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReviewForBooking(b.id)}
                                  className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer"
                                >
                                  Rate & Review
                                </button>
                              )}
                              {b.status === 'Completed' && isReviewed && (
                                <span className="text-xs text-slate-500">Reviewed</span>
                              )}
                              {b.status === 'Cancelled' && (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 5. Payment Details */}
          {activeTab === 'payments' && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-4">
                <h1 className="font-display text-xl font-bold text-slate-900">
                  Payment Details
                </h1>
                <p className="text-sm text-slate-600">
                  Record of your Cash and Scan to Pay transactions.
                </p>
              </div>

              {userPayments.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No payment records available yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <tr>
                        <th className="px-5 py-3">Payment ID</th>
                        <th className="px-5 py-3">Booking ID</th>
                        <th className="px-5 py-3">Service</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Method</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-800">
                            {p.id}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-blue-700">
                            {p.bookingId}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-slate-900">
                            {p.serviceName}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900 tabular-nums">
                            ₹{p.amount}
                          </td>
                          <td className="px-5 py-3.5 text-slate-700">{p.method}</td>
                          <td className="px-5 py-3.5 text-slate-600 tabular-nums">
                            {p.date}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
                                p.status
                              )}`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 6. My Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Submit Feedback Form */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h1 className="font-display text-xl font-bold text-slate-900">
                  Submit Rating & Feedback
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Feedback can be submitted once per completed booking.
                </p>

                {reviewSuccess && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{reviewSuccess}</span>
                  </div>
                )}

                {reviewError && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{reviewError}</span>
                  </div>
                )}

                {eligibleReviewBookings.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    You have no unreviewed completed bookings right now. Once the
                    admin marks a booking as Completed, you can rate it here.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
                    <div>
                      <label
                        htmlFor="review-booking"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Select Completed Booking
                      </label>
                      <select
                        id="review-booking"
                        value={reviewBookingId || eligibleReviewBookings[0].id}
                        onChange={(e) => setReviewBookingId(e.target.value)}
                        className="mt-1.5 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      >
                        {eligibleReviewBookings.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.id} — {b.serviceName} ({b.date})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="block text-sm font-medium text-slate-700">
                        Rating
                      </span>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            aria-label={`Rate ${star} stars`}
                            className="rounded p-1 hover:bg-slate-100 cursor-pointer"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm font-medium text-slate-700 tabular-nums">
                          {rating} / 5
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="review-comment"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Your Feedback
                      </label>
                      <textarea
                        id="review-comment"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share how the technician performed and overall service quality..."
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>

              {/* Previously Submitted Reviews */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  My Submitted Reviews ({userReviews.length})
                </h2>

                {userReviews.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">
                    You have not submitted any reviews yet.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {userReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-slate-900">
                              {rev.serviceName}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="font-mono text-xs text-blue-700">
                              {rev.bookingId}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
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
                        <p className="mt-2 text-sm text-slate-700">{rev.comment}</p>
                        <p className="mt-2 text-xs text-slate-400 tabular-nums">
                          Submitted on {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
