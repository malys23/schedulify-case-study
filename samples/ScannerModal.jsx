import React, { useState } from 'react';
import './ScannerModal.css';
import axios from 'axios';

const ScannerModal = ({ isOpen, onClose, fetchEvents }) => {
    const [pdfFile, setPdfFile] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editRowId, setEditRowId] = useState(null);
    const [editedData, setEditedData] = useState({ title: '', date: '', notes: '' });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setPdfFile(file);
    };

    const handleFileUpload = async () => {
        if (!pdfFile) {
            alert('No file selected. Please select a PDF file.');
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication token not found. Please log in again.');
                return;
            }

            const formData = new FormData();
            formData.append('file', pdfFile);

            const response = await axios.post('/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const parsedEntries = response.data.map((entry) => ({
                id: entry.date,
                title: entry.title,
                date: entry.date,
                notes: entry.notes,
            }));
            setEntries(parsedEntries);
        } catch (error) {
            alert('An error occurred while uploading the file. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditRow = (entry) => {
        setEditRowId(entry.id);
        setEditedData(entry);
    };

    const handleSaveRow = () => {
        setEntries(
            entries.map((entry) =>
                entry.id === editRowId ? { ...entry, ...editedData } : entry
            )
        );
        fetchEvents(); //update parents
        setEditRowId(null);
        setEditedData({ title: '', date: '', notes: '' });
    };

    const handleDeleteEntry = (id) => {
        setEntries(entries.filter((entry) => entry.id !== id));
        fetchEvents(); //update parent
    };

    const handleDeleteAllEntries = () => {
        setEntries([]); // Clear the entries
        setPdfFile(null); // Clear the selected file
    };

    const handleSaveAllEntries = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication token not found. Please log in again.');
                return;
            }

            await axios.post('/api/files/events/save', entries, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Entries saved successfully!');
            fetchEvents(); //refresh parent
            setEntries([]);
            setPdfFile(null);
        } catch {
            alert('An error occurred while saving the entries. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Processing your file, please wait...</p>
                </div>
            )}

            <div className="modal-overlay-scanner">
                <div className="modal-content-scanner">
                    <div className="scanner-modal-title">
                        <h2>Upload PDF</h2>
                        <button className="close-btn" onClick={onClose}> X </button>
                    </div>
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <button onClick={handleFileUpload}>Upload PDF</button>

                    {pdfFile && (
                        <div className="process-SCAN">
                            <h3>Extracted Entries</h3>
                            <div className="scanner-table-container">
                                <table className="scanner-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Due Date</th>
                                            <th>Notes</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.map((entry) => (
                                            <tr key={entry.id}>
                                                {editRowId === entry.id ? (
                                                    <>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="title"
                                                                value={editedData.title}
                                                                onChange={(e) =>
                                                                    setEditedData({
                                                                        ...editedData,
                                                                        title: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                name="date"
                                                                value={editedData.date}
                                                                onChange={(e) =>
                                                                    setEditedData({
                                                                        ...editedData,
                                                                        date: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                name="notes"
                                                                value={editedData.notes}
                                                                onChange={(e) =>
                                                                    setEditedData({
                                                                        ...editedData,
                                                                        notes: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </td>
                                                        <td className="scnr-tble-btns-ed">
                                                            <button onClick={handleSaveRow}>Save</button>
                                                            <button onClick={() => setEditRowId(null)} className="scanner-tbl-cancel-btn">Cancel</button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{`${entry.notes}: ${entry.title}`}</td>
                                                        <td>{entry.date}</td>
                                                        <td>{entry.notes}</td>
                                                        <td className="scnr-tble-btns-ed">
                                                            <button onClick={() => handleEditRow(entry)}> Edit </button>
                                                            <button onClick={() => handleDeleteEntry(entry.id)}className="scanner-tbl-delete-btn">Delete</button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="scanner-saveall-delete-btns">
                                <button onClick={handleDeleteAllEntries} className="delete-all-entries"> Delete All Entries </button>
                                <button onClick={handleSaveAllEntries}>Save All Entries</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ScannerModal;
