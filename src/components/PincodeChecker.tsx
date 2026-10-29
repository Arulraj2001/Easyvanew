"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle, Truck, AlertCircle } from "lucide-react";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setIsValid(true);
      setChecked(true);
    } else {
      setIsValid(false);
      setChecked(true);
    }
  };

  return (
    <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
        <MapPin className="w-4 h-4 text-easyva-purple-600" />
        <span>Delivery & Studio Dispatch Options</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Delivery Pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            setChecked(false);
          }}
          className="flex-1 text-xs bg-white px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-easyva-purple-500 font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
        >
          Check
        </button>
      </form>

      {checked && isValid && (
        <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Delivery available to {pincode} by {getEstimatedDate()}</span>
          </div>
          <span className="block text-slate-600 pl-5">
            Free shipping on prepaid UPI • Insured courier transit
          </span>
        </div>
      )}

      {checked && !isValid && (
        <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 p-2 rounded-xl flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Please enter a valid 6-digit postal code.</span>
        </div>
      )}
    </div>
  );
}

function getEstimatedDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

