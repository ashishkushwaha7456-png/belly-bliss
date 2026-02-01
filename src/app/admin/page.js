"use client"
// Admin Dashboard Control Panel

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trash2, Edit, Plus, MessageSquare, Database, LogOut, Check, Send, User, Mail, Calendar, Upload, FileText, Users } from 'lucide-react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function AdminDashboard() {
    const [pages, setPages] = useState({});
    const [activeTab, setActiveTab] = useState('foods'); // 'foods', 'messages', 'weekly', 'cms'
    const [foods, setFoods] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedSubscribers, setSelectedSubscribers] = useState([]);

    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [sendingPlan, setSendingPlan] = useState(false);
    const [editPageData, setEditPageData] = useState({ id: '', title: '', subtitle: '', content: '' });
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        image: '',
        description: '',
        longDescription: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        benefits: ''
    });

    useEffect(() => {
        const auth = localStorage.getItem('adminAuth');
        if (auth === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            fetchAllData();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        const auth = localStorage.getItem('adminAuth');
        try {
            const [foodsRes, messagesRes, subscribersRes, pagesRes] = await Promise.all([
                fetch('/api/foods'),
                fetch('/api/messages', { headers: { 'Authorization': auth } }),
                fetch('/api/subscribers', { headers: { 'Authorization': auth } }),
                fetch('/api/pages')
            ]);

            const foodsData = await foodsRes.json();
            const messagesData = await messagesRes.json();
            const pagesData = await pagesRes.json();
            let subscribersData = [];
            if (subscribersRes.ok) subscribersData = await subscribersRes.json();

            setFoods(Array.isArray(foodsData) ? foodsData : []);
            setMessages(Array.isArray(messagesData) ? messagesData : []);
            setSubscribers(Array.isArray(subscribersData) ? subscribersData : []);
            setPages(pagesData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
            const data = await res.json();
            if (data.url) setPdfUrl(data.url);
        } catch (error) { console.error(error); alert('PDF Upload Failed'); }
        finally { setUploading(false); }
    };
    const handleSendWeeklyPlan = async () => {
        if (!pdfUrl) return alert('Please upload a PDF first');

        const targetCount = selectedSubscribers.length > 0 ? selectedSubscribers.length : subscribers.length;
        const confirmMsg = selectedSubscribers.length > 0
            ? `Send this diet plan to ${targetCount} SELECTED subscribers?`
            : `Send this diet plan to ALL ${targetCount} subscribers?`;

        if (!confirm(confirmMsg)) return;

        setSendingPlan(true);
        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('adminAuth') || '' },
                body: JSON.stringify({ pdfUrl, recipients: selectedSubscribers })
            });
            if (res.ok) {
                alert('Weekly plan sent successfully!');
                setPdfUrl('');
                setSelectedSubscribers([]); // Reset selection
            } else {
                alert('Failed to send plan.');
            }
        } catch (error) { console.error(error); }
        finally { setSendingPlan(false); }
    };

    // End of handleSendWeeklyPlan

    const handlePageUpdate = async (e) => {
        e.preventDefault();
        const auth = localStorage.getItem('adminAuth');
        try {
            const res = await fetch('/api/pages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': auth },
                body: JSON.stringify(editPageData)
            });
            if (res.ok) {
                alert('Page updated successfully!');
                fetchAllData();
            } else {
                alert('Failed to update page');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Update failed');
        }
    };

    const handleFileUpload = async (e) => {
        // ... (existing implementation)
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, image: data.url }));
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            localStorage.setItem('adminAuth', password);
            setIsAuthenticated(true);
            fetchAllData();
        } else {
            alert('Incorrect password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
        window.location.reload();
    };

    const handleDeleteFood = async (id) => {
        if (!confirm('Delete this superfood?')) return;
        try {
            const res = await fetch(`/api/foods/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': localStorage.getItem('adminAuth') || '' }
            });
            if (res.ok) fetchAllData();
        } catch (error) { console.error(error); }
    };

    // ... (rest of component logic)

    const [editingFood, setEditingFood] = useState(null);

    const handleEditClick = (food) => {
        setEditingFood(food);
        setFormData({
            ...food,
            benefits: Array.isArray(food.benefits) ? food.benefits.join(', ') : food.benefits
        });
        setIsAddModalOpen(true);
    };

    const handleFoodSubmit = async (e) => {
        e.preventDefault();
        const foodToSubmit = {
            ...formData,
            benefits: formData.benefits.split(',').map(b => b.trim()),
            calories: parseInt(formData.calories) || 0
        };

        const url = editingFood ? `/api/foods/${editingFood.id}` : '/api/foods';
        const method = editingFood ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('adminAuth') || ''
                },
                body: JSON.stringify(foodToSubmit)
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setFormData({ name: '', category: '', image: '', description: '', longDescription: '', calories: '', protein: '', carbs: '', fat: '', benefits: '' });
                setEditingFood(null);
                fetchAllData();
            }
        } catch (error) { console.error(error); }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/messages', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('adminAuth') || ''
                },
                body: JSON.stringify({
                    id: replyingTo.id,
                    reply: replyText,
                    status: 'replied'
                })
            });
            if (res.ok) {
                setReplyingTo(null);
                setReplyText('');
                fetchAllData();
            }
        } catch (error) { console.error(error); }
    };

    const handleDeleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            const res = await fetch(`/api/messages?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': localStorage.getItem('adminAuth') || '' }
            });
            if (res.ok) fetchAllData();
        } catch (error) { console.error(error); }
    };

    if (loading && isAuthenticated) return <div className="loading">Loading dashboard...</div>;

    if (!isAuthenticated) return (
        <main className="login-screen">
            <div className="login-card">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="password" placeholder="Enter Admin Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="submit" className="login-btn">Access Dashboard</button>
                </form>
            </div>
            <style jsx>{`
                    .login-screen { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f4f7f6; }
                    .login-card { background: white; padding: 3rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; width: 100%; max-width: 400px; }
                    .login-card h2 { margin-bottom: 2rem; color: var(--primary); font-family: var(--font-serif); }
                    .login-card input { width: 100%; padding: 1rem; margin-bottom: 1.5rem; border: 2px solid #eee; border-radius: 12px; font-size: 1rem; }
                    .login-btn { background: var(--primary); color: white; padding: 1.25rem; border-radius: 16px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease; border: none; cursor: pointer; }
                    .login-btn:hover { background: var(--secondary); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
                `}</style>
        </main>
    );

    return (
        <main className="admin-dashboard">
            <Header />
            <div className="admin-content container section-padding">
                <div className="admin-sidebar-nav">
                    <div className="brand-section">
                        <h2>Belly Bliss</h2>
                        <span>Admin Control Center</span>
                    </div>
                    <nav className="tabs">
                        <button className={`tab-btn ${activeTab === 'foods' ? 'active' : ''}`} onClick={() => setActiveTab('foods')}>
                            <Database size={20} /> Superfoods
                        </button>
                        <button className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                            <MessageSquare size={20} /> Help Center
                            {(Array.isArray(messages) ? messages : []).filter(m => m.status === 'pending').length > 0 &&
                                <span className="badge">{(Array.isArray(messages) ? messages : []).filter(m => m.status === 'pending').length}</span>
                            }
                        </button>
                        <button className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`} onClick={() => setActiveTab('weekly')}>
                            <FileText size={20} /> Weekly Plan
                            <span className="badge blue">{subscribers.length}</span>
                        </button>
                        <button className={`tab-btn ${activeTab === 'cms' ? 'active' : ''}`} onClick={() => setActiveTab('cms')}>
                            <Edit size={20} /> CMS Pages
                        </button>
                    </nav>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>

                <div className="admin-main">
                    {activeTab === 'foods' ? (
                        <div className="tab-panel">
                            {/* ... Foods Tab Content ... */}
                            <div className="panel-header">
                                <div>
                                    <h3>Superfood Collection</h3>
                                    <p>Manage the inventory of nutrient-dense foods.</p>
                                </div>
                                <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #ddd', minWidth: '250px' }}
                                    />
                                    <button className="add-btn" onClick={() => {
                                        setEditingFood(null);
                                        setFormData({ name: '', category: '', image: '', description: '', longDescription: '', calories: '', protein: '', carbs: '', fat: '', benefits: '' });
                                        setIsAddModalOpen(true);
                                    }}>
                                        <Plus size={20} /> New Food
                                    </button>
                                </div>
                            </div>

                            <div className="data-list">
                                {Array.isArray(foods) && foods
                                    .filter(food =>
                                        food?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        food?.category.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(food => (
                                        <div key={food.id} className="data-card food-card">
                                            <div className="card-info">
                                                <img
                                                    src={food?.image}
                                                    alt={food?.name}
                                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba2e638af?auto=format&fit=crop&q=80&w=200'}
                                                />
                                                <div>
                                                    <h4>{food?.name}</h4>
                                                    <span>{food?.category}</span>
                                                </div>
                                            </div>
                                            <div className="card-stats">
                                                <div className="stat"><span>Cal:</span> {food?.calories}</div>
                                                <div className="stat"><span>Pro:</span> {food?.protein}</div>
                                            </div>
                                            <div className="card-actions">
                                                <button className="icon-btn" onClick={() => handleEditClick(food)}>
                                                    <Edit size={18} />
                                                </button>
                                                <button className="icon-btn delete" onClick={() => handleDeleteFood(food.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : activeTab === 'messages' ? (
                        <div className="tab-panel">
                            {/* ... Messages Tab Content ... */}
                            <div className="panel-header">
                                <div>
                                    <h3>User Help Center</h3>
                                    <p>Review and reply to messages from your community.</p>
                                </div>
                            </div>
                            <div className="data-list">
                                {Array.isArray(messages) && messages.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon"><MessageSquare size={48} /></div>
                                        <p>No messages yet.</p>
                                    </div>
                                ) : (
                                    <div className="message-list">
                                        {Array.isArray(messages) && messages.map(msg => (
                                            <div key={msg.id} className={`message-card ${msg.status}`}>
                                                <div className="message-header">
                                                    <div className="sender-info">
                                                        <span className="sender-name">{msg.name}</span>
                                                        <span className="sender-email">{msg.email}</span>
                                                    </div>
                                                    <div className={`status-tag ${msg.status}`}>
                                                        {msg.status === 'replied' ? <Check size={14} /> : null}
                                                        {msg.status}
                                                    </div>
                                                </div>
                                                <p className="msg-content">{msg.message}</p>
                                                {msg.reply && (
                                                    <div className="reply-box">
                                                        <strong>Your Response:</strong>
                                                        <p>{msg.reply}</p>
                                                        <span className="replied-at">Sent: {new Date(msg.repliedAt).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                                <div className="card-actions">
                                                    {msg.status === 'pending' && (
                                                        <button className="reply-btn" onClick={() => setReplyingTo(msg)}>
                                                            <Send size={16} /> Reply to User
                                                        </button>
                                                    )}
                                                    <button className="icon-btn delete" onClick={() => handleDeleteMessage(msg.id)}><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'weekly' ? (
                        <div className="tab-panel">
                            {/* ... Weekly Plan Tab Content ... */}
                            <div className="panel-header">
                                <div>
                                    <h3>Weekly Diet Plan Center</h3>
                                    <p>Upload a PDF diet chart and send it to your community.</p>
                                </div>
                            </div>
                            {/* ... existing weekly plan tools content ... */}
                            <div className="tools-container">
                                <div className="tool-card">
                                    <h4><FileText size={20} /> Upload Diet PDF</h4>
                                    <div className="upload-zone">
                                        <input type="file" id="pdf-upload" accept="application/pdf" onChange={handlePdfUpload} disabled={uploading} hidden />
                                        <label htmlFor="pdf-upload" className="upload-box-label">
                                            <Upload size={32} />
                                            <span>{uploading ? 'Uploading...' : 'Click to Upload PDF'}</span>
                                        </label>
                                        {pdfUrl && (
                                            <div className="file-ready">
                                                <Check size={16} /> File Ready: <a href={pdfUrl} target="_blank">View PDF</a>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className={`send-blast-btn ${!pdfUrl || sendingPlan || (Array.isArray(subscribers) && subscribers.length === 0) ? 'disabled' : ''}`}
                                        onClick={handleSendWeeklyPlan}
                                        disabled={!pdfUrl || sendingPlan || (Array.isArray(subscribers) && subscribers.length === 0)}
                                    >
                                        {sendingPlan ? 'Sending Emails...' : (
                                            selectedSubscribers.length > 0 ? (
                                                <><Send size={18} /> Send to {selectedSubscribers.length} Selected Subscribers</>
                                            ) : (
                                                <><Send size={18} /> Send to All {Array.isArray(subscribers) ? subscribers.length : 0} Subscribers</>
                                            )
                                        )}
                                    </button>
                                </div>

                                <div className="tool-card subscribers-list">
                                    <div className="list-header">
                                        <h4><Users size={20} /> Subscriber List</h4>
                                        <div className="select-all">
                                            <input
                                                type="checkbox"
                                                id="select-all"
                                                checked={Array.isArray(subscribers) && subscribers.length > 0 && selectedSubscribers.length === subscribers.length}
                                                onChange={(e) => {
                                                    if (e.target.checked && Array.isArray(subscribers)) {
                                                        setSelectedSubscribers(subscribers.map(s => s.id));
                                                    } else {
                                                        setSelectedSubscribers([]);
                                                    }
                                                }}
                                            />
                                            <label htmlFor="select-all">Select All</label>
                                        </div>
                                    </div>
                                    <div className="subs-list">
                                        {Array.isArray(subscribers) && subscribers.length === 0 ? <p className="empty">No subscribers yet.</p> :
                                            Array.isArray(subscribers) && subscribers.slice().reverse().map(sub => (
                                                <div key={sub.id} className={`sub-item ${selectedSubscribers.includes(sub.id) ? 'selected' : ''}`}>
                                                    <div className="sub-info">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSubscribers.includes(sub.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedSubscribers([...selectedSubscribers, sub.id]);
                                                                } else {
                                                                    setSelectedSubscribers(selectedSubscribers.filter(id => id !== sub.id));
                                                                }
                                                            }}
                                                        />
                                                        <span>{sub.email}</span>
                                                    </div>
                                                    <small>{new Date(sub.joinedAt).toLocaleDateString()}</small>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="tab-panel">
                            <div className="panel-header">
                                <div>
                                    <h3>Page Content Manager</h3>
                                    <p>Edit the content of your legal and informational pages.</p>
                                </div>
                            </div>

                            <div className="tools-container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                                <div className="tool-card" style={{ padding: '2rem' }}>
                                    <div className="field" style={{ marginBottom: '2rem' }}>
                                        <label>Select Page to Edit</label>
                                        <select
                                            value={editPageData.id}
                                            onChange={(e) => {
                                                const pageId = e.target.value;
                                                const page = pages[pageId];
                                                if (page) {
                                                    setEditPageData({ id: pageId, ...page });
                                                } else {
                                                    setEditPageData({ id: '', title: '', subtitle: '', content: '' });
                                                }
                                            }}
                                            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', width: '100%' }}
                                        >
                                            <option value="">-- Select a Page --</option>
                                            <option value="about">About Us</option>
                                            <option value="privacy">Privacy Policy</option>
                                            <option value="terms">Terms of Service</option>
                                            <option value="cookie-policy">Cookie Policy</option>
                                        </select>
                                    </div>

                                    {editPageData.id && (
                                        <form onSubmit={handlePageUpdate} className="admin-form">
                                            <div className="field">
                                                <label>Page Title</label>
                                                <input
                                                    type="text"
                                                    value={editPageData.title}
                                                    onChange={e => setEditPageData({ ...editPageData, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="field">
                                                <label>Subtitle (Hero Text)</label>
                                                <input
                                                    type="text"
                                                    value={editPageData.subtitle || ''}
                                                    onChange={e => setEditPageData({ ...editPageData, subtitle: e.target.value })}
                                                />
                                            </div>
                                            <div className="field">
                                                <label>Content</label>
                                                <div className="editor-container">
                                                    <Editor
                                                        value={editPageData.content}
                                                        onChange={(content) => setEditPageData(prev => ({ ...prev, content }))}
                                                    />
                                                </div>
                                            </div>
                                            <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>
                                                <Check size={20} /> Save Page Changes
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {
                isAddModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>{editingFood ? 'Edit Superfood' : 'Add Superfood'}</h3>
                                <button className="close-btn" onClick={() => { setIsAddModalOpen(false); setEditingFood(null); setFormData({ name: '', category: '', image: '', description: '', longDescription: '', calories: '', protein: '', carbs: '', fat: '', benefits: '' }); }}>×</button>
                            </div>
                            <form onSubmit={handleFoodSubmit} className="admin-form">
                                <div className="form-grid">
                                    <div className="field">
                                        <label>Food Name</label>
                                        <input type="text" placeholder="e.g. Blueberries" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                    <div className="field">
                                        <label>Category</label>
                                        <input type="text" placeholder="e.g. Berries" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Food Image</label>
                                    <div className="upload-group">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="file-upload" className={`upload-btn ${uploading ? 'disabled' : ''}`}>
                                            {uploading ? (
                                                <span>Uploading...</span>
                                            ) : (
                                                <>
                                                    <Upload size={18} /> Upload to S3
                                                </>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Image URL will appear here..."
                                            value={formData.image}
                                            readOnly
                                            className="url-field"
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Short Description</label>
                                    <textarea placeholder="Visible on cards..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                                </div>
                                <div className="field">
                                    <label>Detailed Description</label>
                                    <textarea rows="4" placeholder="Full health analysis..." value={formData.longDescription} onChange={e => setFormData({ ...formData, longDescription: e.target.value })} required />
                                </div>
                                <div className="form-grid four-col">
                                    <div className="field"><label>Calories</label><input type="number" value={formData.calories} onChange={e => setFormData({ ...formData, calories: e.target.value })} required /></div>
                                    <div className="field"><label>Protein</label><input type="text" value={formData.protein} onChange={e => setFormData({ ...formData, protein: e.target.value })} required /></div>
                                    <div className="field"><label>Carbs</label><input type="text" value={formData.carbs} onChange={e => setFormData({ ...formData, carbs: e.target.value })} required /></div>
                                    <div className="field"><label>Fat</label><input type="text" value={formData.fat} onChange={e => setFormData({ ...formData, fat: e.target.value })} required /></div>
                                </div>
                                <div className="field">
                                    <label>Benefits (Comma separated)</label>
                                    <input type="text" placeholder="Antioxidant, Brain Health..." value={formData.benefits} onChange={e => setFormData({ ...formData, benefits: e.target.value })} required />
                                </div>

                                <div className="form-grid">
                                    <div className="field">
                                        <label>Amazon Product Link (Optional)</label>
                                        <input type="url" placeholder="https://amazon.com/..." value={formData.amazonLink || ''} onChange={e => setFormData({ ...formData, amazonLink: e.target.value })} />
                                    </div>
                                    <div className="field">
                                        <label>Flipkart Product Link (Optional)</label>
                                        <input type="url" placeholder="https://flipkart.com/..." value={formData.flipkartLink || ''} onChange={e => setFormData({ ...formData, flipkartLink: e.target.value })} />
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn"><Check size={18} /> Save & Publish</button>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                replyingTo && (
                    <div className="modal-overlay">
                        <div className="modal-content reply-modal">
                            <div className="modal-header">
                                <h3>Reply to {replyingTo.name}</h3>
                                <button className="close-btn" onClick={() => setReplyingTo(null)}>×</button>
                            </div>
                            <div className="msg-preview">
                                <span>User Message:</span>
                                <p>{replyingTo.message}</p>
                            </div>
                            <form onSubmit={handleReplySubmit} className="admin-form">
                                <div className="field">
                                    <label>Your Reply Message</label>
                                    <textarea rows="6" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your response here..." required />
                                </div>
                                <button type="submit" className="submit-btn"><Send size={18} /> Send Reply via Email</button>
                            </form>
                        </div>
                    </div>
                )
            }

            <style jsx>{`
                .admin-dashboard { background: #f4f7f6; min-height: 100vh; padding-top: 80px; }
                .admin-content { display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: start; }
                
                .admin-sidebar-nav { background: white; padding: 2.5rem; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); position: sticky; top: 110px; }
                .brand-section { margin-bottom: 3rem; }
                .brand-section h2 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--primary); margin: 0; }
                .brand-section span { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                
                .tabs { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 3rem; }
                .tab-btn { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-radius: 12px; border: none; background: transparent; cursor: pointer; color: var(--text-muted); font-weight: 600; transition: all 0.3s; position: relative; }
                .tab-btn:hover { background: #f8fafc; color: var(--primary); }
                .tab-btn.active { background: var(--primary-light); color: var(--primary); }
                .badge { background: #e74c3c; color: white; width: 20px; height: 20px; border-radius: 50%; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; position: absolute; right: 10px; }
                .logout-btn { display: flex; align-items: center; gap: 1rem; width: 100%; padding: 1rem; color: #e74c3c; background: transparent; border: none; cursor: pointer; font-weight: 600; border-top: 1px solid #f0f0f0; margin-top: 1rem; }

                .admin-main { background: white; padding: 2.5rem; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); min-height: 70vh; }
                .panel-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 3rem; border-bottom: 1px solid #f0f0f0; padding-bottom: 2rem; }
                .panel-header h3 { font-size: 1.5rem; margin-bottom: 0.25rem; }
                .panel-header p { color: var(--text-muted); font-size: 0.9rem; }
                
                .add-btn { background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; font-weight: 700; border: none; cursor: pointer; transition: all 0.3s; }
                .add-btn:hover { background: var(--secondary); transform: translateY(-2px); }

                .data-list { display: flex; flex-direction: column; gap: 1rem; }
                .data-card { border: 1px solid #f0f0f0; padding: 1.5rem; border-radius: 20px; transition: all 0.3s ease; }
                .data-card:hover { border-color: var(--primary-light); box-shadow: 0 10px 20px rgba(0,0,0,0.02); }
                
                .food-card { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 2rem; }
                .card-info { display: flex; align-items: center; gap: 1.5rem; }
                .card-info img { width: 50px; height: 50px; border-radius: 12px; object-fit: cover; }
                .card-info h4 { margin: 0; font-size: 1.1rem; }
                .card-info span { font-size: 0.85rem; color: var(--text-muted); }
                .card-stats { display: flex; gap: 2rem; font-size: 0.9rem; }
                .stat span { font-weight: 700; color: var(--primary); }

                .msg-card { display: flex; flex-direction: column; gap: 1.25rem; }
                .msg-card.replied { background: #fcfdfd; }
                .msg-header { display: flex; justify-content: space-between; align-items: start; }
                .user-info { display: flex; gap: 1rem; }
                .avatar { background: var(--primary-light); color: var(--primary); width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .meta { display: flex; gap: 1.5rem; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
                .meta span { display: flex; align-items: center; gap: 0.4rem; }
                .status-tag { padding: 0.4rem 0.8rem; border-radius: 100px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 0.4rem; }
                .status-tag.pending { background: #fff4e5; color: #ffab00; }
                .status-tag.replied { background: #e6fffa; color: #38b2ac; }
                .msg-content { background: #f8fafc; padding: 1.25rem; border-radius: 16px; font-size: 0.95rem; line-height: 1.5; color: #334155; }
                
                .reply-box { border-left: 3px solid var(--primary); padding: 1rem 1.5rem; background: var(--primary-light); border-radius: 0 16px 16px 0; margin-top: 0.5rem; }
                .reply-box strong { font-size: 0.85rem; color: var(--primary); display: block; margin-bottom: 0.5rem; }
                .reply-box p { font-size: 0.95rem; margin: 0; }
                .replied-at { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; display: block; }

                .card-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 0.5rem; }
                .reply-btn { background: var(--primary); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
                .icon-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; background: white; }
                .icon-btn.delete { color: #e74c3c; }
                .icon-btn.delete:hover { background: #fff5f5; border-color: #feb2b2; }

                .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
                .modal-content { background: white; width: 100%; max-width: 700px; border-radius: 30px; box-shadow: 0 30px 60px rgba(0,0,0,0.1); padding: 2.5rem; max-height: 90vh; overflow-y: auto; }
                .reply-modal { max-width: 550px; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-muted); }
                .msg-preview { background: #f8fafc; padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem; border-left: 4px solid #cbd5e1; }
                .msg-preview span { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
                .msg-preview p { margin: 0.5rem 0 0; font-style: italic; color: #475569; }

                .admin-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
                .four-col { grid-template-columns: repeat(4, 1fr); }
                .field { display: flex; flex-direction: column; gap: 0.5rem; }
                .field label { font-size: 0.85rem; font-weight: 700; color: #4a5568; }
                .field input, .field textarea { padding: 1rem; border: 2px solid #edf2f7; border-radius: 12px; font-family: inherit; font-size: 0.95rem; }
                .field input:focus, .field textarea:focus { border-color: var(--primary); outline: none; }
                .submit-btn { background: var(--primary); color: white; padding: 1.1rem; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }

                .upload-group { display: flex; gap: 0.5rem; align-items: stretch; }
                .upload-btn { background: #2c3e50; color: white; padding: 0 1.25rem; border-radius: 12px; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .upload-btn:hover { background: #34495e; }
                .upload-btn.disabled { opacity: 0.7; cursor: not-allowed; }
                .url-field { background: #f8fafc; color: #64748b; cursor: default; flex-grow: 1; }

                .badge.blue { background: #3498db; }
                .tools-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .tool-card { background: white; border: 1px solid #eee; padding: 2rem; border-radius: 20px; }
                .tool-card h4 { margin: 0 0 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
                .upload-box-label { border: 2px dashed #ddd; border-radius: 12px; height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #aaa; cursor: pointer; transition: all 0.2s; }
                .upload-box-label:hover { border-color: var(--primary); color: var(--primary); background: #f8fafc; }
                .file-ready { margin-top: 1rem; color: #27ae60; display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; }
                .send-blast-btn { width: 100%; margin-top: 2rem; background: var(--primary); color: white; padding: 1rem; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; display: flex; alignItems: center; justify-content: center; gap: 0.5rem; }
                .send-blast-btn.disabled { opacity: 0.6; cursor: not-allowed; background: #95a5a6; }
                .sub-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
                .sub-item small { color: #999; }
                .subs-list { max-height: 300px; overflow-y: auto; }

                .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #f0f0f0; padding-bottom: 1rem; }
                .list-header h4 { margin: 0; }
                .select-all { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--primary); font-weight: 600; cursor: pointer; }
                .subs-list { max-height: 400px; overflow-y: auto; padding-right: 0.5rem; }
                .sub-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: 12px; margin-bottom: 0.5rem; border: 1px solid transparent; transition: all 0.2s; cursor: pointer; }
                .sub-item:hover { background: #f8fafc; }
                .sub-item.selected { background: #f0f9ff; border-color: #3498db; }
                .sub-info { display: flex; align-items: center; gap: 0.75rem; }
                .sub-info input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; border-radius: 4px; border: 2px solid #ddd; }
                .sub-info input[type="checkbox"]:checked { background-color: var(--primary); border-color: var(--primary); }

                @media (max-width: 1024px) {
                    .admin-content { grid-template-columns: 1fr; }
                    .admin-sidebar-nav { position: static; top: 0; margin-bottom: 1rem; }
                    .tabs { flex-direction: row; flex-wrap: wrap; }
                    .tools-container { grid-template-columns: 1fr; }
                }
            `}</style>
            <Footer />
        </main >
    );
}
