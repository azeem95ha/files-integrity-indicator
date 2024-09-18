import React, { useState } from "react";
import axios from "axios";
import './App.css'; // Importing the CSS for styling

function App() {
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [algorithm, setAlgorithm] = useState("sha256");
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleFile1Change = (event) => {
    setSelectedFile1(event.target.files[0]);
  };

  const handleFile2Change = (event) => {
    setSelectedFile2(event.target.files[0]);
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile1 || !selectedFile2) {
      alert("Please select two files to compare.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", selectedFile1);
    formData.append("file2", selectedFile2);
    formData.append("algorithm", algorithm);

    try {
      const response = await axios.post("http://127.0.0.1:5000/compare", formData);
      setComparisonResult(response.data);
    } catch (error) {
      console.error("There was an error comparing the files!", error);
    }
  };

  return (
    <div className="App">
      <h1>File Comparator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select First File:</label>
          <input type="file" onChange={handleFile1Change} />
        </div>
        <div>
          <label>Select Second File:</label>
          <input type="file" onChange={handleFile2Change} />
        </div>
        <div>
          <label>Select Algorithm:</label>
          <select value={algorithm} onChange={handleAlgorithmChange}>
            <option value="md5">MD5</option>
            <option value="sha1">SHA-1</option>
            <option value="sha256">SHA-256</option>
          </select>
        </div>
        <button type="submit">Compare Files</button>
      </form>

      {comparisonResult && (
        <div>
          <h3>Comparison Result:</h3>
          <p><strong>File 1 Hash:</strong> {comparisonResult.hash1}</p>
          <p><strong>File 2 Hash:</strong> {comparisonResult.hash2}</p>
          <p>
            <strong>Are files identical?</strong> {comparisonResult.are_identical ? "Yes" : "No"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
