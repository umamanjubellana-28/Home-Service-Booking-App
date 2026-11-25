import React, { useState } from 'react';
import { Clock, Wrench, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../data/services';

interface ServiceCardProps {
  service: ServiceItem;
  onBookNow: (service: ServiceItem) => void;
  onViewDetails: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBookNow,
  onViewDetails,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-blue-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {!imgError ? (
          <img
            src={service.image}
            alt={service.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4 text-center">
            <Wrench className="h-8 w-8 text-blue-700" />
            <span className="mt-2 text-sm font-medium text-slate-700">{service.name}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-blue-700">{service.category}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration}
          </span>
        </div>

        <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
          {service.name}
        </h3>

        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
          {service.shortDescription}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-xs text-slate-500">Starting at</span>
            <span className="font-display text-xl font-bold text-slate-900 tabular-nums">
              ₹{service.price}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onViewDetails(service)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onBookNow(service)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
