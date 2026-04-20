import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // TODO: Replace with your actual Web3Forms Access Key
    // Get a free key at: https://web3forms.com
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSent(true);
        form.reset();
        setTimeout(() => setSent(false), 4000);
      } else {
        console.error("Web3Forms Error:", data);
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Something went wrong! Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Mail, label: 'Email', value: 'tahasohail85@gmail.com', href: 'mailto:tahasohail85@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+92 332 8885770', href: 'tel:+923328885770' },
    { icon: MapPin, label: 'Location', value: 'Pakistan', href: null },
  ];

  return (
    <section id="contact" className="py-28 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/30 mb-4">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Let's Work Together</h2>
          <div className="mt-4 w-12 h-px bg-white/20 mb-6" />
          <p className="text-white/40 max-w-xl font-light">
            Have a project in mind? Drop me a message and let's make it happen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactItems.map(item => (
              <div
                key={item.label}
                className="p-6 rounded-xl flex items-center gap-5 group transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <item.icon className="w-4 h-4 text-white/50" />
                </div>
                <div>
                  <p className="text-xs text-white/25 mb-1 uppercase tracking-widest">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-white/70">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 md:p-10 rounded-2xl space-y-5"
              style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs text-white/30 uppercase tracking-widest block">Your Name</label>
                  <input type="text" name="name" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/30 uppercase tracking-widest block">Email</label>
                  <input type="email" name="email" required placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-white/30 uppercase tracking-widest block">Subject</label>
                <input type="text" name="subject" required placeholder="Project Discussion" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-white/30 uppercase tracking-widest block">Message</label>
                <textarea name="message" required rows={5} placeholder="Tell me about your project..." style={{ resize: 'none' }} />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || sent}
                className="w-full py-4 rounded-xl font-display font-semibold text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-60"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#0a0a0a' }}
              >
                {sent ? 'Message Sent!' : isSubmitting ? 'Sending...' : 'Send Message'}
                {!sent && <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
