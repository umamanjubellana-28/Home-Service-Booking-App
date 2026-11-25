import React from 'react';
import { CheckCircle2, QrCode } from 'lucide-react';

interface QrCodeBoxProps {
  amount: number;
  serviceName: string;
  isPaid: boolean;
  onConfirmPayment: () => void;
}

// Deterministic 15x15 QR-style matrix for clean offline/demo rendering
const QR_MATRIX: number[][] = [
  [1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
  [1,0,0,0,1,0,0,1,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
  [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
  [1,0,1,1,0,1,0,1,1,1,0,1,0,1,1],
  [0,1,0,1,1,0,1,0,0,1,1,0,1,0,0],
  [1,1,0,0,1,1,0,1,1,0,1,1,0,1,1],
  [0,0,0,0,0,0,1,0,1,1,0,0,1,0,0],
  [1,1,1,1,1,0,0,1,0,1,1,0,1,1,0],
  [1,0,0,0,1,0,1,0,1,0,0,1,0,0,1],
  [1,0,1,0,1,0,1,1,0,1,1,0,1,1,0],
  [1,0,0,0,1,0,0,1,1,0,0,1,0,1,1],
  [1,1,1,1,1,0,1,0,1,1,0,1,1,0,1],
];

export const QrCodeBox: React.FC<QrCodeBoxProps> = ({
  amount,
  serviceName,
  isPaid,
  onConfirmPayment,
}) => {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-3">
          <svg
            viewBox="0 0 150 150"
            className="h-36 w-36"
            role="img"
            aria-label="Demo Scan to Pay QR Code"
          >
            <rect width="150" height="150" fill="#ffffff" />
            {QR_MATRIX.map((row, rIdx) =>
              row.map((cell, cIdx) =>
                cell === 1 ? (
                  <rect
                    key={`${rIdx}-${cIdx}`}
                    x={cIdx * 10}
                    y={rIdx * 10}
                    width="9.5"
                    height="9.5"
                    rx="1"
                    fill="#0f172a"
                  />
                ) : null
              )
            )}
          </svg>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-blue-700">
            <QrCode className="h-4 w-4" />
            <span>Demo UPI / Scan to Pay Simulation</span>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">
            Scan with any UPI app or click confirm below to simulate payment for{' '}
            <span className="font-semibold text-slate-900">{serviceName}</span>.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm">
            <div>
              <span className="text-slate-500">Amount: </span>
              <span className="font-display text-lg font-bold text-slate-900 tabular-nums">
                ₹{amount}
              </span>
            </div>
            <div>
              <span className="text-slate-500">UPI ID: </span>
              <span className="font-mono text-xs text-slate-800">homecare.demo@upi</span>
            </div>
          </div>

          <div className="mt-4">
            {isPaid ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Payment Confirmed (Status: Paid)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onConfirmPayment}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Simulate Payment Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
