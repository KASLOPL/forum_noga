import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './addquestion.css';
import {
  Home, Bell, Users, MessageSquare, Activity, Settings,
  HelpCircle, ChevronLeft, Calendar, Upload, AlertCircle,
  ChevronDown, Fingerprint, PlusSquare
} from 'lucide-react';

const AddQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('Error in code');
  const [needQuickAnswer, setNeedQuickAnswer] = useState(false);
  const [tags, setTags] = useState(['Java', 'Beginner', 'Eclipse']);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [answerDate, setAnswerDate] = useState(''); 

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserName(storedUser.name || 'Unknown');
      setUserRole(storedUser.role || 'Student');
    } else {
      setUserName('Guest');
      setUserRole('Visitor');
    }
  }, []);

  const handleBack = () => {
    window.location.href = '/main';
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTag = (newTag) => {
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagDropdownOpen(false);
  };

  const availableTags = [
    'Python', 'Java', 'SQL', 'html', 'css', 'javascript', 'react',
    'node.js', 'flask', 'arduino', 'linux', 'database', 'networking',
    'school_project', 'teamwork', 'presentation', 'figma', 'ux/ui', 'pitch_deck'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionTitle || !caption || tags.length === 0 || !selectedCategory) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const formData = {
      title: questionTitle,
      caption,
      category: selectedCategory,
      type: selectedQuestionType,
      urgent: needQuickAnswer,
      tags,
      answerDate,
      user: { name: userName, role: userRole },
    };
  
    console.log("Posting question:", formData);
  };

  return (
    <div className="caloscAdd">
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-content">
            <div className="add-question-button-container">
              <button className="add-question-button">
                <span>ADD QUESTION</span>
                <div className="plus-icon-container">
                  <PlusSquare size={24} />
                </div>
              </button>
            </div>

            <nav className="sidebar-nav">
              <Link to="/main" className="nav-item"> 
                <Home size={20} />
                <span>Home</span>
              </Link>

              <a href="#" className="nav-item">
                <Bell size={20} />
                <span>Notifications</span>
              </a>

              <a href="#" className="nav-item">
                <Users size={20} />
                <span>Specialists</span>
              </a>

              <a href="#" className="nav-item">
                <MessageSquare size={20} />
                <span>My Questions</span>
              </a>

              <a href="#" className="nav-item">
                <Activity size={20} />
                <span>Bookmarks</span>
              </a>
            </nav>

            <div className="sidebar-nav-secondary">
              <a href="#" className="nav-item">
                <Settings size={20} />
                <span>Settings</span>
              </a>

              <Link to="/help" className="nav-item">
                <HelpCircle size={20} />
                <span>Help & FAQ</span>
              </Link>
            </div>
          </div>

          <div className="sidebar-footer">
            <button className="sign-out-button">
              Sign out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <div className="header-left">
              <button className="back-btn" onClick={handleBack}>
                <ChevronLeft size={20} />
              </button>
              <span className="page-title">Add Question</span>
            </div>
            <div className="header-right">
              <button className="cancel-btn">Cancel</button>
              <button className="post-btn">Post</button>
            </div>
          </div>

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

              <form className="question-form">
                <div className="form-group">
                  <label className="form-label">Question Title<span className="required">*</span></label>
                  <div className="input-wrapper">
                    <Fingerprint size={16} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter your question title"
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Caption<span className="required">*</span></label>
                  <textarea
                    className="form-textarea"
                    placeholder="Write the question caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={6}
                  />
                  <div className="character-count">{caption.length}/500 Characters</div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Add Some Tags <span className="min-tags">(min. 1)</span><span className="required">*</span>
                  </label>
                  <div className="tags-container">
                    {tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    <div className="simple-tag-dropdown-container">
                      <button
                        type="button"
                        className="simple-add-tag-btn"
                        onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
                      >
                        Add Tags <ChevronDown size={16} />
                      </button>

                      {tagDropdownOpen && (
                        <div className="simple-tag-dropdown">
                          <div className="simple-tag-list">
                            {availableTags
                              .filter(tag => !tags.includes(tag))
                              .map(tag => (
                                <div
                                  key={tag}
                                  className="simple-tag-item"
                                  onClick={() => addTag(tag)}
                                >
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
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}>
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
                  <div className="select-wrapper question-type-wrapper">
                    <div className="question-type-icon">
                     
                    </div>
                    <select
                      className="form-select question-type-select"
                      value={selectedQuestionType}
                      onChange={(e) => setSelectedQuestionType(e.target.value)}>
                      <option value="Error in code">Error in code</option>
                      <option value="General question">General question</option>
                      <option value="Code review">Code review</option>
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={needQuickAnswer}
                      onChange={(e) => setNeedQuickAnswer(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I need a quick answer
                  </label>
                </div>

            
                <div className="form-group">
                  <label className="form-label">By when do you want to have the answer?</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="dd/mm/yyyy"
                      value={answerDate}
                      onChange={(e) => setAnswerDate(e.target.value)}
                    />
                  </div>
                      
                </div>
               
              </form>
            </div>

            <div className="file-upload-section">
              <div className="file-upload-area">
                <div className="upload-icon">
                  <Upload size={32} />
                </div>
                <div className="upload-content">
                  <div className="upload-title">Select File to Upload</div>
                  <div className="upload-formats">
                    Supported formats:<br />
                    .java, .py, .cpp, .js, .txt, .zip
                  </div>
                  <div className="upload-size">Max 10 MB</div>

                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={(e) => console.log('Wybrano plik:', e.target.files[0])}
                  />

                  <button
                    type="button"
                    className="select-file-btn"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <Upload size={16} />
                    Select File
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="submit-section">
            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;