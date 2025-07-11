import React, { useState, useEffect, useRef } from "react";
import "./edit_profile.css";
import { fetchUserData, saveUserData } from '../../utils/updateUserDataInLocal';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const UploadIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const PlusIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const EditProfile = ({ currentUser, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    fieldOfStudy: "",
    bio: "",
  });

  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [studyDropdownOpen, setStudyDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  

  const schoolOptions = [
    "Uniwersytet Warszawski",
    "Politechnika Warszawska",
    "Szkoła Główna Handlowa",
    "Uniwersytet Jagielloński",
    "Politechnika Krakowska",
    "Uniwersytet Wrocławski",
    "Politechnika Gdańska",
    "Uniwersytet im. Adama Mickiewicza"
  ];

  const studyOptions = [
    "Informatyka",
    "Inżynieria Oprogramowania",
    "Zarządzanie",
    "Ekonomia",
    "Matematyka",
    "Fizyka",
    "Chemia",
    "Biologia",
    "Psychologia",
    "Prawo",
    "Medycyna",
    "Architektura"
  ];

  useEffect(() => {
    // Sprawdź czy currentUser istnieje w props lub localStorage
    let user = currentUser;
    if (!user) {
      try {
        const localUser = localStorage.getItem('currentUser');
        if (localUser) {
          user = JSON.parse(localUser);
        }
      } catch (error) {
        console.error('Error parsing currentUser from localStorage:', error);
      }
    }

    if (user) {
      setFormData({
        name: user.userName || user.name || "",
        school: user.school || "",
        fieldOfStudy: user.fieldOfStudy || "",
        bio: user.bio || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
  e?.preventDefault();
  
  if (!formData.name.trim()) {
    alert("Nazwa jest wymagana!");
    return;
  }

  // Sprawdź czy user istnieje
  let user = currentUser;
  if (!user) {
    try {
      const localUser = localStorage.getItem('currentUser');
      if (localUser) {
        user = JSON.parse(localUser);
      }
    } catch (error) {
      console.error('Error parsing currentUser from localStorage:', error);
    }
  }

  if (!user || !user.uid) {
    alert("Błąd: Nie można znaleźć danych użytkownika!");
    return;
  }

  setIsLoading(true);

  try {
    const success = await saveUserData(user.uid, {
      userName: formData.name,
      school: formData.school,
      fieldOfStudy: formData.fieldOfStudy,
      bio: formData.bio,
      email: user.email || "",
    });

    if (success) {
      // Pobierz świeże dane z bazy danych po zapisaniu
      const freshUserData = await fetchUserData(user.uid);
      console.log(freshUserData);
      
      if (freshUserData) {
        // Aktualizuj localStorage świeżymi danymi z bazy
        const updatedUser = {
          ...user,
          ...freshUserData  // Użyj danych z bazy zamiast formData
        };
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log(localStorage.getItem('currentUser'));
        
        // Wywołaj callback z świeżymi danymi
        if (onSave) {
          onSave(updatedUser);
        }
        
        // Zaktualizuj formData z świeżymi danymi z bazy
        setFormData({
          name: freshUserData.userName || freshUserData.name || "",
          school: freshUserData.school || "",
          fieldOfStudy: freshUserData.fieldOfStudy || "",
          bio: freshUserData.bio || "",
        });
        
        alert("Profil został pomyślnie zaktualizowany!");
      } else {
        throw new Error("Nie udało się pobrać zaktualizowanych danych z bazy");
      }
    } else {
      throw new Error("Nie udało się zapisać profilu");
    }
    
  } catch (error) {
    console.error("Błąd podczas zapisywania profilu:", error);
    alert("Wystąpił błąd podczas zapisywania profilu. Spróbuj ponownie.");
  } finally {
    setIsLoading(false);
  }

 if (selectedFile) {
  const formData = new FormData();
  formData.append('prof', selectedFile);

  try {
    const uploadResponse = await fetch('http://localhost:3001/api/uploadProfs', {
      method: 'POST',
      body: formData,
    });

    if (uploadResponse.ok) {
      console.log('Plik przesłany!');
    } else {
      console.error('Błąd przesyłania pliku.');
    }
  } catch (uploadError) {
    console.error('Błąd podczas przesyłania pliku:', uploadError);
  }
}

};

  const handleImageUpload = () => {

  };

  const getUserInitials = () => {
    const name = formData.name || currentUser?.userName || currentUser?.name || "Guest";
    return name === "Guest" ? "GU" : name.substring(0, 2).toUpperCase();
  };

  const handleSchoolSelect = (school) => {
    handleInputChange("school", school);
    setSchoolDropdownOpen(false);
  };

  const handleStudySelect = (study) => {
    handleInputChange("fieldOfStudy", study);
    setStudyDropdownOpen(false);
  };

  return (
    <div className="predit">
      <div className="profile-editor">
        <div className="profile-container">
          {/* Header */}
          <div className="header">
            <div className="header-left">
              <button className="back-button" onClick={onClose}>
                <ArrowLeftIcon />
              </button>
              <h1 className="header-title">Edit Your Profile</h1>
            </div>
            <button 
              className="save-button" 
              onClick={handleSave}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="content">
            {/* Avatar Section */}
            <div className="section">
              <label className="label">Avatar</label>
              <div className="avatar-container">
                <div className="avatar-wrapper">
                  <div className="avatar">{getUserInitials()}</div>
                  <button className="avatar-plus">
                    <PlusIcon />
                  </button>
                </div>
                <div className="upload-section">
                  <input 
                        type="file" 
                        name="file"
                        id="fileInput" 
                        style={{ display: 'none' }}
                       ref={fileInputRef}
                       onChange={(e) => {
                        const file = e.target.files[0];
                        console.log("Wybrany plik:", file);
                        setSelectedFile(file);
                      }}
                      />
                  <button
                    className="upload-button"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <UploadIcon />
                    Upload new image
                  </button>
                  <div className="upload-info">
                    At least 800x800 px recommended
                    <br />
                    JPG or PNG is allowed
                  </div>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div className="section">
              <label className="label" htmlFor="name">
                Name *
              </label>
              <input
                id="name"
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            {/* School and Field of Study */}
            <div className="section">
              <div className="grid-two">
                <div className="dropdown-container">
                  <label className="label" htmlFor="school">
                    School/University
                  </label>
                  <div className="dropdown-wrapper">
                    <input
                      id="school"
                      type="text"
                      className="input dropdown-input"
                      value={formData.school}
                      onChange={(e) => handleInputChange("school", e.target.value)}
                      placeholder="Enter your school"
                      onClick={() => setSchoolDropdownOpen(!schoolDropdownOpen)}
                    />
                    <button 
                      className="dropdown-arrow"
                      onClick={() => setSchoolDropdownOpen(!schoolDropdownOpen)}
                    >
                      <ChevronDownIcon />
                    </button>
                    {schoolDropdownOpen && (
                      <div className="dropdown-menu">
                        {schoolOptions.map((school, index) => (
                          <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSchoolSelect(school)}
                          >
                            {school}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="dropdown-container">
                  <label className="label" htmlFor="fieldOfStudy">
                    Field of Study
                  </label>
                  <div className="dropdown-wrapper">
                    <input
                      id="fieldOfStudy"
                      type="text"
                      className="input dropdown-input"
                      value={formData.fieldOfStudy}
                      onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                      placeholder="Enter your field of study"
                      onClick={() => setStudyDropdownOpen(!studyDropdownOpen)}
                    />
                    <button 
                      className="dropdown-arrow"
                      onClick={() => setStudyDropdownOpen(!studyDropdownOpen)}
                    >
                      <ChevronDownIcon />
                    </button>
                    {studyDropdownOpen && (
                      <div className="dropdown-menu">
                        {studyOptions.map((study, index) => (
                          <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleStudySelect(study)}
                          >
                            {study}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="section">
              <label className="label" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                className="textarea"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;