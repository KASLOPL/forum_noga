import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './addquestion.css';
import { Upload, ChevronDown, ChevronLeft } from 'lucide-react';
import { 
  FiBookmark, FiHome, FiLogOut, FiMessageSquare, FiPlus, 
  FiSettings, FiUser, FiUsers, FiHelpCircle, FiZap 
} from 'react-icons/fi';

const AddQuestion = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('/addquestion');
  const [formData, setFormData] = useState({
    title: '', caption: '', category: '', type: 'Error in code', urgent: false, answerDate: ''
  });
  const [tags, setTags] = useState(['Java', 'Beginner', 'Eclipse']);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Guest', role: 'Visitor' });

  // Auth and user setup
  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') return navigate('/');
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser({ name: storedUser.name || 'Guest', role: storedUser.role || 'Visitor' });
    } catch {
      navigate('/');
    }
  }, [navigate]);

  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/');
  };

  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const removeTag = (tagToRemove) => setTags(tags.filter(tag => tag !== tagToRemove));
  const addTag = (newTag) => {
    if (!tags.includes(newTag)) setTags([...tags, newTag]);
    setTagDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.caption || !tags.length || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Posting question:", { ...formData, tags, user });
  };

  const availableTags = [
    'Python', 'Java', 'SQL', 'html', 'css', 'javascript', 'react',
    'node.js', 'flask', 'arduino', 'linux', 'database', 'networking',
    'school_project', 'teamwork', 'presentation', 'figma', 'ux/ui', 'pitch_deck'
  ];

  const navItems = [
    { path: '/main', icon: FiHome, label: 'Home' },
    { path: '/notifications', icon: FiMessageSquare, label: 'Notifications' },
    { path: '/specialists', icon: FiUsers, label: 'Specialists' },
    { path: '/myquestions', icon: FiUser, label: 'My Questions' },
    { path: '/bookmarks', icon: FiBookmark, label: 'Bookmarks' }
  ];

  const secondaryNavItems = [
    { path: '/settings', icon: FiSettings, label: 'Settings' },
    { path: '/help', icon: FiHelpCircle, label: 'Help & FAQ' }
  ];

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <a href="#" className={`template-nav-item ${activeItem === item.path ? 'active' : ''}`}
         onClick={(e) => { e.preventDefault(); handleNavigation(item.path); }}>
        <Icon />
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <div className="caloscAdd">
      <header className="template-header">
        <div className="template-header-container">
          <div className="header-left">
            <div className="template-logo">
              <div className="template-logo-icon"><FiZap /></div>
              <span className="template-logo-text">
                Snap<span className="template-logo-text-highlight">solve</span>
              </span>
            </div>
            <button className="back-btn" onClick={() => navigate('/main')}>
              <ChevronLeft size={20} />
            </button>
            <span className="page-title">Add Question</span>
          </div>
          <div className="header-right">
            <button className="cancel-btn" onClick={() => navigate('/main')}>Cancel</button>
            <button className="post-btn" onClick={handleSubmit}>Post</button>
          </div>
        </div>
      </header>

      <div className="app-container">
        <aside className="template-sidebar">
          <div className="template-sidebar-content">
            <div className="template-add-question-button-container">
              <button className="template-add-question-button active-add-question">
                <span>ADD QUESTION</span>
                <div className="template-plus-icon-container"><FiPlus /></div>
              </button>
            </div>

            <nav className="template-sidebar-nav">
              {navItems.map(item => <NavItem key={item.path} item={item} />)}
            </nav>

            <div className="template-sidebar-nav-secondary">
              {secondaryNavItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          </div>

          <div className="template-sidebar-footer">
            <button className="template-sign-out-button" onClick={handleLogout}>
              <FiLogOut /> Sign out
            </button>
          </div>
        </aside>

        <div className="main-content">
          <div className="content-wrapper">
            <div className="form-container">
              <div className="form-header">
                <h1>Ask a Specialist</h1>
                <p className="form-description">
                  Need help with your code? Ask an expert and get a quick answer! You can{' '}
                  <span className="highlight">attach a code file</span>, select a question type, and{' '}
                  <span className="highlight">mark it as urgent</span>.
                </p>
              </div>

              <form className="question-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Question Title<span className="required">*</span></label>
                  <input type="text" className="form-input" placeholder="Enter your question title"
                         value={formData.title} onChange={(e) => updateForm('title', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Caption<span className="required">*</span></label>
                  <textarea className="form-textarea" placeholder="Write the question caption"
                            value={formData.caption} onChange={(e) => updateForm('caption', e.target.value)} rows={6} />
                  <div className="character-count">{formData.caption.length}/500 Characters</div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Add Some Tags <span className="min-tags">(min. 1)</span><span className="required">*</span>
                  </label>
                  <div className="tags-container">
                    {tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                        <button type="button" className="tag-remove" onClick={() => removeTag(tag)}>×</button>
                      </span>
                    ))}
                    <div className="simple-tag-dropdown-container">
                      <button type="button" className="simple-add-tag-btn"
                              onClick={() => setTagDropdownOpen(!tagDropdownOpen)}>
                        Add Tags <ChevronDown size={16} />
                      </button>
                      {tagDropdownOpen && (
                        <div className="simple-tag-dropdown">
                          <div className="simple-tag-list">
                            {availableTags.filter(tag => !tags.includes(tag)).map(tag => (
                              <div key={tag} className="simple-tag-item" onClick={() => addTag(tag)}>
                                {tag}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category<span className="required">*</span></label>
                  <div className="select-wrapper">
                    <select className="form-select" value={formData.category}
                            onChange={(e) => updateForm('category', e.target.value)}>
                      <option value="">Select Category</option>
                      <option value="programming">Programming</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-development">Mobile Development</option>
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Question Type</label>
                  <div className="select-wrapper">
                    <select className="form-select" value={formData.type}
                            onChange={(e) => updateForm('type', e.target.value)}>
                      <option value="Error in code">Error in code</option>
                      <option value="General question">General question</option>
                      <option value="Code review">Code review</option>
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>

                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.urgent}
                         onChange={(e) => updateForm('urgent', e.target.checked)} />
                  I need a quick answer
                </label>

                <div className="form-group">
                  <label className="form-label">By when do you want to have the answer?</label>
                  <input type="text" className="form-input" placeholder="dd/mm/yyyy"
                         value={formData.answerDate} onChange={(e) => updateForm('answerDate', e.target.value)} />
                </div>
              </form>
            </div>

            <div className="file-upload-section">
              <div className="file-upload-area">
                <Upload size={32} />
                <div className="upload-content">
                  <div className="upload-title">Select File to Upload</div>
                  <div className="upload-formats">
                    Supported formats:<br />
                    .java, .py, .cpp, .js, .txt, .zip
                  </div>
                  <div className="upload-size">Max 10 MB</div>
                  <input type="file" id="fileInput" style={{ display: 'none' }}
                         onChange={(e) => console.log('File selected:', e.target.files[0])} />
                  <button type="button" className="select-file-btn"
                          onClick={() => document.getElementById('fileInput').click()}>
                    <Upload size={16} />
                    Select File
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="submit-section">
            <button type="submit" className="submit-btn" onClick={handleSubmit}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;