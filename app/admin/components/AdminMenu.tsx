'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    router.replace('/admin/login');
  };

  // মেনু আইটেমগুলোর তালিকা (এখান থেকে খুব সহজেই সিরিয়ালি সাজাতে পারবেন)
  const menuItems = [
    { name: 'ড্যাশবোর্ড', href: '/admin/dashboard', icon: '📊' },
    { name: 'পোস্ট ম্যানেজমেন্ট', href: '/admin/posts', icon: '📝' },
    { name: 'সেটিংস', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* ডান পাশের মেনু টগল বাটন */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          color: '#1e293b',
          transition: 'all 0.2s ease'
        }}
        title="মেনু খুলুন"
      >
        ☰
      </button>

      {/* ব্যাকগ্রাউন্ড ওভারলে */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* ডান পাশ থেকে স্লাইড হয়ে আসা প্রফেশনাল ড্রয়ার */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? '0' : '-320px',
        width: '300px',
        height: '100vh',
        background: '#ffffff',
        boxShadow: '-10px 0 25px rgba(0,0,0,0.08)',
        zIndex: 999,
        transition: 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}>
        
        {/* ড্রয়ারের হেডার */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '20px 24px', 
          borderBottom: '1px solid #f1f5f9',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🔐</span>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>অ্যাডমিন প্যানেল</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ 
              background: '#e2e8f0', 
              border: 'none', 
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              color: '#475569',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* মেনু লিংকগুলোর সিরিয়াল */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          padding: '20px 16px', 
          flex: 1, 
          overflowY: 'auto' 
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', paddingLeft: '12px', marginBottom: '5px' }}>
            মূল মেনু
          </div>

          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={index}
                href={item.href} 
                onClick={() => setIsOpen(false)}
                style={{ 
                  textDecoration: 'none', 
                  color: isActive ? '#2563eb' : '#334155', 
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '15px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: isActive ? '#eff6ff' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background 0.2s'
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* সবার নিচে লগআউট সেকশন */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%',
              padding: '12px', 
              background: '#fee2e2', 
              color: '#dc2626', 
              border: 'none', 
              borderRadius: '10px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <span>🚪</span> লগআউট করুন
          </button>
        </div>

      </div>
    </>
  );
}