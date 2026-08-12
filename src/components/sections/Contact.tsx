import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

export function Contact() {
  const ref           = useRef(null);
  const isInView      = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form     = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('access_key', '5688967b-2a86-4193-b17a-9fd606ebc567');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setSent(true);
        form.reset();
        setTimeout(() => setSent(false), 4000);
      } else {
        console.error('Web3Forms Error:', data);
        alert(data.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Something went wrong! Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Mail,   label: 'Email',    value: 'tahasohail85@gmail.com',              href: 'mailto:tahasohail85@gmail.com' },
    { icon: Phone,  label: 'Phone',    value: '+92 332 8885770',                     href: 'tel:+923328885770' },
    { icon: MapPin, label: 'Location', value: 'Pakistan',                            href: null },
    { icon: FiGithub, label: 'GitHub',   value: 'github.com/TahaSohail-Goat',          href: 'https://github.com/TahaSohail-Goat' },
    { icon: FiLinkedin,label:'LinkedIn', value: 'linkedin.com/in/taha-sohail-7b03b8320', href: 'https://www.linkedin.com/in/taha-sohail-7b03b8320/' },
  ];

  return (
    <section id="contact" className="py-28 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Large closing statement ─── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <p className="text-mono-label mb-5 text-center">let's connect</p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Have a project<br />
            <span style={{ color: 'var(--accent-neon)' }}>in mind?</span>
          </h2>
          <div className="mx-auto w-12 h-px mb-6" style={{ background: 'var(--accent-neon)', opacity: 0.4 }} />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
              color: 'rgba(255,255,255,0.80)',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.75,
              fontWeight: 300,
            }}
          >
            Drop me a message and let's make something great. I'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Contact info ─── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-2 space-y-3"
          >
            {contactItems.map(item => (
              <div
                key={item.label}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.18)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,212,0.02)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,245,212,0.07)',
                    border: '1px solid rgba(0,245,212,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <item.icon style={{ width: '15px', height: '15px', color: 'var(--accent-neon)' }} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.65)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                    }}
                  >
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.65)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-neon)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.65)',
                      }}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── Contact form ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              style={{
                padding: 'clamp(20px, 4vw, 40px)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9.5px',
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Your Name
                  </label>
                  <input type="text" name="name" required placeholder="John Doe" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9.5px',
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Email
                  </label>
                  <input type="email" name="email" required placeholder="john@example.com" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9.5px',
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Subject
                </label>
                <input type="text" name="subject" required placeholder="Project Discussion" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9.5px',
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  style={{ resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                id="contact-submit"
                disabled={isSubmitting || sent}
                style={{
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: sent ? 'rgba(0,245,212,0.15)' : 'rgba(255,255,255,0.95)',
                  color: sent ? 'var(--accent-neon)' : '#0a0a0a',
                  border: sent ? '1px solid rgba(0,245,212,0.35)' : '1px solid transparent',
                  cursor: isSubmitting || sent ? 'default' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  if (!isSubmitting && !sent) {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(255,255,255,0.15)';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {sent ? '✓ Message Sent!' : isSubmitting ? 'Sending...' : (
                  <>Send Message <Send style={{ width: '15px', height: '15px' }} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
