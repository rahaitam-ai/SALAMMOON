import React from 'react';

function DepositCard({ children, className = '' }) {
  return (
    <div className={`max-w-4xl rounded-[14px] border border-slate-200 bg-white p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default DepositCard;
