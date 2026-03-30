"use client"
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Rocket, Check, Zap } from 'lucide-react';
import { firestore } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, collection, query, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-context';
import { useOrg } from '@/lib/context/OrgContext';

interface Invoice {
  id: string;
  date: string;
  type: string;
  status: string;
  cost: string;
  credits?: string;
}

import { useSearchParams } from 'next/navigation';

export default function Billing() {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const searchParams = useSearchParams();
  const userEmail = user?.email || "";
  const success = searchParams.get('success');

  const [balance, setBalance] = useState<number>(0);
  const [autoReload, setAutoReload] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const taxRate = 0.00; 
  const subtotal = purchaseAmount;
  const taxes = purchaseAmount * taxRate;
  const total = subtotal + taxes;
  const creditsReceived = purchaseAmount * 1000;

  useEffect(() => {
    if (!userEmail) return;

    const fetchBilling = async () => {
      if (!firestore) {
        setBalance(150000); 
        setInvoices([
          { id: "DEMO_1", date: "Jan 1, 2026", type: "Standard", status: "Paid", cost: "$5.00" }
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const billRef = doc(firestore, "billing", userEmail);
        const billSnap = await getDoc(billRef);
        
        if (billSnap.exists()) {
          const data = billSnap.data();
          setBalance(data.balance || 0);
          setAutoReload(data.autoReload || false);
        } else {
          await setDoc(billRef, { balance: 0, autoReload: false, tier: 1 });
        }

        const invQ = query(collection(firestore, `billing/${userEmail}/invoices`), orderBy("createdAt", "desc"));
        const invSnap = await getDocs(invQ);
        const fetchedInvoices: Invoice[] = [];
        invSnap.forEach(doc => {
          const d = doc.data();
          fetchedInvoices.push({
            id: doc.id,
            date: d.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || "N/A",
            type: d.type || "Purchase",
            status: d.status || "Paid",
            cost: `$${(d.amount || 0).toFixed(2)}`
          });
        });

        setInvoices(fetchedInvoices);
      } catch (e) { 
          console.error("Billing fetch error:", e); 
          setBalance(150.00); 
      } finally { 
          setIsLoading(false); 
      }
    };
    fetchBilling();
  }, [userEmail]);

  const handleBuyCredits = async (type: 'credits' | 'subscription' = 'credits') => {
    if (isProcessing) return;
    if (type === 'credits' && purchaseAmount < 5) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: purchaseAmount, 
          email: userEmail,
          userId: user?.uid || 'personal',
          type
        }),
      });
      
      const { url, error } = await response.json();
      if (error) {
        alert(error);
        return;
      }
      
      window.location.href = url;
    } catch (e: unknown) { 
      console.error(e); 
      alert("Billing connection failed. Check your network.");
    } finally { 
      setIsProcessing(false); 
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (isLoading) {
    return (
        <div style={{height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
            <div style={{width: '24px', height: '24px', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
            <span style={{fontWeight: 700, color: 'var(--text-secondary)'}}>Loading...</span>
        </div>
    );
  }

  return (
    <div className="fade-in" style={{paddingBottom: '120px', maxWidth: '1000px', margin: '0 auto'}}>
      {success && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', 
          padding: '24px', borderRadius: '16px', color: '#10B981', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'
        }}>
           <Check size={20} strokeWidth={3} />
           Payment successful! Your credits will be updated shortly.
        </div>
      )}
      
      {/* PRICING PLANS MODAL - Centered Viewport */}
      {isPricingModalOpen && mounted && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', 
          padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999
        }}>
          <div className="fade-in shadow-xl" style={{
            width: '100%', maxWidth: '960px', background: '#F9FAFB', borderRadius: '40px', padding: '64px', 
            position: 'relative', border: '1px solid var(--border-color)', textAlign: 'center', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button onClick={() => setIsPricingModalOpen(false)} style={{position: 'absolute', top: '32px', right: '32px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}>
              <X size={24} />
            </button>

            <h1 style={{fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '40px'}}>Plans that grow with you</h1>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', margin: '0 auto', textAlign: 'left'}}>
                {/* Free Plan */}
                <div style={{
                    background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '40px',
                    display: 'flex', flexDirection: 'column', position: 'relative'
                }}>
                    <div style={{marginBottom: '24px'}}>
                        <div style={{width: '48px', height: '48px', borderRadius: '12px', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                            <Rocket size={24} color="#6B7280" />
                        </div>
                        <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px'}}>Free</h3>
                        <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px'}}>For hobbyists and casual creators.</p>
                        <div style={{fontSize: '2.5rem', fontWeight: 500}}>$0 <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400}}>USD / month</span></div>
                    </div>

                    <div style={{padding: '16px', background: '#F9FAFB', borderRadius: '12px', marginBottom: '32px'}}>
                        <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0}}>You are currently on the Free plan.</p>
                    </div>

                    <div style={{marginTop: 'auto'}}>
                        <div style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px'}}>Includes:</div>
                        <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            <li style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Check size={14} color="#10B981" /> 60 req/min Rate Limit
                            </li>
                            <li style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Check size={14} color="#10B981" /> Core Replay Parsing
                            </li>
                            <li style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Check size={14} color="#10B981" /> Public Discovery
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Pro Plan */}
                <div style={{
                    background: '#fff', border: '1.5px solid #111827', borderRadius: '24px', padding: '40px',
                    display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
                }}>
                    <div style={{marginBottom: '24px'}}>
                        <div style={{width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(217, 119, 87, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                            <Zap size={24} color="#D97757" fill="#D97757" />
                        </div>
                        <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px'}}>Pro</h3>
                        <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px'}}>For competitive teams and professional tools.</p>
                        <div style={{fontSize: '2.5rem', fontWeight: 500}}>$15 <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400}}>USD / month</span></div>
                    </div>

                    <button 
                        onClick={() => {
                            setPurchaseAmount(15);
                            handleBuyCredits('subscription');
                        }}
                        disabled={isProcessing}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '12px', background: '#111827',
                            color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                            marginBottom: '32px'
                        }}>
                        {isProcessing && purchaseAmount === 15 ? 'Connecting...' : 'Upgrade to Pro'}
                    </button>

                    <div style={{marginTop: 'auto'}}>
                        <div style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px'}}>Everything in Free, plus:</div>
                        <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            <li style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Check size={14} color="#D97757" /> 2,000 req/min Rate Limit
                            </li>
                            <li style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Check size={14} color="#D97757" /> Gemini AI Intelligence
                            </li>
                            <li style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Check size={14} color="#D97757" /> 25% Credit Purchase Discount
                            </li>
                            <li style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Check size={14} color="#D97757" /> Real-time Webhooks
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* HORIZONTALLY OPTIMIZED MODAL - Centered Viewport */}
      {isModalOpen && mounted && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(12px)', 
          padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999
        }}>
          <div className="fade-in shadow-xl" style={{
            width: '100%', maxWidth: '880px', background: '#fff', borderRadius: '24px', padding: '48px', 
            position: 'relative', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}>
              <X size={24} />
            </button>

            <div style={{marginBottom: '32px'}}>
               <h2 style={{fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px'}}>Add credits</h2>
               <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Your account is on Tier 1. Limit increases with usage.</p>
            </div>

            <div style={{display: 'flex', gap: '48px'}}>
               {/* Left Column: Input and Reload */}
               <div style={{flex: 1.6, display: 'flex', flexDirection: 'column', gap: '40px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px'}}>Credits</label>
                    <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px'}}>Enter an amount between $5 and $100</p>
                    <div style={{position: 'relative', width: '220px'}}>
                        <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-primary)'}}>$</span>
                        <input 
                           type="number" 
                           value={purchaseAmount} 
                           onChange={(e) => setPurchaseAmount(Number(e.target.value))} 
                           style={{
                               width: '100%', padding: '12px 16px 12px 28px', borderRadius: '10px', 
                               border: '1.5px solid #D97757', fontSize: '1rem', fontWeight: 600,
                               outline: 'none', boxShadow: '0 0 0 2px rgba(217, 119, 87, 0.05)'
                           }} 
                        />
                    </div>
                    <div style={{marginTop: '12px', fontSize: '0.8rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'}}>
                       <Rocket size={14} />
                       Yields {creditsReceived.toLocaleString()} Credits
                    </div>
                  </div>

                  {/* Horizontal Auto Reload Config */}
                  <div style={{borderTop: '1px solid #F3F4F6', paddingTop: '32px'}}>
                     <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                        <div style={{maxWidth: '280px'}}>
                           <h4 style={{fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px'}}>Auto reload credits</h4>
                           <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4}}>Avoid service disruptions by auto-reloading credits.</p>
                        </div>
                        <div style={{width: '40px', height: '22px', background: '#E5E7EB', borderRadius: '20px', cursor: 'not-allowed', position: 'relative'}}>
                           <div style={{width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px'}}></div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column: Summary and Button */}
               <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  <div style={{background: '#FAF9F6', borderRadius: '16px', padding: '32px', border: '1px solid #F3F1ED'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', borderBottom: '1px solid #F3F1ED', paddingBottom: '16px'}}>
                       <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}><span>Subtotal</span><span style={{fontWeight: 600}}>${subtotal.toFixed(2)}</span></div>
                       <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)'}}><span>Estimated taxes</span><span>${taxes.toFixed(2)}</span></div>
                       <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-primary)'}}><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                    
                    <button 
                       onClick={() => handleBuyCredits('credits')} 
                       disabled={isProcessing} 
                       className="active-scale"
                       style={{
                          width: '100%', padding: '16px', borderRadius: '12px', background: '#111827', 
                          color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                       }}>
                       {isProcessing ? 'Processing...' : `Buy $${purchaseAmount} of credits`}
                    </button>
                    
                    <p style={{fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '24px', lineHeight: 1.5}}>
                       Credits expire 1 year after purchase.<br/>
                       By clicking &quot;Buy credits&quot; you agree to <span style={{color: 'var(--accent-primary)', cursor: 'pointer'}}>Pathgen&apos;s Credit Terms</span>.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Main UI */}
      {/* TIER MANAGEMENT COMPACT SECTION */}
      <div style={{background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px 48px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
              <div style={{width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #D97757 0%, #C1664C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(217, 119, 87, 0.2)'}}>
                  <Zap size={28} color="white" fill="white" />
              </div>
              <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px'}}>
                      <h2 style={{fontSize: '1.25rem', fontWeight: 700, margin: 0}}>Subscription Plan</h2>
                      <span style={{fontSize: '0.65rem', fontWeight: 900, color: '#D97757', background: 'rgba(217, 119, 87, 0.05)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(217, 119, 87, 0.1)'}}>FREE TIER</span>
                  </div>
                  <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0}}>Unlock AI intelligence, higher rate limits, and real-time data streams.</p>
              </div>
          </div>
          <button 
             onClick={() => setIsPricingModalOpen(true)}
             style={{padding: '12px 24px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s'}}
             onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
             onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
              Manage Tier
          </button>
      </div>

      <div style={{background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '48px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'}}>
         <h2 style={{fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '8px'}}>Credit balance</h2>
         <div style={{color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '40px', maxWidth: '800px'}}>
            Credits are spent when making requests to the PathGen API, using the Toolkit, or running experiments in the Playground. You can purchase credits as needed or configure auto-reload.
         </div>

         <div style={{display: 'flex', gap: '48px', alignItems: 'flex-start'}}>
            <div style={{
               width: '320px', height: '190px', borderRadius: '24px', background: 'linear-gradient(135deg, #F3F1ED 0%, #E3E0DA 100%)',
               display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
               boxShadow: 'inset 0 0 40px rgba(255,255,255,0.4)', border: '1px solid #DEDAD3'
            }}>
               <div style={{fontSize: '3.5rem', fontWeight: 500, color: 'var(--text-primary)'}}>{balance.toLocaleString()}</div>
               <div style={{fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)'}}>Credits Remaining</div>
            </div>

            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '20px'}}>
               <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <span style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase'}}>CHARGED TO</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                     <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
                        background: 'var(--bg-sidebar)', borderRadius: '10px', border: '1px solid var(--border-color)'
                     }}>
                        <div style={{width: '24px', height: '24px', background: '#635BFF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.911 9.771c-1.353-.332-2.155-.668-2.155-1.344 0-.547.472-.942 1.346-.942 1.954 0 3.864.846 3.864.846V4.148s-1.802-.693-3.83-.693C10.22 3.455 8 5.178 8 7.917c0 2.822 2.457 3.654 4.887 4.256 1.487.368 2.052.791 2.052 1.442 0 .616-.622 1.116-1.636 1.116-2.136 0-4.524-.972-4.524-.972L8 18.067s2.055 1.096 4.793 1.096c3.159 0 5.432-1.603 5.432-4.587 0-2.923-1.862-4.472-4.314-5.075z" fill="white"/>
                           </svg>
                        </div>
                        <span style={{fontSize: '0.9rem', fontWeight: 600}}>with Stripe</span>
                     </div>
                     <button 
                        onClick={() => setIsModalOpen(true)}
                        className="active-scale"
                        style={{
                           background: 'var(--text-primary)', color: '#fff', padding: '12px 24px', 
                           borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer'
                        }}>
                        Buy credits
                     </button>
                  </div>
               </div>

               <div style={{
                  background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', 
                  borderRadius: '12px', padding: '16px 20px', display: 'flex', 
                  alignItems: 'center', gap: '16px', justifyContent: 'space-between'
               }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                     <X size={18} style={{padding: '2px', border: '1.5px solid var(--text-secondary)', borderRadius: '50%', flexShrink: 0}} />
                     <span><strong>Auto reload is {autoReload ? 'enabled' : 'disabled'}.</strong> {autoReload ? 'Your credits will automatically refill.' : 'Enable auto reload to avoid API interruptions when credits are fully spent.'}</span>
                  </div>
                  <button style={{
                     background: 'var(--text-primary)', color: '#fff', padding: '8px 24px', 
                     borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer'
                  }}>Edit</button>
               </div>
            </div>
         </div>
      </div>

      <div style={{background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'}}>
         <h2 style={{fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '8px'}}>Invoice history</h2>
         <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '40px'}}>
            Invoices are issued when credits are purchased. All dates are in EDT timezone.
         </p>

         <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
               <tr style={{borderBottom: '1.5px solid var(--border-color)'}}>
                  <th style={{padding: '12px 0', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Date</th>
                  <th style={{padding: '12px 0', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Invoice Type</th>
                  <th style={{padding: '12px 0', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Status</th>
                  <th style={{padding: '12px 0', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Cost</th>
                  <th style={{padding: '12px 0', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Actions</th>
               </tr>
            </thead>
            <tbody>
               {invoices.length === 0 && (
                  <tr>
                     <td colSpan={5} style={{padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>No documented transactions found.</td>
                  </tr>
               )}
               {invoices.map((inv) => (
                  <tr key={inv.id} style={{borderBottom: '1px solid #F3F4F6'}} className="table-row-hover">
                     <td style={{padding: '24px 0', fontSize: '0.95rem', fontWeight: 500}}>{inv.date}</td>
                     <td style={{padding: '24px 0', fontSize: '0.95rem'}}>{inv.type}</td>
                     <td style={{padding: '24px 0', fontSize: '0.95rem', color: 'var(--text-secondary)'}}>{inv.status}</td>
                     <td style={{padding: '24px 0', fontSize: '0.95rem', textAlign: 'right', fontWeight: 500}}>{inv.cost}</td>
                     <td style={{padding: '24px 0', textAlign: 'right'}}>
                        <button style={{background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer'}}>View</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
