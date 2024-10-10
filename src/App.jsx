import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './App.css';
function App() {
  const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';
  const isClient = useMemo(() => typeof window !== 'undefined', []);

  const [isLoaded, setIsLoaded] = useState(false);
  const [amount, setAmount] = useState(''); 


  const loadScript = useCallback(
    (scriptUrl) => {
      if (!isClient) return;
      return new Promise((resolve, reject) => {
        const scriptTag = document.createElement('script');
        scriptTag.src = scriptUrl;
        scriptTag.onload = (ev) => {
          setIsLoaded(true);
          resolve(ev);
        };
        scriptTag.onerror = (err) => reject(err);
        document.body.appendChild(scriptTag);
      });
    },
    [isClient]
  );

  useEffect(() => {
    if (!checkScriptLoaded()) {
      (async () => {
        try {
          await loadScript(RAZORPAY_SCRIPT);
        } catch (error) {
          console.error('Error loading Razorpay script:', error);
        }
      })();
    }
  }, [checkScriptLoaded, loadScript]);

  const handlePayment = () => {
    if (!isLoaded) {
      toast.loading('Razorpay script is still loading...');
      return;
    }

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const options = {
      // key: 'Enter Yout Own Secret Id From the Razorpay Account', 
      amount: amount * 100,
      currency: 'INR',
      name: 'Ashish Pvt. Ltd.',
      image:"https://avatars.githubusercontent.com/u/141730191?v=4",
      description: 'Test Transaction',
      handler: function (response) {
        toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Ashish Prabhakar',
        email: 'ashishprabhakar1010@gmail.com',
        contact: '*********',
      },
      theme: {
        color: '#3399cc',
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay open error:', error);
      toast.error('Something went wrong during the payment process.');
    }
  };

  return (
    <div className="payment-container">
    <h1>Razorpay Payment Tutorial</h1>
    <div className="payment-box">
      <img 
        src={product}
        alt="Product Image" 
        className="product-image" 
      />
      <label htmlFor="amount">Enter Amount:</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in INR"
      />
      <button onClick={handlePayment} disabled={!isLoaded}>
        {isLoaded ? 'Pay Now' : 'Loading...'}
      </button>
    </div>
  </div>
  <div>Made by - ❤️ Ashish Prabhakar 😊 </div>
  );
}

export default App;
//Support me Guys 
