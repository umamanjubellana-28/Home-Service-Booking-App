import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES } from '../data/services';

export type UserRole = 'user' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface SessionData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export type BookingStatus = 'Pending' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Scan to Pay';
export type PaymentStatus = 'Pending' | 'Paid';

export interface BookingRecord {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  price: number;
  date: string;
  timeSlot: string;
  address: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  userId: string;
  customerName: string;
  serviceName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
}

export interface ReviewRecord {
  id: string;
  bookingId: string;
  userId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const STORAGE_KEYS = {
  USERS: 'hs_users',
  SESSION: 'hs_session',
  BOOKINGS: 'hs_bookings',
  PAYMENTS: 'hs_payments',
  REVIEWS: 'hs_reviews',
};

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-ADMIN',
    name: 'System Admin',
    email: 'admin@homeservices.com',
    phone: '9876543210',
    password: 'Admin123',
    role: 'admin',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'USR-101',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    phone: '9820112233',
    password: 'User123',
    role: 'user',
    createdAt: '2026-02-14T10:30:00.000Z',
  },
  {
    id: 'USR-102',
    name: 'Rohan Verma',
    email: 'rohan@example.com',
    phone: '9811445566',
    password: 'User123',
    role: 'user',
    createdAt: '2026-03-02T14:15:00.000Z',
  },
];

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-1001',
    userId: 'USR-101',
    customerName: 'Ananya Sharma',
    phone: '9820112233',
    serviceId: 'srv-ac-repair',
    serviceName: 'AC Repair',
    price: 599,
    date: '2026-11-18',
    timeSlot: '11:00 AM – 1:00 PM',
    address: 'Flat 304, Shanti Residency, Sector 14, Pune',
    paymentMethod: 'Scan to Pay',
    paymentStatus: 'Paid',
    status: 'Completed',
    createdAt: '2026-11-16T09:20:00.000Z',
  },
  {
    id: 'BK-1002',
    userId: 'USR-102',
    customerName: 'Rohan Verma',
    phone: '9811445566',
    serviceId: 'srv-plumbing',
    serviceName: 'Plumbing',
    price: 499,
    date: '2026-11-24',
    timeSlot: '9:00 AM – 11:00 AM',
    address: 'House 18, Lakeview Colony, Indiranagar, Bengaluru',
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    status: 'Pending',
    createdAt: '2026-11-21T16:40:00.000Z',
  },
  {
    id: 'BK-1003',
    userId: 'USR-101',
    customerName: 'Ananya Sharma',
    phone: '9820112233',
    serviceId: 'srv-cleaning',
    serviceName: 'Home Cleaning',
    price: 799,
    date: '2026-11-12',
    timeSlot: '2:00 PM – 4:00 PM',
    address: 'Flat 304, Shanti Residency, Sector 14, Pune',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    status: 'Completed',
    createdAt: '2026-11-10T11:05:00.000Z',
  },
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-5001',
    bookingId: 'BK-1001',
    userId: 'USR-101',
    customerName: 'Ananya Sharma',
    serviceName: 'AC Repair',
    amount: 599,
    method: 'Scan to Pay',
    status: 'Paid',
    date: '2026-11-16',
  },
  {
    id: 'PAY-5002',
    bookingId: 'BK-1002',
    userId: 'USR-102',
    customerName: 'Rohan Verma',
    serviceName: 'Plumbing',
    amount: 499,
    method: 'Cash',
    status: 'Pending',
    date: '2026-11-21',
  },
  {
    id: 'PAY-5003',
    bookingId: 'BK-1003',
    userId: 'USR-101',
    customerName: 'Ananya Sharma',
    serviceName: 'Home Cleaning',
    amount: 799,
    method: 'Cash',
    status: 'Paid',
    date: '2026-11-12',
  },
];

