import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wallet,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { SERVICES, TIME_SLOTS } from '../data/services';
import {
  useApp,
  PaymentMethod,
  BookingRecord,
  PaymentRecord,
} from '../context/AppContext';
import { QrCodeBox } from '../components/QrCodeBox';

interface BookingFormProps {
  initialServiceId?: string;
  embedded?: boolean;
  onViewBookings?: () => void;
}

export const Booking: React.FC<BookingFormProps> = ({
  initialServiceId,
  embedded = false,
  onViewBookings,
}) => {
  const { session, createBooking } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState(session?.name || '');
  const [phone, setPhone] = useState(session?.phone || '');
  const [serviceId, setServiceId] = useState(initialServiceId || SERVICES[0].id);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [scanPaid, setScanPaid] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<{
    booking: BookingRecord;
    payment: PaymentRecord;
  } | null>(null);

  useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
      setScanPaid(false);
    }
  }, [initialServiceId]);

  const selectedService =
    SERVICES.find((s) => s.id === serviceId) || SERVICES[0];

  const handleServiceChange = (newId: string) => {
    setServiceId(newId);
    setScanPaid(false);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'Cash') {
      setScanPaid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please enter customer name.');
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!date) {
      setError('Please select a booking date.');
      return;
    }
    if (!timeSlot) {
      setError('Please select a preferred time slot.');
      return;
    }
    if (address.trim().length < 8) {
      setError('Please enter your complete service address.');
      return;
    }
    if (paymentMethod === 'Scan to Pay' && !scanPaid) {
      setError(
        'Please click "Simulate Payment Now" in the QR panel before confirming your booking.'
      );
      return;
    }

    const result = createBooking({
      customerName,
      phone,
      serviceId: selectedService.id,
      date,
      timeSlot,
      address,
      paymentMethod,
      scanPaymentConfirmed: scanPaid,
    });

    if (!result.ok || !result.booking || !result.payment) {
      setError(result.message);
      return;
    }

    setConfirmation({
      booking: result.booking,
      payment: result.payment,
    });
  };

  const resetForm = () => {
    setConfirmation(null);
    setDate('');
    setTimeSlot('');
    setAddress('');
    setPaymentMethod('Cash');
    setScanPaid(false);
    setError('');
  };

  if (confirmation) {
    const { booking, payment } = confirmation;
    return (
      <div className={embedded ? '' : 'mx-auto max-w-2xl px-4 py-10'}>
        <div className="rounded-xl border border-emerald-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="h-7 w-7 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Booking Confirmed
              </h2>
              <p className="text-sm text-slate-600">
                Your service request has been scheduled and saved.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm">
            <div>
              <span className="block text-xs text-slate-500">Booking ID</span>
              <span className="font-mono font-semibold text-blue-700">
                {booking.id}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">Payment ID</span>
              <span className="font-mono font-semibold text-slate-900">
                {payment.id}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">Service</span>
              <span className="font-semibold text-slate-900">
                {booking.serviceName}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">Amount</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                ₹{booking.price}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">Date</span>
              <span className="font-medium text-slate-800 tabular-nums">
                {booking.date}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">Time Slot</span>
              <span className="font-medium text-slate-800">{booking.timeSlot}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">Payment Method</span>
              <span className="font-medium text-slate-800">
                {booking.paymentMethod} ({booking.paymentStatus})
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">Booking Status</span>
              <span className="font-medium text-amber-700">{booking.status}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-xs text-slate-500">Service Address</span>
              <span className="font-medium text-slate-800">{booking.address}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {onViewBookings && (
              <button
                type="button"
                onClick={onViewBookings}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 cursor-pointer"
              >
                <span>View My Bookings</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? '' : 'mx-auto max-w-4xl px-4 sm:px-6 py-10'}>
      {!embedded && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-700">Schedule Service</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900">
            Book a Home Service
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Choose your preferred date, two-hour time slot, address, and payment
            method.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="bk-name"
                className="block text-sm font-medium text-slate-700"
              >
                Customer Name
              </label>
              <input
                id="bk-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="bk-phone"
                className="block text-sm font-medium text-slate-700"
              >
                Mobile Number
              </label>
              <input
                id="bk-phone"
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Service & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="bk-service"
                className="block text-sm font-medium text-slate-700"
              >
                Selected Service
              </label>
              <select
                id="bk-service"
                value={serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                {SERVICES.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} — ₹{srv.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="bk-price"
                className="block text-sm font-medium text-slate-700"
              >
                Service Price
              </label>
              <input
                id="bk-price"
                type="text"
                readOnly
                value={`₹${selectedService.price}`}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-display text-sm font-bold text-slate-900 tabular-nums"
              />
            </div>
          </div>

          {/* Booking Date & Preferred Time Slot */}
          <div>
            <label
              htmlFor="bk-date"
              className="block text-sm font-medium text-slate-700"
            >
              Booking Date
            </label>
            <div className="relative mt-1.5 max-w-xs">
              <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="bk-date"
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700">
              Preferred Time Slot
            </span>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                    timeSlot === slot
                      ? 'border-blue-700 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="tabular-nums">{slot}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Complete Address */}
          <div>
            <label
              htmlFor="bk-address"
              className="block text-sm font-medium text-slate-700"
            >
              Complete Address
            </label>
            <textarea
              id="bk-address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat No., Building Name, Street, Landmark, City & Pincode"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Payment Method */}
          <div>
            <span className="block text-sm font-medium text-slate-700">
              Payment Method
            </span>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('Cash')}
                className={`flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors cursor-pointer ${
                  paymentMethod === 'Cash'
                    ? 'border-blue-700 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <Wallet
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    paymentMethod === 'Cash' ? 'text-blue-700' : 'text-slate-400'
                  }`}
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">
                    Cash Payment
                  </span>
                  <span className="block text-xs text-slate-500">
                    Pay cash after service completion (Status: Pending)
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePaymentMethodChange('Scan to Pay')}
                className={`flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors cursor-pointer ${
                  paymentMethod === 'Scan to Pay'
                    ? 'border-blue-700 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <QrCode
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    paymentMethod === 'Scan to Pay'
                      ? 'text-blue-700'
                      : 'text-slate-400'
                  }`}
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">
                    Scan to Pay
                  </span>
                  <span className="block text-xs text-slate-500">
                    Simulate instant QR payment now (Status: Paid)
                  </span>
                </div>
              </button>
            </div>
          </div>

          {paymentMethod === 'Scan to Pay' && (
            <QrCodeBox
              amount={selectedService.price}
              serviceName={selectedService.name}
              isPaid={scanPaid}
              onConfirmPayment={() => {
                setScanPaid(true);
                setError('');
              }}
            />
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 cursor-pointer"
          >
            Confirm Booking
          </button>
        </div>

        {/* Summary Side Card */}
        <aside className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="font-display text-base font-bold text-slate-900">
            Booking Summary
          </h2>
          <div className="overflow-hidden rounded-lg border border-slate-200 aspect-[4/3] bg-slate-100">
            <img
              src={selectedService.image}
              alt={selectedService.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-blue-700">
              {selectedService.category}
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900">
              {selectedService.name}
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              {selectedService.shortDescription}
            </p>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Duration</span>
              <span className="font-medium text-slate-800">
                {selectedService.duration}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode</span>
              <span className="font-medium text-slate-800">{paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2">
              <span className="font-semibold text-slate-900">Total Amount</span>
              <span className="font-display text-lg font-bold text-blue-700 tabular-nums">
                ₹{selectedService.price}
              </span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};
