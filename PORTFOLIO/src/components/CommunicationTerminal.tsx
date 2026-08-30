import React, { useState } from 'react';
import { Send } from 'lucide-react';

export const CommunicationTerminal: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SENT' | 'FAILED'>('IDLE');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === 'FAILED') setStatus('IDLE'); // Reset failed status when typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setStatus('TRANSMITTING');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('SENT');
        setFormData({ name: '', email: '', message: '' }); // Clear form
        setTimeout(() => setStatus('IDLE'), 5000); // Reset button after 5 seconds
      } else {
        throw new Error('API response not OK');
      }
    } catch (error) {
      console.error('Form transmission error:', error);
      setStatus('FAILED');
      
      // Fallback: Open mail client if API fails
      setTimeout(() => {
        const subject = encodeURIComponent(`Portfolio Contact — ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        window.location.href = `mailto:nagakarthikeyaguthi2005@gmail.com?subject=${subject}&body=${body}`;
        
        setTimeout(() => setStatus('IDLE'), 3000); // Reset back to idle
      }, 1500);
    }
  };

  return (
    <div className="w-full z-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest text-cyan-400 font-mono">NAME</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-black/30 border border-cyan-500/30 hover:border-cyan-400 p-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-black/50 focus:ring-1 focus:ring-cyan-400 font-mono rounded transition-all duration-300 placeholder:text-gray-500 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            placeholder="ENTER NAME"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest text-cyan-400 font-mono">EMAIL</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-black/30 border border-cyan-500/30 hover:border-cyan-400 p-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-black/50 focus:ring-1 focus:ring-cyan-400 font-mono rounded transition-all duration-300 placeholder:text-gray-500 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            placeholder="ENTER EMAIL"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest text-cyan-400 font-mono">MESSAGE</label>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="bg-black/30 border border-cyan-500/30 hover:border-cyan-400 p-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-black/50 focus:ring-1 focus:ring-cyan-400 font-mono resize-none rounded transition-all duration-300 placeholder:text-gray-500 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            placeholder="ENTER MESSAGE..."
          />
        </div>

        <button 
          type="submit" 
          disabled={status !== 'IDLE'}
          className="group relative w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
          style={{
            clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
          }}
        >
          <span className="text-xs font-bold tracking-wider">
            {status === 'IDLE' && 'TRANSMIT MESSAGE'}
            {status === 'TRANSMITTING' && 'TRANSMITTING...'}
            {status === 'SENT' && 'MESSAGE TRANSMITTED SUCCESSFULLY'}
            {status === 'FAILED' && 'TRANSMISSION FAILED — FALLBACK: OPENING MAIL CLIENT'}
          </span>
          {status === 'IDLE' && <Send size={16} />}
          
          {/* Status Indicator */}
          <div className={`absolute left-4 w-2 h-2 rounded-full ${status === 'TRANSMITTING' ? 'bg-yellow-400' : status === 'SENT' ? 'bg-green-400' : status === 'FAILED' ? 'bg-red-500' : 'bg-black'}`} />
        </button>
      </form>
    </div>
  );
};
