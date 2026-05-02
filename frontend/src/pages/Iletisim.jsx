import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { submitContactForm, getSettings } from '../services/api';
import { useEffect } from 'react';

const Iletisim = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const recaptchaRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      alert('Lütfen robot olmadığınızı doğrulayın!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitContactForm(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      recaptchaRef.current.reset();
      setCaptchaValue(null);
    } catch (error) {
      alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '15px' }}>Bizimle İletişime Geçin</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Sorularınız, önerileriniz veya işbirliği teklifleriniz için mesaj gönderebilirsiniz.</p>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Contact Info */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px', color: 'var(--text-main)' }}>İletişim Bilgilerimiz</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>E-Posta</p>
                  <p style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{settings?.contactEmail || 'info@componentsource.ai'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Telefon</p>
                  <p style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{settings?.phone || '+90 (212) 555 01 23'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Adres</p>
                  <p style={{ fontSize: '1rem', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{settings?.fullAddress || 'Teknopark İstanbul\nPendik, İstanbul'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ flex: '2 1 400px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <Send size={30} color="#fff" />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '10px' }}>Mesajınız İletildi!</h3>
                <p style={{ color: 'var(--text-muted)' }}>En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.</p>
                <button onClick={() => setSubmitted(false)} className="premium-button" style={{ marginTop: '20px' }}>Yeni Mesaj Gönder</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Ad Soyad</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-glass" placeholder="John Doe" />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>E-Posta</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-glass" placeholder="john@example.com" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Konu</label>
                  <input required type="text" name="subject" value={formData.subject} onChange={handleChange} className="input-glass" placeholder="Hangi konuda görüşmek istiyorsunuz?" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Mesajınız</label>
                  <textarea required name="message" value={formData.message} onChange={handleChange} className="input-glass" placeholder="Mesajınızı buraya yazın..." style={{ minHeight: '120px', resize: 'vertical' }}></textarea>
                </div>

                {/* reCAPTCHA - Using Google's test key for development (always passes) */}
                <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={(val) => setCaptchaValue(val)}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="premium-button" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  {!isSubmitting && <Send size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Iletisim;
