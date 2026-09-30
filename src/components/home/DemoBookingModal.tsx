import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface DemoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTour: () => void;
}

export const DemoBookingModal: React.FC<DemoBookingModalProps> = ({
  isOpen,
  onClose,
  onLaunchTour,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [teamSize, setTeamSize] = useState('5-15');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#14151a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Book an Agency Strategy Demo</h3>
              <p className="text-[11px] text-zinc-400">1-on-1 walkthrough tailored to your agency's creative workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-orange-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Demo Scheduled!</h4>
            <p className="text-zinc-400 text-xs">
              Thank you, {name}. A calendar invite and prep link have been sent to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Agency Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nova Media"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Agency Team Size</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
              >
                <option value="1-5">1 - 5 Creators (Boutique)</option>
                <option value="5-15">5 - 15 Creators (Growing Agency)</option>
                <option value="15-50">15 - 50 Creators (Mid-Market)</option>
                <option value="50+">50+ Creators (Enterprise Network)</option>
              </select>
            </div>

            {/* Quick interactive test drive option */}
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-orange-300 block">Want to try it right now?</span>
                <span className="text-[11px] text-zinc-400">Launch the live interactive agency sandbox</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchTour();
                }}
                className="px-3 py-1.5 rounded-lg bg-orange-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Live Tour</span>
              </button>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#1c1d24] text-zinc-300 hover:text-white font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/30 cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
