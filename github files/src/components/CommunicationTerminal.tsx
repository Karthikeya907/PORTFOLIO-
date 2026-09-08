import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactMessage } from '../lib/supabase';

export const CommunicationTerminal: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SENT' | 'FAILED'>('IDLE');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === 'FAILED') setStatus('IDLE');
  };

  const handleSend = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setStatus('TRANSMITTING');
    const currentData = { ...formData };
    const mailSubject = `Portfolio Contact — ${currentData.name}`;

    try {
      let emailDispatched = false;

      // 1. Primary Clean Web3Forms Dispatcher with Official Activated Key (0 Ads, 0 Footers, Direct Inbox Delivery)
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '95a92ff6-a1aa-4889-a509-3a00000a9c72',
            name: currentData.name,
            email: currentData.email,
            message: currentData.message,
            subject: mailSubject,
            from_name: currentData.name,
            replyto: currentData.email,
          }),
        });

        const resJson = await response.json();
        if (response.ok && resJson.success) {
          emailDispatched = true;
        }
      } catch (err) {
        console.warn('Web3Forms dispatch attempt:', err);
      }

      // 2. Netlify Native Forms Backup (When deployed on Netlify)
      if (!emailDispatched && window.location.hostname.includes('netlify')) {
        try {
          const bodyData = new URLSearchParams();
          bodyData.append('form-name', 'contact');
          bodyData.append('name', currentData.name);
          bodyData.append('email', currentData.email);
          bodyData.append('message', currentData.message);

          const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: bodyData.toString(),
          });
          if (response.ok) {
            emailDispatched = true;
          }
        } catch (err) {
          console.warn('Netlify form post attempt:', err);
        }
      }

      // 3. Save message securely to Supabase Cloud DB Persistence
      await sendContactMessage(currentData);

      if (emailDispatched) {
        setStatus('SENT');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('IDLE'), 5000);
      } else {
        setStatus('FAILED');
        setTimeout(() => setStatus('IDLE'), 3000);
      }
    } catch (error) {
      console.error('Form transmission error:', error);
      setStatus('FAILED');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  return (
    <div className="w-full z-10">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest text-cyan-400 font-mono">NAME</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-black/30 border border-cyan-500/30 hover:border-cyan-400 p-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-black/50 focus:ring-1 focus:ring-cyan-400 font-mono rounded transition-colors duration-150 placeholder:text-gray-500"
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
            className="bg-black/30 border border-cyan-500/30 hover:border-cyan-400 p-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-black/50 focus:ring-1 focus:ring-cyan-400 font-mono rounded transition-colors duration-150 placeholder:text-gray-500"
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
            className="bg-black/30 border border-cyan-500/30 hover:border-cyan-400 p-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-black/50 focus:ring-1 focus:ring-cyan-400 font-mono resize-none rounded transition-colors duration-150 placeholder:text-gray-500"
            placeholder="ENTER MESSAGE..."
          />
        </div>

        <button 
          type="button" 
          onClick={handleSend}
          disabled={status !== 'IDLE'}
          className="group relative w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
          style={{
            clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
          }}
        >
          <span className="text-xs font-bold tracking-wider uppercase">
            {status === 'IDLE' && 'TRANSMIT MESSAGE'}
            {status === 'TRANSMITTING' && 'TRANSMITTING MESSAGE...'}
            {status === 'SENT' && 'MESSAGE TRANSMITTED SUCCESSFULLY'}
            {status === 'FAILED' && 'TRANSMISSION FAILED — TRY AGAIN'}
          </span>
          {status === 'IDLE' && <Send size={16} />}
          {status === 'SENT' && <CheckCircle size={16} className="text-green-950" />}
          {status === 'FAILED' && <AlertCircle size={16} className="text-red-950" />}
          
          {/* Status Indicator */}
          <div className={`absolute left-4 w-2 h-2 rounded-full ${status === 'TRANSMITTING' ? 'bg-yellow-400' : status === 'SENT' ? 'bg-green-400' : status === 'FAILED' ? 'bg-red-500' : 'bg-black'}`} />
        </button>
      </div>
    </div>
  );
};
