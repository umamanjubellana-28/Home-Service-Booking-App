import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';

interface ServicesProps {
  onBookService: (service: ServiceItem) => void;
  onViewDetails: (service: ServiceItem) => void;
}

const CATEGORIES = ['All', 'Repair', 'Maintenance', 'Cleaning'] as const;

export const Services: React.FC<ServicesProps> = ({
  onBookService,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let list = SERVICES.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;
      const matchesQuery =
        !query ||
        service.name.toLowerCase().includes(query) ||
        service.shortDescription.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold text-blue-700">Service Catalog</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-slate-900">
          Browse Home Services
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Search by service name, filter by category, view full inclusions, or book a
          time slot right away.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plumbing, AC repair, cleaning..."
              aria-label="Search services"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Filter by category"
              className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
            >
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc')
              }
              aria-label="Sort services"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-display text-base font-semibold text-slate-900">
            No matching services found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try clearing your search keyword or switching to All categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBookNow={onBookService}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
