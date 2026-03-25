"use client"
import { useState } from 'react';
import { MessageSquare, BookOpen, AlertCircle, Send, ChevronDown, CheckCircle } from 'lucide-react';

export default function Support() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const faqs = [
    { q: "Does it support all Fortnite seasons?", a: "Yes, Pathgen supports replay files from Chapter 1 through the present. Some legacy versions (Chapter 2-3) have limited telemetry data due to engine shifts." },
    { q: "What happens if my replay fails to parse?", a: "If a parse fails due to an engine error, credits are NOT deducted. You are only charged for successful 200 OK responses with valid data." },
    { q: "What is the difference between null and 0?", a: "A 'null' value typically means the data point was not recorded (e.g., player out of range), whereas '0' is a literal value (e.g., zero distance traveled)." },
    { q: "How fast is the sub-second parsing?", a: "Our average parse time for a full competitive match is 842ms. Free endpoints respond in under 30ms globally." }
  ];

  const toggleFaq = (i: number) => {
    setActiveFaq(activeFaq === i ? null : i);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitSuccess(true);
  };

  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '1000px', margin: '0 auto'}}>
      
      <div style={{marginBottom: '80px', textAlign: 'center'}}>
         <h1 style={{fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '24px'}}>Support Hub</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6}}>
            Everything you need to troubleshoot, debug, and optimize your integration.
         </p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '80px'}}>
         {[
            { title: "Documentation", desc: "Our core reference for endpoints and schemas.", icon: <BookOpen size={24} />, link: "/docs" },
            { title: "Developer Tutorials", desc: "Implementation guides for real-world apps.", icon: <MessageSquare size={24} />, link: "/tutorials" },
            { title: "System Status", desc: "Live API status and maintenance history.", icon: <AlertCircle size={24} />, link: "https://status.pathgen.dev" }
         ].map((card, i) => (
            <div key={i} style={{padding: '32px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '32px', textAlign: 'center'}} className="card">
               <div style={{width: '56px', height: '56px', borderRadius: '16px', background: '#fff', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
                  {card.icon}
               </div>
               <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px'}}>{card.title}</h3>
               <p style={{fontSize: '0.9rem', color: '#6B7280', marginBottom: '24px', lineHeight: 1.5}}>{card.desc}</p>
               <a href={card.link} style={{fontSize: '0.9rem', fontWeight: 700, color: '#000', textDecoration: 'underline'}}>Visit {card.title}</a>
            </div>
         ))}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px'}}>
         {/* FAQ */}
         <div>
            <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '40px'}}>Common Questions</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
               {faqs.map((faq, i) => (
                  <div key={i} style={{borderBottom: '1px solid #F3F4F6', paddingBottom: '16px'}}>
                     <button 
                        onClick={() => toggleFaq(i)}
                        style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left'}}
                     >
                        <span style={{fontSize: '1.1rem', fontWeight: 700, color: '#111827'}}>{faq.q}</span>
                        <ChevronDown size={20} color="#9CA3AF" style={{transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}} />
                     </button>
                     {activeFaq === i && (
                        <div style={{fontSize: '1rem', color: '#6B7280', lineHeight: 1.6, padding: '8px 0 16px 0'}} className="fade-in">
                           {faq.a}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* Contact Form */}
         <div style={{background: '#000', borderRadius: '40px', padding: '48px', color: '#fff'}}>
            {isSubmitSuccess ? (
               <div style={{textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
                     <CheckCircle size={32} />
                  </div>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px'}}>Message Received</h3>
                  <p style={{color: '#9CA3AF', fontSize: '0.95rem', lineHeight: 1.6}}>Our team typically responds to billing and technical issues within 24 hours.</p>
               </div>
            ) : (
               <>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px'}}>Contact Our Team</h3>
                  <p style={{color: '#9CA3AF', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.6}}>Have a question about billing, bulk pricing, or a technical blocker?</p>
                  
                  <form onSubmit={handleSupportSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                     <div>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '8px', letterSpacing: '0.05em'}}>FULL NAME</label>
                        <input type="text" required style={{width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none'}} />
                     </div>
                     <div>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '8px', letterSpacing: '0.05em'}}>TOPIC</label>
                        <select style={{width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', cursor: 'pointer'}}>
                           <option>Technical Issue</option>
                           <option>Billing Question</option>
                           <option>Feature Request</option>
                           <option>Bulk/Enterprise Pricing</option>
                        </select>
                     </div>
                     <div>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '8px', letterSpacing: '0.05em'}}>MESSAGE</label>
                        <textarea required style={{width: '100%', height: '140px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none', fontFamily: 'inherit'}} />
                     </div>
                     <button type="submit" style={{padding: '16px', background: '#fff', color: '#000', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                        <Send size={18} />
                        Submit Request
                     </button>
                  </form>
               </>
            )}
         </div>
      </div>
    </div>
  );
}
