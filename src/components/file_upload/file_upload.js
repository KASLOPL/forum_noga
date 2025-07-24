import React, { useState } from 'react';
import { Upload, X, FileText, Image, Archive } from 'lucide-react';
import '../../components/file_upload/file_upload.css';

const FileUpload = ({ onFileSelect, disabled = false }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Funkcja do określenia ikony pliku na podstawie rozszerzenia
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return <Image size={24} />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz', 'pdf'].includes(extension)) {
      return <Archive size={24} />;
    } else {
      return <FileText size={24} />;
    }
  };

  // Funkcja do formatowania rozmiaru pliku
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Funkcja do określenia typu pliku dla wyświetlania
  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toUpperCase();
    return extension;
  };

  // Sprawdzenie czy plik ma odpowiedni rozmiar 
  const isFileSizeValid = (file) => {
    const maxSize = 160 * 1024; // 160 KB
    return file.size <= maxSize;
  };

  // Obsługa wyboru pliku
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const fileId = Date.now() + Math.random();
      const isValid = isFileSizeValid(file);
      const fileInfo = {
        id: fileId,
        file: file,
        name: file.name,
        size: file.size,
        type: getFileType(file.name),
        isValid: isValid,
        status: isValid ? 'uploading' : 'error'
      };
      setUploadedFiles(prev => [...prev, fileInfo]);
      if (isValid) {
        simulateUpload(fileId);
      }
    });
    if (onFileSelect && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  // Symulacja procesu uploadu z progress barem
  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles(prev =>
          prev.map(file =>
            file.id === fileId
              ? { ...file, status: 'completed' }
              : file
          )
        );
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      } else {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }
    }, 200);
  };

  // Usunięcie pliku z listy
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  return (
    <div className="enhanced-file-upload">
      {/* Obszar przeciągania i upuszczania */}
      <div className="file-upload-area">
        <Upload size={32} className="upload-icon" />
        <div className="upload-content">
          <div className="upload-title">Select File to Upload</div>
          <div className="upload-formats">
            Supported formats:<br />
            .java, .py, .cpp, .js, .txt, .zip, .jpg, .png, .pdf
          </div>
          <div className="upload-size">Max 160 KB</div>
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            disabled={disabled}
            accept=".java,.py,.cpp,.js,.txt,.zip,.jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx"
            multiple
          />
          <button
            type="button"
            className="select-file-btn"
            onClick={() => document.getElementById('fileInput').click()}
            disabled={disabled}
          >
            <Upload size={16} />
            Select File
          </button>
        </div>
      </div>
      
      {/* Lista przesłanych plików */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files-list">
          {uploadedFiles.map((file) => (
            <div key={file.id} className={`file-item ${file.status}`}>
              <div className="file-info">
                <div className="file-icon">
                  {getFileIcon(file.name)}
                  <span className="file-type">{file.type}</span>
                </div>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size-status">
                    <span className="file-size">
                      {formatFileSize(file.size)} of {formatFileSize(file.size)}
                    </span>
                    {file.status === 'uploading' && (
                      <span className="upload-status">
                        &#x1F4E4; Uploading...
                      </span>
                    )}
                    {file.status === 'completed' && (
                      <span className="upload-status completed">
                        &#x2705; Completed
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span className="upload-status error">
                        Wrong size!
                      </span>
                    )}
                  </div>

                  {/* Uploading */}
                  {file.status === 'uploading' && (
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${uploadProgress[file.id] || 0}%` }}
                      ></div>
                    </div>
                  )}
                  {file.status === 'completed' && (
                    <div className="progress-bar">
                      <div className="progress-fill completed" style={{ width: '100%' }}></div>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="remove-file-btn"
                onClick={() => removeFile(file.id)}
                disabled={disabled}
              >
                {file.status === 'error' ? (
                  <div className="delete-icon">&#128465;</div>
                ) : (
                  <X size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;