"use client"
import { useState, useEffect } from 'react';
import { X, Rocket } from 'lucide-react';
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

export default function Billing() {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const userEmail = user?.email || "";

  const [balance, setBalance] = useState<number>(0);
  const [autoReload, setAutoReload] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const taxRate = 0.06;
  const subtotal = purchaseAmount;
  const taxes = purchaseAmount * taxRate;
  const total = subtotal + taxes;
  const creditsReceived = purchaseAmount * 100;

  useEffect(() => {
    if (!userEmail) return;

    const fetchBilling = async () => {
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
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchBilling();
  }, [userEmail]);

    const handleBuyCredits = async () => {
    if (isProcessing) return;
    if (purchaseAmount < 5) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: purchaseAmount, 
          email: userEmail,
          orgId: currentOrg?.id || 'personal'
        }),
      });
      
      const { url, error } = await response.json();
      if (error) {
        alert(error);
        return;
      }
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (e: unknown) { 
      console.error(e); 
      alert("Billing connection failed. Check your network.");
    } finally { 
      setIsProcessing(false); 
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
       // Refresh or alert success? State will update automatically from Firestore listener or fetch
       console.log("Stripe order confirmed.");
    }
  }, []);

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
      
      {/* HORIZONTALLY OPTIMIZED MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(8px)', 
          padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999
        }}>
          <div className="fade-in shadow-xl" style={{
            width: '100%', maxWidth: '880px', background: '#fff', borderRadius: '24px', padding: '48px', 
            position: 'relative', border: '1px solid var(--border-color)', margin: 'auto'
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
                              border: '1.5px solid #635BFF', fontSize: '1rem', fontWeight: 600,
                              outline: 'none', boxShadow: '0 0 0 2px rgba(99, 91, 255, 0.1)'
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
                     <div style={{display: 'flex', gap: '16px'}}>
                        <div style={{flex: 1}}>
                           <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px'}}>Min. balance reaches:</label>
                           <input disabled style={{width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#9CA3AF', cursor: 'not-allowed', fontSize: '0.85rem'}} />
                        </div>
                        <div style={{flex: 1}}>
                           <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px'}}>Refill balance to:</label>
                           <input disabled style={{width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#9CA3AF', cursor: 'not-allowed', fontSize: '0.85rem'}} />
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
                       onClick={handleBuyCredits} 
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
        </div>
      )}

      {/* Main UI */}
      <div style={{background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '48px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'}}>
         <h2 style={{fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '8px'}}>Credit balance</h2>
         <div style={{color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '40px', maxWidth: '800px'}}>
            Your credit balance will be consumed with Pathgen API, Pathgen Toolkit and Pathgen Playground usage. You can buy credits directly or set up auto-reload thresholds.
         </div>

         <div style={{display: 'flex', gap: '48px', alignItems: 'flex-start'}}>
            <div style={{
               width: '320px', height: '190px', borderRadius: '24px', background: 'linear-gradient(135deg, #F3F1ED 0%, #E3E0DA 100%)',
               display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
               boxShadow: 'inset 0 0 40px rgba(255,255,255,0.4)', border: '1px solid #DEDAD3'
            }}>
               <div style={{fontSize: '3.5rem', fontWeight: 500, color: 'var(--text-primary)'}}>${balance.toFixed(2)}</div>
               <div style={{fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)'}}>Remaining Balance</div>
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

         <div style={{
            marginTop: '40px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', 
            borderRadius: '16px', padding: '16px 24px', display: 'flex', 
            alignItems: 'center', justifyContent: 'space-between'
         }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
               <Rocket size={16} color="var(--text-primary)" />
               Pay after-the-fact with monthly invoicing by contacting the Pathgen accounts team.
            </div>
            <button style={{
               background: 'transparent', border: '1px solid var(--border-color)', 
               padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer'
            }}>Contact Sales</button>
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
