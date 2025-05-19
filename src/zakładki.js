import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Zakladki() {
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
        
       <div style={{background: '#505050', border: '1px solid #ccc', padding: '10px', marginBottom: '15px'}}>
       <p>dupa dupa zakładeczki</p>
        </div> 
        <div style={{background: '#505050', border: '1px solid #ccc', padding: '10px', marginBottom: '15px'}}>
       <p>dupa dupa zakładeczki</p>
        </div> 
        <div style={{background: '#505050', border: '1px solid #ccc', padding: '10px', marginBottom: '15px'}}>
       <p>dupa dupa zakładeczki</p>
        </div> 
        <div style={{background: '#505050', border: '1px solid #ccc', padding: '10px', marginBottom: '15px'}}>
       <p>dupa dupa zakładeczki</p>
        </div> 
        <div style={{background: '#505050', border: '1px solid #ccc', padding: '10px', marginBottom: '15px'}}>
       <p>dupa dupa zakładeczki</p>
        </div> 
        <div style={{background: '#505050', border: '1px solid #ccc', padding: '10px', marginBottom: '15px'}}>
       <p>dupa dupa zakładeczki</p>
        </div> 
        
      </div>
      
    </div>
  );
}

export default Zakladki;
