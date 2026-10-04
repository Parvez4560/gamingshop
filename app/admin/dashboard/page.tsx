'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_auth_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px' }}>লোড হচ্ছে...</div>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* টপ বার */}
      <AdminNavbar />

      {/* মূল ড্যাশবোর্ড কন্টেন্ট */}
      <main style={{ padding: '30px' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '10px' }}>স্বাগতম, অ্যাডমিন ড্যাশবোর্ড!</h1>
        <p style={{ color: '#64748b' }}>আপনি সফলভাবে সিকিউরড এরিয়াতে প্রবেশ করেছেন। এখান থেকে আপনার প্রজেক্টের বিভিন্ন সেকশন নিয়ন্ত্রণ করতে পারবেন।</p>
      </main>

    </div>
  );
}