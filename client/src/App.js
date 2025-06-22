import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [editFile, setEditFile] = useState('');
  const [editContent, setEditContent] = useState('');
  const [deleteFile, setDeleteFile] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }

    try {
      const res = await axios.post(`${API_URL}/upload`, formData);
      alert(res.data);
    } catch (err) {
      alert('❌ Upload failed');
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axios.post(`${API_URL}/edit`, {
        filename: editFile,
        content: editContent
      });
      alert(res.data);
    } catch (err) {
      alert('❌ Edit failed');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.post(`${API_URL}/delete`, {
        filename: deleteFile
      });
      alert(res.data);
    } catch (err) {
      alert('❌ Delete failed');
    }
  };

  const getFileList = async () => {
    try {
      const res = await axios.get(`${API_URL}/files`);
      setFileList(res.data);
    } catch (err) {
      alert('❌ Error fetching files');
    }
  };

  return (
    <div className="container">
      <h1>📂 MCP File Management System</h1>

      <section>
        <h2>📤 Upload Files</h2>
        <input type="file" multiple onChange={e => setFiles(e.target.files)} />
        <button onClick={handleUpload}>Upload</button>
      </section>

      <section>
        <h2>📝 Edit File</h2>
        <input
          placeholder="Enter filename"
          value={editFile}
          onChange={e => setEditFile(e.target.value)}
        />
        <textarea
          placeholder="New file content"
          value={editContent}
          onChange={e => setEditContent(e.target.value)}
          rows="4"
        />
        <button onClick={handleEdit}>Edit File</button>
      </section>

      <section>
        <h2>🗑️ Delete File</h2>
        <input
          placeholder="Enter filename"
          value={deleteFile}
          onChange={e => setDeleteFile(e.target.value)}
        />
        <button onClick={handleDelete}>Delete</button>
      </section>

      <section>
        <h2>📄 Uploaded Files</h2>
        <button onClick={getFileList}>Refresh File List</button>
        <ul>
          {fileList.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
