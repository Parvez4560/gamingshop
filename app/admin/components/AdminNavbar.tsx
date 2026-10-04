import AdminMenu from './AdminMenu';

export default function AdminNavbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 900
    }}>
      {/* বাঁ পাশে লোগো বা টাইটেল */}
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
        অ্যাডমিন প্যানেল
      </div>

      {/* ভবিষ্যতে জরুরি নোটিফিকেশন বা স্ট্যাটাস এখানে রাখা যাবে */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* ডান পাশের মেনু আইকন ও ড্রয়ার */}
        <AdminMenu />
      </div>
    </nav>
  );
}