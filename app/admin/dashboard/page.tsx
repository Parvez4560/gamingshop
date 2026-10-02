'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // টোকেন চেক করা
    const token = localStorage.getItem('admin_auth_token');
    if (!token) {
      // টোকেন না থাকলে লগইন পেজে পাঠিয়ে দেওয়া
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    router.replace('/admin/login');
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>লোড হচ্ছে...</div>;
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>স্বাগতম, অ্যাডমিন ড্যাশবোর্ড!</h1>
      <p>আপনি সফলভাবে সিকিউরড এরিয়াতে প্রবেশ করেছেন।</p>
      
      <button 
        onClick={handleLogout}
        style={{ marginTop: '20px', padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        লগআউট করুন
      </button>
    </div>
  );
}