const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'REV-2001',
    bookingId: 'BK-1001',
    userId: 'USR-101',
    customerName: 'Ananya Sharma',
    serviceId: 'srv-ac-repair',
    serviceName: 'AC Repair',
    rating: 5,
    comment: 'Technician arrived right on time, cleaned both filters thoroughly, and checked cooling pressure neatly.',
    createdAt: '2026-11-18T14:00:00.000Z',
  },
  {
    id: 'REV-2002',
    bookingId: 'BK-1003',
    userId: 'USR-101',
    customerName: 'Ananya Sharma',
    serviceId: 'srv-cleaning',
    serviceName: 'Home Cleaning',
    rating: 5,
    comment: 'Kitchen tiles and bathroom fittings looked spotless after the visit. Clear pricing with no extra charges.',
    createdAt: '2026-11-13T10:15:00.000Z',
  },
];

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function initializeStorage() {
  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existingUsers) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
  } else {
    // Ensure default admin account always exists in hs_users
    const parsed = readFromStorage<UserAccount[]>(STORAGE_KEYS.USERS, []);
    const hasAdmin = parsed.some(
      (u) => u.email.toLowerCase() === 'admin@homeservices.com' && u.role === 'admin'
    );
    if (!hasAdmin) {
      const updated = [INITIAL_USERS[0], ...parsed];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    }
  }
}

export interface CreateBookingInput {
  customerName: string;
  phone: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  address: string;
  paymentMethod: PaymentMethod;
  scanPaymentConfirmed?: boolean;
}

interface ActionResult {
  ok: boolean;
  message: string;
}

