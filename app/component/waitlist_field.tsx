"use client"
import { GoStarFill } from "react-icons/go";
import { GoCheckCircle, GoXCircle } from "react-icons/go";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaitlistComponent() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  // Set the target date to 41 days from now (June 21, 2026 + 41 days = August 1, 2026)
  const targetDate = new Date('2026-08-01T00:00:00');
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    content: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    content: ''
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if user is already on waitlist
      const checkResponse = await fetch(`${API_URL}/api/special/check-waitlist?email=${encodeURIComponent(email)}`);
      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setModal({
          isOpen: true,
          type: 'info',
          title: 'Welcome Back! 👋',
          content: checkData.message
        });
        setLoading(false);
        return;
      }

      // If not on waitlist, create new entry
      const createResponse = await fetch(`${API_URL}/api/special/create-waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const createData = await createResponse.json();
      
      if (createData.success) {
        setModal({
          isOpen: true,
          type: 'success',
          title: "You're In! 🎉",
          content: createData.message
        });
        setEmail('');
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Invalid Email Address',
          content: createData.message
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Something went wrong',
        content: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 md:px-0 px-[3rem]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 h-[45px] w-[150px] rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[0.9rem] drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]"
      >
        <GoStarFill /> Waitlist
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-clip-text text-transparent bg-linear-to-r from-orange-500 via-white to-white/40 font-bold text-[5rem] text-center font-orbitron"
      >
        Coming soon!
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="md:w-[650px] w-full bg-linear-to-r from-white/15 to-gray-400/15 backdrop-blur-md border border-white/20 rounded-[25px] px-[1.8rem] py-10 flex justify-center items-center flex-col gap-1 drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]"
      >
        <h1 className="text-white/80 text-[1.3rem] font-semibold font-orbitron">
          Kingdom builders join the waitlist!
        </h1>
        <p className="text-center w-[95%] text-white/70 text-[0.8rem]">
          Be the first to experience the future of AI-powered ministry. Join the GOYE waitlist for exclusive early access, product updates, and launch announcements
        </p>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 justify-between mt-5 w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] border-none outline-none bg-black/30 h-[40px] px-5 text-white placeholder:text-white text-[0.8rem] rounded-full flex-1"
            required
          />
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-[40px] bg-white text-[0.8rem] text-slate-950 font-bold rounded-full drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] w-[120px] font-orbitron disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Join waitlist'}
          </motion.button>
        </form>

        <div className="w-full flex justify-center items-center mt-5">
          {['days', 'hours', 'minutes', 'seconds'].map((unit, index) => (
            <motion.div
              key={unit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="w-[100px] time_design relative flex justify-center items-center flex-col gap-1"
            >
              <h1 className="text-white font-semibold font-orbitron text-3xl">
                {String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, '0')}
              </h1>
              <div className="text-[0.8rem] text-white/80 font-orbitron">
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-gradient-to-b from-white/20 to-gray-400/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl"
              >
                ×
              </motion.button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-4"
              >
                {modal.type === 'success' && (
                  <GoCheckCircle className="text-6xl text-green-400" />
                )}
                {modal.type === 'error' && (
                  <GoXCircle className="text-6xl text-red-400" />
                )}
                {modal.type === 'info' && (
                  <GoStarFill className="text-6xl text-yellow-400" />
                )}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl font-bold text-center mb-3 font-orbitron ${
                  modal.type === 'success' ? 'text-green-400' :
                  modal.type === 'error' ? 'text-red-400' :
                  'text-yellow-400'
                }`}
              >
                {modal.title}
              </motion.h2>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-center space-y-3"
                dangerouslySetInnerHTML={{ __html: modal.content }}
              />

              {/* Action button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                className={`w-full mt-6 py-3 rounded-full font-bold font-orbitron transition-all ${
                  modal.type === 'success' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : modal.type === 'error'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                Got it!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}