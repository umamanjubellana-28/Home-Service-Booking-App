import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  IndianRupee,
  CalendarCheck,
  Star,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { HERO_IMAGE, SERVICES, ServiceItem } from '../data/services';
import { useApp } from '../context/AppContext';
import { ServiceCard } from '../components/ServiceCard';
import { PageView } from '../components/Navbar';

interface HomeProps {
  onNavigate: (page: PageView, sectionId?: string) => void;
  onBookService: (service: ServiceItem) => void;
  onViewDetails: (service: ServiceItem) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onBookService,
  onViewDetails,
}) => {
  const { reviews } = useApp();
  const [heroImgError, setHeroImgError] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');

    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError('Please enter your name, email address, and message.');
      return;
    }
    if (!contactEmail.includes('@')) {
      setContactError('Please enter a valid email address.');
      return;
    }

    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-blue-700">
                Trusted Doorstep Home Maintenance
              </p>
              <h1
                className="mt-3 font-display font-extrabold tracking-tight text-slate-900"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
                  lineHeight: 1.12,
                  textWrap: 'balance',
                }}
              >
                Reliable home repairs and cleaning booked in minutes.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                Schedule verified technicians for plumbing, electrical work, AC
                servicing, carpentry, appliance repair, and full home cleaning at
                fixed upfront rates.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Browse & Book Services</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Customer Login
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-[16/10] lg:aspect-auto">
                {!heroImgError ? (
                  <img
                    src={HERO_IMAGE}
                    alt="HomeCare technician preparing home inspection"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-50 p-6 text-center text-blue-800 font-display font-semibold">
                    HomeCare Professional Home Services
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-column Key Metrics Strip below hero split */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-200 pt-8">
            <div>
              <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                6 Services
              </p>
              <p className="mt-0.5 text-sm text-slate-500">Essential home categories</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                4 Time Slots
              </p>
              <p className="mt-0.5 text-sm text-slate-500">9:00 AM to 6:00 PM daily</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                ₹399 Onwards
              </p>
              <p className="mt-0.5 text-sm text-slate-500">Transparent fixed pricing</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                Cash & Scan
              </p>
              <p className="mt-0.5 text-sm text-slate-500">Flexible payment options</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Services */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">Popular Services</p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Everyday home maintenance at fixed prices
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Search & Filter All Services</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBookNow={onBookService}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>

      {/* 3. About Us & Why Choose Us */}
      <section
        id="about-section"
        className="border-y border-slate-200 bg-white py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-blue-700">About Us</p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Making home upkeep predictable and stress-free.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                HomeCare Services connects homeowners and tenants with dependable
                maintenance specialists. Instead of waiting for unscheduled callbacks
                or guessing repair charges, you pick the service, choose your
                preferred two-hour arrival window, and track every booking from your
                dashboard.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Once a visit is completed, you can rate your experience directly so
                service quality stays consistently high.
              </p>
            </div>

            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-blue-700">Why Choose Us</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <IndianRupee className="h-5 w-5 text-blue-700" />
                  <h3 className="mt-3 font-display text-base font-bold text-slate-900">
                    Upfront Service Rates
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Standard prices are shown clearly before booking with zero hidden
                    platform fees.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <Clock className="h-5 w-5 text-blue-700" />
                  <h3 className="mt-3 font-display text-base font-bold text-slate-900">
                    Convenient 2-Hour Slots
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Pick morning or afternoon slots that match your daily routine.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <ShieldCheck className="h-5 w-5 text-blue-700" />
                  <h3 className="mt-3 font-display text-base font-bold text-slate-900">
                    Pay Cash or Scan to Pay
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Settle payments via instant QR simulation or pay in cash after
                    service delivery.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <CalendarCheck className="h-5 w-5 text-blue-700" />
                  <h3 className="mt-3 font-display text-base font-bold text-slate-900">
                    Live Status & Cancellation
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Track Pending, Completed, and Cancelled bookings anytime from your
                    account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Reviews */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">Customer Reviews</p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Verified feedback from completed bookings
            </h2>
          </div>
          <span className="text-sm text-slate-500 tabular-nums">
            {reviews.length} published {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Customer reviews will appear here after bookings are completed and rated.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review) => (
              <div
                key={review.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-blue-700">
                      {review.serviceName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    "{review.comment}"
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {review.customerName}
                  </span>
                  <span className="tabular-nums">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Contact Section */}
      <section
        id="contact-section"
        className="border-t border-slate-200 bg-white py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-blue-700">Contact Us</p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Have a question before booking?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Reach out for custom apartment maintenance requests, service slot
                inquiries, or feedback about your booking.
              </p>

              <div className="mt-6 space-y-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Support Hours:</span>{' '}
                  Monday – Sunday, 8:30 AM to 8:00 PM
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Helpline:</span>{' '}
                  <span className="tabular-nums">+91 98765 43210</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Email:</span>{' '}
                  support@homeservices.com
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleContactSubmit}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4"
              >
                {contactSubmitted && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>
                      Your message has been received. Our support team will contact
                      you shortly.
                    </span>
                  </div>
                )}

                {contactError && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {contactError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-msg"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us what service or help you need..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