interface AppContextType {
  users: UserAccount[];
  session: SessionData | null;
  bookings: BookingRecord[];
  payments: PaymentRecord[];
  reviews: ReviewRecord[];
  registerUser: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => ActionResult;
  loginUser: (email: string, password: string) => ActionResult;
  loginAdmin: (email: string, password: string) => ActionResult;
  logout: () => void;
  createBooking: (input: CreateBookingInput) => {
    ok: boolean;
    message: string;
    booking?: BookingRecord;
    payment?: PaymentRecord;
  };
  cancelBooking: (bookingId: string) => ActionResult;
  completeBooking: (bookingId: string) => ActionResult;
  markPaymentPaid: (bookingId: string) => ActionResult;
  submitReview: (input: {
    bookingId: string;
    rating: number;
    comment: string;
  }) => ActionResult;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    initializeStorage();
    return readFromStorage<UserAccount[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  });

  const [session, setSession] = useState<SessionData | null>(() =>
    readFromStorage<SessionData | null>(STORAGE_KEYS.SESSION, null)
  );

  const [bookings, setBookings] = useState<BookingRecord[]>(() =>
    readFromStorage<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );

  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    readFromStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS)
  );

  const [reviews, setReviews] = useState<ReviewRecord[]>(() =>
    readFromStorage<ReviewRecord[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  const registerUser: AppContextType['registerUser'] = ({ name, email, phone, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (duplicate) {
      return {
        ok: false,
        message: 'An account with this email address already exists.',
      };
    }

    const newUser: UserAccount = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-3)}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    return {
      ok: true,
      message: 'Account created successfully! Please log in with your credentials.',
    };
  };

  const loginUser: AppContextType['loginUser'] = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matched = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!matched) {
      return { ok: false, message: 'No user account found with this email.' };
    }
    if (matched.role === 'admin') {
      return {
        ok: false,
        message: 'This is an administrator email. Please use the Admin Login tab.',
      };
    }
    if (matched.password !== password) {
      return { ok: false, message: 'Incorrect password. Please try again.' };
    }

    setSession({
      userId: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
      role: 'user',
    });

    return { ok: true, message: 'Login successful.' };
  };

  const loginAdmin: AppContextType['loginAdmin'] = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matched = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.role === 'admin'
    );

    if (!matched) {
      return { ok: false, message: 'Invalid administrator email address.' };
    }
    if (matched.password !== password) {
      return { ok: false, message: 'Incorrect administrator password.' };
    }

    setSession({
      userId: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
      role: 'admin',
    });

    return { ok: true, message: 'Admin login successful.' };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  const createBooking: AppContextType['createBooking'] = (input) => {
    if (!session || session.role !== 'user') {
      return { ok: false, message: 'Please log in as a user to create a booking.' };
    }

    const service = SERVICES.find((s) => s.id === input.serviceId);
    if (!service) {
      return { ok: false, message: 'Selected service was not found.' };
    }

    if (input.paymentMethod === 'Scan to Pay' && !input.scanPaymentConfirmed) {
      return {
        ok: false,
        message: 'Please complete the Scan to Pay confirmation before confirming your booking.',
      };
    }

    const nextBookingNum = 1001 + bookings.length;
    const bookingId = `BK-${nextBookingNum}`;
    const paymentId = `PAY-${5001 + payments.length}`;
    const paymentStatus: PaymentStatus =
      input.paymentMethod === 'Scan to Pay' ? 'Paid' : 'Pending';

    const newBooking: BookingRecord = {
      id: bookingId,
      userId: session.userId,
      customerName: input.customerName.trim(),
      phone: input.phone.trim(),
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      date: input.date,
      timeSlot: input.timeSlot,
      address: input.address.trim(),
      paymentMethod: input.paymentMethod,
      paymentStatus,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const newPayment: PaymentRecord = {
      id: paymentId,
      bookingId,
      userId: session.userId,
      customerName: input.customerName.trim(),
      serviceName: service.name,
      amount: service.price,
      method: input.paymentMethod,
      status: paymentStatus,
      date: new Date().toISOString().split('T')[0],
    };

    setBookings((prev) => [newBooking, ...prev]);
    setPayments((prev) => [newPayment, ...prev]);

    return {
      ok: true,
      message: 'Booking confirmed successfully.',
      booking: newBooking,
      payment: newPayment,
    };
  };

  const cancelBooking: AppContextType['cancelBooking'] = (bookingId) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) {
      return { ok: false, message: 'Booking not found.' };
    }
    if (target.status !== 'Pending') {
      return { ok: false, message: 'Only pending bookings can be cancelled.' };
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
    return { ok: true, message: `Booking ${bookingId} has been cancelled.` };
  };

  const completeBooking: AppContextType['completeBooking'] = (bookingId) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) {
      return { ok: false, message: 'Booking not found.' };
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Completed' } : b))
    );
    return { ok: true, message: `Booking ${bookingId} marked as Completed.` };
  };

  const markPaymentPaid: AppContextType['markPaymentPaid'] = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, paymentStatus: 'Paid' } : b))
    );
    setPayments((prev) =>
      prev.map((p) => (p.bookingId === bookingId ? { ...p, status: 'Paid' } : p))
    );
    return { ok: true, message: `Payment for ${bookingId} marked as Paid.` };
  };

  const submitReview: AppContextType['submitReview'] = ({ bookingId, rating, comment }) => {
    if (!session || session.role !== 'user') {
      return { ok: false, message: 'Only logged-in users can submit reviews.' };
    }

    const booking = bookings.find(
      (b) => b.id === bookingId && b.userId === session.userId
    );
    if (!booking) {
      return { ok: false, message: 'Booking record not found.' };
    }
    if (booking.status !== 'Completed') {
      return {
        ok: false,
        message: 'Reviews can only be submitted after the booking is marked Completed.',
      };
    }

    const alreadyReviewed = reviews.some((r) => r.bookingId === bookingId);
    if (alreadyReviewed) {
      return {
        ok: false,
        message: 'You have already submitted a review for this booking.',
      };
    }

    const newReview: ReviewRecord = {
      id: `REV-${2001 + reviews.length}`,
      bookingId: booking.id,
      userId: session.userId,
      customerName: session.name,
      serviceId: booking.serviceId,
      serviceName: booking.serviceName,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    return { ok: true, message: 'Thank you! Your review has been saved.' };
  };

  return (
    <AppContext.Provider
      value={{
        users,
        session,
        bookings,
        payments,
        reviews,
        registerUser,
        loginUser,
        loginAdmin,
        logout,
        createBooking,
        cancelBooking,
        completeBooking,
        markPaymentPaid,
        submitReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return ctx;
}
