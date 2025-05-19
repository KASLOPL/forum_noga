import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Settings() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  useEffect(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn || isLoggedIn !== 'true') {
        navigate('/'); // przekierowanie do strony logowania
      }
    }, [navigate]);
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h2>SnapSolve</h2>
        <button onClick={() => navigate('/addquestion')}>Add question</button><br /><br />
        <button onClick={() => navigate('/main')}>Home</button><br /><br />
        <button>Notifications</button><br /><br />
        <button>Specialist</button><br /><br />
        <button>My Questions</button><br /><br />
        <button onClick={() => navigate('/zakładki')}>Bookmarks</button><br /><br />
        <button onClick={() => navigate('/settings')}>Settings</button><br /><br />
        <button>Help & FAQ</button><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <button onClick={handleLogout}>Sign out</button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px' }}>
        
       <button>Account</button>
       <button>Notifications</button>
       <button>Privacy</button>
       <button>Appearance</button>
        
      </div>
      
    </div>
  );
}

export default Settings;
