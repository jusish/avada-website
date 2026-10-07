import React from 'react';

/**
 * Wordmark recreations of partner brands. Replace with official logo assets
 * (SVG/PNG in /public/partners) when available.
 */
export const ROW_ONE: React.ReactNode[] = [
  <span key="mpesa" className="text-2xl font-black italic text-[#2FAE4A] tracking-tight">
    M<span className="text-[#E4202C]">-</span>PESA
  </span>,
  <span
    key="momo"
    className="inline-flex flex-col items-center justify-center bg-[#0B4F6C] text-[#FFCC00] font-black text-sm leading-none px-4 py-2 rounded-sm"
  >
    MoMo
    <span className="text-[6px] font-semibold text-white">from MTN</span>
  </span>,
  <span key="airtel" className="text-3xl font-black italic text-[#E4012B] lowercase tracking-tight">
    airtel
  </span>,
  <span key="orange" className="inline-flex items-center gap-1.5">
    <span className="grid grid-cols-2 w-8 h-7">
      <span className="bg-black" />
      <span className="bg-[#FF7900]" />
    </span>
    <span className="text-[11px] font-black leading-[1] text-black">
      Orange
      <br />
      Money
    </span>
  </span>,
  <span key="vodacom" className="inline-flex items-center gap-1 text-xl font-bold text-[#E60000]">
    <span className="w-7 h-7 rounded-full bg-[#E60000] text-white grid place-items-center text-lg">”</span>
    vodacom
  </span>,
  <span key="tigo" className="text-xl font-extrabold italic text-[#1B3A8C] lowercase">
    tigo<span className="text-[#E5B300]">money</span>
  </span>,
  <span key="pawa" className="inline-flex items-center gap-1.5 text-2xl font-black text-[#2A1E5C]">
    <span className="w-6 h-6 rounded-full border-4 border-[#2DD4A8]" />
    Pawa
  </span>,
];

export const ROW_TWO: React.ReactNode[] = [
  <span key="moov" className="inline-flex items-center text-2xl font-black italic text-[#0066B3]">
    Moov
    <span className="ml-1 w-5 h-5 rotate-45 bg-[#0066B3] border-4 border-[#F7931E]" />
  </span>,
  <span
    key="wave"
    className="inline-flex items-center gap-1.5 bg-[#FFE600] text-[#1D3FA8] px-3 py-2 rounded-md text-xs font-black italic"
  >
    <span className="w-4 h-4 rounded-full bg-[#2CA5E0]" />
    WAVE MONEY
  </span>,
  <span key="halo" className="text-xl font-bold text-[#E8532B] lowercase">
    halo<span className="bg-[#E8532B] text-white px-1">pesa</span>
  </span>,
  <span key="tmoney" className="text-2xl font-black italic text-[#E2001A]">
    T<span className="text-[#E2001A]">Money</span>
  </span>,
  <span key="visa" className="text-4xl font-black italic text-[#1434CB] tracking-tight">
    VISA
  </span>,
  <span key="mc" className="inline-flex flex-col items-center">
    <span className="relative w-[76px] h-10">
      <span className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#EB001B]" />
      <span className="absolute right-0 top-0 w-10 h-10 rounded-full bg-[#F79E1B] mix-blend-multiply" />
    </span>
    <span className="text-[10px] font-semibold text-gray-800 -mt-0.5">mastercard</span>
  </span>,
  <span key="palm" className="inline-flex items-center gap-1.5 text-2xl font-black text-[#1A1A1A]">
    <span className="w-7 h-7 rounded-md bg-[#7B2FF7] rotate-45 scale-75" />
    PalmPay
  </span>,
];
