import React from 'react';
import { X, Check, Clock, Star } from 'lucide-react';
import { ServiceItem } from '../data/services';
import { useApp } from '../context/AppContext';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookNow: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookNow,
}) => {
  const { reviews } = useApp();

  if (!service) return null;

  const serviceReviews = reviews.filter((r) => r.serviceId === service.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <span className="text-xs font-medium text-blue-700">{service.category}</span>
            <h2
              id="service-modal-title"
              className="font-display text-xl font-bold text-slate-900"
            >
              {service.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 aspect-[4/3]">
              <img
                src={service.image}
                alt={service.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm leading-relaxed text-slate-600">
                  {service.fullDescription}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-blue-700" />
                    {service.duration}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/70 p-4 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-slate-500">Standard Visit Charge</span>
                  <span className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                    ₹{service.price}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBookNow(service);
                  }}
                  className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Book This Service
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-display text-sm font-bold text-slate-900">
              What is included
            </h3>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-display text-sm font-bold text-slate-900">
              Customer Reviews ({serviceReviews.length})
            </h3>
            {serviceReviews.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                No reviews submitted for this service yet.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {serviceReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {review.customerName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 tabular-nums">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
