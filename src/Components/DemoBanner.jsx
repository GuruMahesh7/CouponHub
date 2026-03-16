import React, { useState } from 'react';

function DemoBanner() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[80px] md:bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 px-5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-medium flex items-center gap-2"
        title="View Demo Info"
      >
        <span>✨ Info</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-[80px] md:bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden transform transition-all duration-300">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
        >
          ✕
        </button>
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          ✨ Demo Version
        </h3>
      </div>
      <div className="p-5 text-sm text-gray-700 space-y-4">
        <p className="leading-relaxed">
          Welcome! This is a <strong>demo dashboard</strong> designed for managing business coupons and analytics.
        </p>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
          <p className="font-semibold text-purple-900 mb-1">Looking for a custom solution?</p>
          <p className="text-purple-800 text-xs">
            Whether you need a dashboard like this for your business, specific customizations, or a completely new website, I can build it for you!
          </p>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <p className="font-semibold text-gray-900 mb-2">My Contact Details:</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="text-xl">📧</span>
              <a href="mailto:gurumaheshbusani@gmail.com" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                gurumaheshbusani@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">📱</span>
              <a href="https://wa.me/917672018022" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                WhatsApp Me
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">💼</span>
              <a href="https://www.linkedin.com/in/guru-mahesh-busani/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                Guru Mahesh
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DemoBanner;
