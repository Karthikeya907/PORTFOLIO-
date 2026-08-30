import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, FolderGit2, Wrench, Award, Briefcase, FileText, 
  Mail, Share2, Info, Settings, HardDrive, LogOut, Plus, 
  Trash2, Edit3, Eye, EyeOff, ArrowUp, ArrowDown, Save, 
  X, Check, AlertTriangle, Upload, Download, ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { MissionData } from '../MissionCard';
import type { InternshipItem, CertItem, SkillCategory, SocialLink } from '../../context/PortfolioContext';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'projects' | 'skills' | 'certifications' | 'internships' | 'resume' | 'contact' | 'social' | 'about' | 'settings' | 'files';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const {
    projects, internships, certifications, skills,
    profile, socialLinks, about, resume, settings,
    updateSection, uploadFile, exportBackup, importBackup
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [nextTab, setNextTab] = useState<TabType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Local draft states for each section
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftProjects, setDraftProjects] = useState<MissionData[]>(projects);
  const [draftSkills, setDraftSkills] = useState<SkillCategory[]>(skills);
  const [draftCerts, setDraftCerts] = useState<CertItem[]>(certifications);
  const [draftInternships, setDraftInternships] = useState<InternshipItem[]>(internships);
  const [draftResume, setDraftResume] = useState(resume);
  const [draftSocial, setDraftSocial] = useState<SocialLink[]>(socialLinks);
  const [draftAbout, setDraftAbout] = useState(about);
  const [draftSettings, setDraftSettings] = useState(settings);

  // Modals for editing individual items
  const [editingProject, setEditingProject] = useState<Partial<MissionData> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<CertItem> | null>(null);
  const [editingInternship, setEditingInternship] = useState<Partial<InternshipItem> | null>(null);
  const [newPassInput, setNewPassInput] = useState('');

  const handleChangePassword = async () => {
    if (!newPassInput.trim() || newPassInput.trim().length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPassInput.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Admin password updated successfully!');
        setNewPassInput('');
      } else {
        showToast(json.message || 'Failed to update password', 'error');
      }
    } catch (err) {
      showToast('Error connecting to backend API', 'error');
    }
  };

  // Sync state from context when modal opens or context updates
  useEffect(() => {
    setDraftProfile(profile);
    setDraftProjects(projects);
    setDraftSkills(skills);
    setDraftCerts(certifications);
    setDraftInternships(internships);
    setDraftResume(resume);
    setDraftSocial(socialLinks);
    setDraftAbout(about);
    setDraftSettings(settings);
    setHasUnsaved(false);
  }, [profile, projects, skills, certifications, internships, resume, socialLinks, about, settings, isOpen]);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleTabChange = (tab: TabType) => {
    if (hasUnsaved) {
      setNextTab(tab);
      setShowUnsavedModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nk_admin_token');
    sessionStorage.removeItem('nk_admin_token');
    onClose();
  };

  // Helper for file upload to backend
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = reader.result as string;
      const res = await uploadFile(file.name, fileData, file.type);
      if (res.success && res.fileUrl) {
        callback(res.fileUrl);
        showToast(`Uploaded ${file.name} successfully`);
      } else {
        showToast('Upload failed', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // SAVE HANDLERS FOR EACH SECTION
  // ==========================================
  const saveProfile = async () => {
    const ok = await updateSection('profile', draftProfile);
    if (ok) { showToast('Profile updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save profile', 'error');
  };

  const saveProjects = async (updatedProjects = draftProjects) => {
    const ok = await updateSection('projects', updatedProjects);
    if (ok) { showToast('Projects updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save projects', 'error');
  };

  const saveSkills = async (updatedSkills = draftSkills) => {
    const ok = await updateSection('skills', updatedSkills);
    if (ok) { showToast('Skills updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save skills', 'error');
  };

  const saveCertifications = async (updatedCerts = draftCerts) => {
    const ok = await updateSection('certifications', updatedCerts);
    if (ok) { showToast('Certifications updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save certifications', 'error');
  };

  const saveInternships = async (updatedInternships = draftInternships) => {
    const ok = await updateSection('internships', updatedInternships);
    if (ok) { showToast('Internships updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save internships', 'error');
  };

  const saveResume = async () => {
    const ok = await updateSection('resume', draftResume);
    if (ok) { showToast('Resume settings updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save resume settings', 'error');
  };

  const saveSocial = async () => {
    const ok = await updateSection('socialLinks', draftSocial);
    if (ok) { showToast('Social links updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save social links', 'error');
  };

  const saveAbout = async () => {
    const ok = await updateSection('about', draftAbout);
    if (ok) { showToast('About text updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save about text', 'error');
  };

  const saveSettings = async () => {
    const ok = await updateSection('settings', draftSettings);
    if (ok) { showToast('Website settings updated live!'); setHasUnsaved(false); }
    else showToast('Failed to save website settings', 'error');
  };

  // Reorder helper
  const reorderArray = <T,>(arr: T[], fromIndex: number, toIndex: number): T[] => {
    const result = [...arr];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-black text-white overflow-hidden"
      >
        {/* Top Header Bar */}
        <header className="h-16 border-b border-cyan-500/30 bg-black/90 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-syncopate font-bold text-sm">
              NK
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-widest text-white">
                NK PORTFOLIO ADMIN
              </h1>
              <span className="text-[10px] font-mono text-cyan-400">Content Management Terminal</span>
            </div>
          </div>

          {/* Toast Notification */}
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-2 ${
                statusMessage.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'
              }`}
            >
              {statusMessage.type === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
              <span>{statusMessage.text}</span>
            </motion.div>
          )}

          <div className="flex items-center gap-4">
            {hasUnsaved && (
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono animate-pulse">
                UNSAVED CHANGES
              </span>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-2 uppercase cursor-pointer"
            >
              <LogOut size={14} />
              <span>LOGOUT</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Close Admin Panel"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar Navigation */}
          <aside className="w-64 border-r border-gray-800 bg-gray-950/60 p-4 flex flex-col gap-1 overflow-y-auto">
            {[
              { id: 'profile', label: '1. Profile', icon: User },
              { id: 'projects', label: '2. Projects', icon: FolderGit2 },
              { id: 'skills', label: '3. Skills', icon: Wrench },
              { id: 'certifications', label: '4. Certifications', icon: Award },
              { id: 'internships', label: '5. Internships', icon: Briefcase },
              { id: 'resume', label: '6. Resume', icon: FileText },
              { id: 'contact', label: '7. Contact Info', icon: Mail },
              { id: 'social', label: '8. Social Links', icon: Share2 },
              { id: 'about', label: '9. About / Intro', icon: Info },
              { id: 'settings', label: '10. Settings', icon: Settings },
              { id: 'files', label: '11. File Manager & Backup', icon: HardDrive },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as TabType)}
                  className={`w-full px-4 py-3 text-left font-mono text-xs font-bold tracking-wider flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border-l-2 border-cyan-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Content Workspace */}
          <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-black/90 custom-scrollbar">
            
            {/* 1. PROFILE MANAGEMENT */}
            {activeTab === 'profile' && (
              <div className="max-w-3xl space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">PROFILE MANAGEMENT</h2>
                    <p className="text-xs font-mono text-gray-400">Edit basic personal & contact details visible across the website.</p>
                  </div>
                  <button onClick={saveProfile} className="px-6 py-2.5 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase">
                    <Save size={14} /> SAVE PROFILE
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-950/60 p-6 border border-gray-800">
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">FULL NAME</label>
                    <input
                      type="text"
                      value={draftProfile.name}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, name: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">PROFESSIONAL TITLE</label>
                    <input
                      type="text"
                      value={draftProfile.title}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, title: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={draftProfile.email}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, email: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">PHONE NUMBER</label>
                    <input
                      type="text"
                      value={draftProfile.phone}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, phone: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">WHATSAPP NUMBER</label>
                    <input
                      type="text"
                      value={draftProfile.whatsapp}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, whatsapp: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">LOCATION</label>
                    <input
                      type="text"
                      value={draftProfile.location || ''}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, location: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-cyan-400 mb-2">SHORT INTRODUCTION</label>
                    <textarea
                      rows={3}
                      value={draftProfile.shortIntro}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, shortIntro: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. PROJECT MANAGEMENT */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">PROJECT MANAGEMENT</h2>
                    <p className="text-xs font-mono text-gray-400">Add, edit, reorder, or upload files for portfolio projects.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingProject({
                        id: 'proj_' + Date.now(),
                        title: 'NEW PROJECT',
                        description: '',
                        status: 'COMPLETED',
                        tags: ['Robotics'],
                        githubUrl: '',
                        demoUrl: '',
                        details: { shortDescription: '', category: ['Robotics'], mainTechnologies: [] }
                      })}
                      className="px-4 py-2 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase"
                    >
                      <Plus size={14} /> ADD PROJECT
                    </button>
                    <button onClick={() => saveProjects()} className="px-5 py-2 border border-cyan-400 text-cyan-400 font-mono font-bold text-xs hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-2 cursor-pointer uppercase">
                      <Save size={14} /> SAVE ALL
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {draftProjects.map((p, idx) => (
                    <div key={p.id} className="bg-gray-950/80 border border-gray-800 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-mono text-cyan-400 font-bold">#{idx + 1}</span>
                          <h3 className="font-bold text-white tracking-wide text-lg">{p.title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-900 border border-gray-800 text-gray-400">{p.status}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono line-clamp-2">{p.description}</p>
                        {p.githubUrl && <span className="text-[11px] text-cyan-400 font-mono mt-2 block">GitHub: {p.githubUrl}</span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (idx > 0) {
                              const updated = reorderArray(draftProjects, idx, idx - 1);
                              setDraftProjects(updated);
                              saveProjects(updated);
                            }
                          }}
                          disabled={idx === 0}
                          className="p-2 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (idx < draftProjects.length - 1) {
                              const updated = reorderArray(draftProjects, idx, idx + 1);
                              setDraftProjects(updated);
                              saveProjects(updated);
                            }
                          }}
                          disabled={idx === draftProjects.length - 1}
                          className="p-2 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={16} />
                        </button>

                        <button
                          onClick={() => setEditingProject(p)}
                          className="px-3 py-1.5 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Edit3 size={14} /> EDIT
                        </button>

                        <button
                          onClick={() => setDeleteTarget({ type: 'projects', id: p.id, name: p.title })}
                          className="p-2 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SKILLS MANAGEMENT */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">SKILLS MANAGEMENT</h2>
                    <p className="text-xs font-mono text-gray-400">Add, edit, or remove skill categories and items.</p>
                  </div>
                  <button onClick={() => saveSkills()} className="px-6 py-2.5 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase">
                    <Save size={14} /> SAVE SKILLS
                  </button>
                </div>

                <div className="grid gap-6">
                  {draftSkills.map((cat, catIdx) => (
                    <div key={catIdx} className="bg-gray-950/80 border border-gray-800 p-6">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => {
                            const updated = [...draftSkills];
                            updated[catIdx].category = e.target.value;
                            setDraftSkills(updated);
                            setHasUnsaved(true);
                          }}
                          className="bg-black border border-gray-800 px-3 py-1.5 text-white font-mono font-bold text-sm text-cyan-400 outline-none"
                        />
                        <button
                          onClick={() => {
                            const updated = [...draftSkills];
                            updated[catIdx].skills.push('New Skill Item');
                            setDraftSkills(updated);
                            setHasUnsaved(true);
                          }}
                          className="px-3 py-1 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold hover:bg-cyan-500 hover:text-black cursor-pointer flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Skill
                        </button>
                      </div>

                      <div className="space-y-2">
                        {cat.skills.map((skill, skillIdx) => (
                          <div key={skillIdx} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => {
                                const updated = [...draftSkills];
                                updated[catIdx].skills[skillIdx] = e.target.value;
                                setDraftSkills(updated);
                                setHasUnsaved(true);
                              }}
                              className="flex-1 bg-black border border-gray-800 px-3 py-2 text-white font-mono text-xs outline-none focus:border-cyan-400"
                            />
                            <button
                              onClick={() => {
                                const updated = [...draftSkills];
                                updated[catIdx].skills.splice(skillIdx, 1);
                                setDraftSkills(updated);
                                setHasUnsaved(true);
                              }}
                              className="p-2 text-red-400 hover:text-white cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CERTIFICATIONS MANAGEMENT */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">CERTIFICATIONS MANAGEMENT</h2>
                    <p className="text-xs font-mono text-gray-400">Manage certificates, PDF documents, and external links.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingCert({
                        id: 'cert_' + Date.now(),
                        title: 'New Certificate',
                        organization: '',
                        date: '2026',
                        description: '',
                        visible: true
                      })}
                      className="px-4 py-2 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase"
                    >
                      <Plus size={14} /> ADD CERTIFICATE
                    </button>
                    <button onClick={() => saveCertifications()} className="px-5 py-2 border border-cyan-400 text-cyan-400 font-mono font-bold text-xs hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-2 cursor-pointer uppercase">
                      <Save size={14} /> SAVE ALL
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {draftCerts.map((c) => (
                    <div key={c.id} className="bg-gray-950/80 border border-gray-800 p-5 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-white text-base">{c.title}</h3>
                          <span className="text-xs font-mono text-cyan-400">({c.organization})</span>
                          <span className="text-xs font-mono text-gray-500">{c.date}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-1">{c.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCert(c)}
                          className="px-3 py-1.5 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono text-xs font-bold cursor-pointer"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'certifications', id: c.id, name: c.title })}
                          className="p-2 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. INTERNSHIPS MANAGEMENT */}
            {activeTab === 'internships' && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">INTERNSHIP MANAGEMENT</h2>
                    <p className="text-xs font-mono text-gray-400">Add or edit current and future internship roles.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingInternship({
                        id: 'int_' + Date.now(),
                        role: 'INTERNSHIP ROLE',
                        company: 'Company Name',
                        duration: '2026',
                        description: '',
                        technologies: [],
                        certificateAvailable: false
                      })}
                      className="px-4 py-2 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase"
                    >
                      <Plus size={14} /> ADD INTERNSHIP
                    </button>
                    <button onClick={() => saveInternships()} className="px-5 py-2 border border-cyan-400 text-cyan-400 font-mono font-bold text-xs hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-2 cursor-pointer uppercase">
                      <Save size={14} /> SAVE ALL
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {draftInternships.map((intItem) => (
                    <div key={intItem.id} className="bg-gray-950/80 border border-gray-800 p-5 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-white text-base">{intItem.role}</h3>
                          <span className="text-xs font-mono text-cyan-400">@ {intItem.company}</span>
                          <span className="text-xs font-mono text-gray-500">{intItem.duration}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-1">{intItem.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingInternship(intItem)}
                          className="px-3 py-1.5 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono text-xs font-bold cursor-pointer"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'internships', id: intItem.id, name: intItem.role })}
                          className="p-2 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. RESUME MANAGEMENT */}
            {activeTab === 'resume' && (
              <div className="max-w-2xl space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">RESUME MANAGEMENT</h2>
                    <p className="text-xs font-mono text-gray-400">Upload, replace, or manage availability of your resume PDF.</p>
                  </div>
                  <button onClick={saveResume} className="px-6 py-2.5 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase">
                    <Save size={14} /> SAVE RESUME SETTINGS
                  </button>
                </div>

                <div className="bg-gray-950/80 p-6 border border-gray-800 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                      <span className="text-sm font-bold text-white block">Resume Availability</span>
                      <span className="text-xs font-mono text-gray-400">Toggle whether the public Resume button is enabled</span>
                    </div>
                    <button
                      onClick={() => { setDraftResume({ ...draftResume, available: !draftResume.available }); setHasUnsaved(true); }}
                      className={`px-4 py-2 font-mono text-xs font-bold border transition-all cursor-pointer ${
                        draftResume.available ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
                      }`}
                    >
                      {draftResume.available ? 'AVAILABLE' : 'DISABLED'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">CURRENT RESUME FILE URL</label>
                    <input
                      type="text"
                      value={draftResume.fileUrl}
                      onChange={(e) => { setDraftResume({ ...draftResume, fileUrl: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">UPLOAD NEW RESUME (PDF)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, (url) => {
                        setDraftResume({ ...draftResume, fileUrl: url, available: true, lastUpdated: new Date().toISOString().split('T')[0] });
                        setHasUnsaved(true);
                      })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 text-gray-300 font-mono text-xs cursor-pointer"
                    />
                  </div>

                  {draftResume.fileUrl && (
                    <div className="flex items-center gap-4 pt-2">
                      <a
                        href={draftResume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-2"
                      >
                        <ExternalLink size={14} /> PREVIEW CURRENT RESUME
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 7. CONTACT INFO */}
            {activeTab === 'contact' && (
              <div className="max-w-2xl space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">CONTACT MANAGEMENT</h2>
                    <p className="text-xs font-mono text-gray-400">Update public contact information.</p>
                  </div>
                  <button onClick={saveProfile} className="px-6 py-2.5 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase">
                    <Save size={14} /> SAVE CONTACT INFO
                  </button>
                </div>

                <div className="bg-gray-950/80 p-6 border border-gray-800 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={draftProfile.email}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, email: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">PHONE NUMBER</label>
                    <input
                      type="text"
                      value={draftProfile.phone}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, phone: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">WHATSAPP LINK / NUMBER</label>
                    <input
                      type="text"
                      value={draftProfile.whatsapp}
                      onChange={(e) => { setDraftProfile({ ...draftProfile, whatsapp: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. SOCIAL LINKS */}
            {activeTab === 'social' && (
              <div className="max-w-2xl space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">SOCIAL LINKS</h2>
                    <p className="text-xs font-mono text-gray-400">Manage LinkedIn, GitHub, HackerRank and custom profile links.</p>
                  </div>
                  <button onClick={saveSocial} className="px-6 py-2.5 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase">
                    <Save size={14} /> SAVE SOCIAL LINKS
                  </button>
                </div>

                <div className="space-y-4">
                  {draftSocial.map((item, idx) => (
                    <div key={item.id} className="bg-gray-950/80 p-4 border border-gray-800 flex items-center gap-4">
                      <input
                        type="text"
                        value={item.platform}
                        onChange={(e) => {
                          const updated = [...draftSocial];
                          updated[idx].platform = e.target.value;
                          setDraftSocial(updated);
                          setHasUnsaved(true);
                        }}
                        className="w-36 bg-black border border-gray-800 px-3 py-2 text-cyan-400 font-mono text-xs font-bold outline-none"
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          const updated = [...draftSocial];
                          updated[idx].url = e.target.value;
                          setDraftSocial(updated);
                          setHasUnsaved(true);
                        }}
                        className="flex-1 bg-black border border-gray-800 px-3 py-2 text-white font-mono text-xs outline-none"
                      />
                      <button
                        onClick={() => {
                          const updated = [...draftSocial];
                          updated[idx].visible = !updated[idx].visible;
                          setDraftSocial(updated);
                          setHasUnsaved(true);
                        }}
                        className={`p-2 border transition-all ${
                          item.visible ? 'border-cyan-500/40 text-cyan-400' : 'border-gray-800 text-gray-600'
                        }`}
                        title="Toggle Visibility"
                      >
                        {item.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. ABOUT / INTRODUCTION */}
            {activeTab === 'about' && (
              <div className="max-w-3xl space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">ABOUT & INTRODUCTION</h2>
                    <p className="text-xs font-mono text-gray-400">Edit hero introduction, description, and key interests.</p>
                  </div>
                  <button onClick={saveAbout} className="px-6 py-2.5 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase">
                    <Save size={14} /> SAVE ABOUT TEXT
                  </button>
                </div>

                <div className="bg-gray-950/80 p-6 border border-gray-800 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">HERO GREETING / SHORT INTRO</label>
                    <input
                      type="text"
                      value={draftAbout.shortIntro}
                      onChange={(e) => { setDraftAbout({ ...draftAbout, shortIntro: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">ENGINEERING PHILOSOPHY / DESCRIPTION</label>
                    <textarea
                      rows={5}
                      value={draftAbout.description}
                      onChange={(e) => { setDraftAbout({ ...draftAbout, description: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2">CURRENT FOCUS</label>
                    <input
                      type="text"
                      value={draftAbout.currentFocus}
                      onChange={(e) => { setDraftAbout({ ...draftAbout, currentFocus: e.target.value }); setHasUnsaved(true); }}
                      className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 10. WEBSITE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="max-w-3xl space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">WEBSITE SETTINGS</h2>
                    <p className="text-xs font-mono text-gray-400">Configure global website titles, section visibility, and feature flags.</p>
                  </div>
                  <button onClick={saveSettings} className="px-6 py-2.5 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase">
                    <Save size={14} /> SAVE SETTINGS
                  </button>
                </div>

                <div className="bg-gray-950/80 p-6 border border-gray-800 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-cyan-400 mb-2">SITE TAB TITLE</label>
                      <input
                        type="text"
                        value={draftSettings.siteTitle}
                        onChange={(e) => { setDraftSettings({ ...draftSettings, siteTitle: e.target.value }); setHasUnsaved(true); }}
                        className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-cyan-400 mb-2">HERO NAME HEADING</label>
                      <input
                        type="text"
                        value={draftSettings.heroHeading}
                        onChange={(e) => { setDraftSettings({ ...draftSettings, heroHeading: e.target.value }); setHasUnsaved(true); }}
                        className="w-full px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-3 uppercase">SECTION VISIBILITY TOGGLES</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.keys(draftSettings.showSections || {}).map((secKey) => (
                        <button
                          key={secKey}
                          onClick={() => {
                            const updated = { ...draftSettings.showSections, [secKey]: !draftSettings.showSections[secKey] };
                            setDraftSettings({ ...draftSettings, showSections: updated });
                            setHasUnsaved(true);
                          }}
                          className={`p-3 border font-mono text-xs font-bold uppercase flex items-center justify-between cursor-pointer transition-all ${
                            draftSettings.showSections[secKey] ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-gray-900 border-gray-800 text-gray-500'
                          }`}
                        >
                          <span>{secKey}</span>
                          {draftSettings.showSections[secKey] ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                    <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase">CHANGE ADMIN PASSWORD</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="password"
                        placeholder="Enter New Admin Password"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-black border border-gray-800 text-white font-mono text-sm outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        className="px-5 py-2.5 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all uppercase cursor-pointer flex-shrink-0"
                      >
                        UPDATE PASSWORD
                      </button>
                    </div>
                    <span className="text-[11px] font-mono text-gray-500 mt-1 block">
                      Updates the password in .env.local and server environment instantly.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 11. FILE MANAGER & BACKUP */}
            {activeTab === 'files' && (
              <div className="max-w-3xl space-y-6">
                <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wider">FILE MANAGER & BACKUP</h2>
                    <p className="text-xs font-mono text-gray-400">Upload portfolio assets and export/import full JSON backups.</p>
                  </div>
                </div>

                <div className="bg-gray-950/80 p-6 border border-gray-800 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide mb-3">DATA BACKUP & RESTORE</h3>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={async () => {
                          const backupData = await exportBackup();
                          const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `nk_portfolio_backup_${Date.now()}.json`;
                          a.click();
                          showToast('Backup JSON exported!');
                        }}
                        className="px-5 py-2.5 bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer uppercase"
                      >
                        <Download size={14} /> EXPORT BACKUP JSON
                      </button>

                      <label className="px-5 py-2.5 border border-cyan-400 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-2 cursor-pointer uppercase">
                        <Upload size={14} /> IMPORT BACKUP JSON
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              try {
                                const parsed = JSON.parse(reader.result as string);
                                const ok = await importBackup(parsed);
                                if (ok) showToast('Backup imported live!');
                                else showToast('Failed to import backup', 'error');
                              } catch (err) {
                                showToast('Invalid JSON backup file', 'error');
                              }
                            };
                            reader.readAsText(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-sm font-bold text-white tracking-wide mb-3">DIRECT MEDIA UPLOAD</h3>
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf"
                      onChange={(e) => handleFileUpload(e, () => {})}
                      className="w-full px-4 py-3 bg-black border border-gray-800 text-gray-300 font-mono text-xs cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* EDIT PROJECT MODAL */}
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-950 border border-cyan-500/50 p-6 space-y-4 custom-scrollbar">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h3 className="font-bold text-lg text-white">EDIT PROJECT: {editingProject.title}</h3>
                <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1">PROJECT TITLE</label>
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1">GITHUB URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white font-mono text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-cyan-400 mb-1">SHORT DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1">TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={(editingProject.tags || []).join(', ')}
                    onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1">PROJECT IMAGE UPLOAD</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingProject({ ...editingProject, image: url }))}
                    className="w-full px-3 py-1.5 bg-black border border-gray-800 text-xs font-mono text-gray-300"
                  />
                  {editingProject.image && (
                    <div className="mt-2 p-2 border border-cyan-500/30 bg-black flex flex-col items-center justify-center rounded">
                      <span className="text-[10px] font-mono text-cyan-400 mb-1">LIVE PREVIEW (NATURAL ASPECT RATIO)</span>
                      <img src={editingProject.image} alt="Project Preview" className="max-h-40 max-w-full object-contain rounded" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button onClick={() => setEditingProject(null)} className="px-4 py-2 border border-gray-800 text-gray-400 font-mono text-xs font-bold">CANCEL</button>
                <button
                  onClick={() => {
                    if (editingProject.id) {
                      const idx = draftProjects.findIndex(p => p.id === editingProject.id);
                      let updated = [...draftProjects];
                      if (idx >= 0) {
                        updated[idx] = editingProject as MissionData;
                      } else {
                        updated.push(editingProject as MissionData);
                      }
                      setDraftProjects(updated);
                      saveProjects(updated);
                      setEditingProject(null);
                    }
                  }}
                  className="px-6 py-2 bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400"
                >
                  SAVE PROJECT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT / ADD CERTIFICATE MODAL */}
        {editingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl bg-gray-950 border border-cyan-500/50 p-6 space-y-4 rounded my-8">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h3 className="font-bold text-lg text-white font-mono uppercase">
                  {draftCerts.some(c => c.id === editingCert.id) ? 'EDIT CERTIFICATE' : 'ADD NEW CERTIFICATE'}
                </h3>
                <button onClick={() => setEditingCert(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-cyan-400 mb-1">CERTIFICATE TITLE *</label>
                  <input
                    type="text"
                    value={editingCert.title || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                    placeholder="e.g. Advanced Robotics Using AI & IoT"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-400 mb-1">ORGANIZATION / ISSUER *</label>
                    <input
                      type="text"
                      value={editingCert.organization || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, organization: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                      placeholder="e.g. AICTE - EduSkills"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 mb-1">ISSUE DATE / DURATION *</label>
                    <input
                      type="text"
                      value={editingCert.date || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                      placeholder="e.g. Jan – Mar 2026"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-400 mb-1">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={editingCert.description || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                    placeholder="Key skills, topics, or outcomes..."
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 mb-1">VERIFICATION LINK (URL)</label>
                  <input
                    type="text"
                    value={editingCert.url || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, url: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                    placeholder="https://..."
                  />
                </div>

                {/* CERTIFICATE IMAGE UPLOAD */}
                <div className="border border-gray-800 p-4 rounded bg-black/40">
                  <label className="block text-cyan-400 mb-2 uppercase font-bold">CERTIFICATE IMAGE / FILE UPLOAD</label>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="text"
                      value={editingCert.certificateFile || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, certificateFile: e.target.value })}
                      className="flex-1 px-3 py-2 bg-black border border-gray-800 text-white text-xs font-mono outline-none focus:border-cyan-400"
                      placeholder="/uploads/my_certificate.jpg"
                    />
                    <label className="px-4 py-2 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 uppercase">
                      <Upload size={14} /> UPLOAD IMAGE
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, (url) => setEditingCert({ ...editingCert, certificateFile: url }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingCert.certificateFile && (
                    <div className="mt-3 p-2 border border-cyan-500/30 bg-black flex flex-col items-center justify-center rounded">
                      <span className="text-[10px] font-mono text-cyan-400 mb-1">CERTIFICATE IMAGE PREVIEW</span>
                      <img src={editingCert.certificateFile} alt="Cert Preview" className="max-h-48 max-w-full object-contain rounded" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button onClick={() => setEditingCert(null)} className="px-4 py-2 border border-gray-800 text-gray-400 font-mono text-xs font-bold cursor-pointer">CANCEL</button>
                <button
                  onClick={() => {
                    if (editingCert.id && editingCert.title) {
                      const idx = draftCerts.findIndex(c => c.id === editingCert.id);
                      let updated = [...draftCerts];
                      if (idx >= 0) {
                        updated[idx] = editingCert as CertItem;
                      } else {
                        updated.push(editingCert as CertItem);
                      }
                      setDraftCerts(updated);
                      saveCertifications(updated);
                      setEditingCert(null);
                    }
                  }}
                  className="px-6 py-2 bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400 cursor-pointer uppercase"
                >
                  SAVE CERTIFICATE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT / ADD INTERNSHIP MODAL */}
        {editingInternship && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl bg-gray-950 border border-cyan-500/50 p-6 space-y-4 rounded my-8">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h3 className="font-bold text-lg text-white font-mono uppercase">
                  {draftInternships.some(i => i.id === editingInternship.id) ? 'EDIT INTERNSHIP' : 'ADD NEW INTERNSHIP'}
                </h3>
                <button onClick={() => setEditingInternship(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-400 mb-1">INTERNSHIP ROLE *</label>
                    <input
                      type="text"
                      value={editingInternship.role || ''}
                      onChange={(e) => setEditingInternship({ ...editingInternship, role: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                      placeholder="e.g. Web Full Stack Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 mb-1">COMPANY / ORGANIZATION *</label>
                    <input
                      type="text"
                      value={editingInternship.company || ''}
                      onChange={(e) => setEditingInternship({ ...editingInternship, company: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                      placeholder="e.g. EduSkills Academy (AICTE)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-400 mb-1">DURATION *</label>
                    <input
                      type="text"
                      value={editingInternship.duration || ''}
                      onChange={(e) => setEditingInternship({ ...editingInternship, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                      placeholder="e.g. Oct – Dec 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 mb-1">LOCATION</label>
                    <input
                      type="text"
                      value={editingInternship.location || ''}
                      onChange={(e) => setEditingInternship({ ...editingInternship, location: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                      placeholder="e.g. Virtual / Remote"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-400 mb-1">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editingInternship.description || ''}
                    onChange={(e) => setEditingInternship({ ...editingInternship, description: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                    placeholder="Responsibilities, achievements..."
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 mb-1">TECHNOLOGIES (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={editingInternship.technologies ? editingInternship.technologies.join(', ') : ''}
                    onChange={(e) => setEditingInternship({ ...editingInternship, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 bg-black border border-gray-800 text-white outline-none focus:border-cyan-400"
                    placeholder="HTML, CSS, JavaScript, React"
                  />
                </div>

                {/* INTERNSHIP CERTIFICATE IMAGE UPLOAD */}
                <div className="border border-gray-800 p-4 rounded bg-black/40">
                  <label className="block text-cyan-400 mb-2 uppercase font-bold">INTERNSHIP CERTIFICATE IMAGE UPLOAD</label>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="text"
                      value={editingInternship.certificateUrl || ''}
                      onChange={(e) => setEditingInternship({ ...editingInternship, certificateUrl: e.target.value, certificateAvailable: true })}
                      className="flex-1 px-3 py-2 bg-black border border-gray-800 text-white text-xs font-mono outline-none focus:border-cyan-400"
                      placeholder="/uploads/internship_cert.jpg"
                    />
                    <label className="px-4 py-2 bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 uppercase">
                      <Upload size={14} /> UPLOAD IMAGE
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, (url) => setEditingInternship({ ...editingInternship, certificateUrl: url, certificateAvailable: true }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingInternship.certificateUrl && (
                    <div className="mt-3 p-2 border border-cyan-500/30 bg-black flex flex-col items-center justify-center rounded">
                      <span className="text-[10px] font-mono text-cyan-400 mb-1">INTERNSHIP CERTIFICATE PREVIEW</span>
                      <img src={editingInternship.certificateUrl} alt="Internship Cert Preview" className="max-h-48 max-w-full object-contain rounded" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button onClick={() => setEditingInternship(null)} className="px-4 py-2 border border-gray-800 text-gray-400 font-mono text-xs font-bold cursor-pointer">CANCEL</button>
                <button
                  onClick={() => {
                    if (editingInternship.id && editingInternship.role) {
                      const idx = draftInternships.findIndex(i => i.id === editingInternship.id);
                      let updated = [...draftInternships];
                      if (idx >= 0) {
                        updated[idx] = editingInternship as InternshipItem;
                      } else {
                        updated.push(editingInternship as InternshipItem);
                      }
                      setDraftInternships(updated);
                      saveInternships(updated);
                      setEditingInternship(null);
                    }
                  }}
                  className="px-6 py-2 bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400 cursor-pointer uppercase"
                >
                  SAVE INTERNSHIP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-gray-950 border border-red-500/50 p-6 space-y-4 text-center">
              <AlertTriangle size={36} className="text-red-500 mx-auto" />
              <h3 className="font-bold text-lg text-white">CONFIRM DELETION</h3>
              <p className="text-xs font-mono text-gray-400">
                Are you sure you want to delete <strong className="text-white">{deleteTarget.name}</strong>?
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button onClick={() => setDeleteTarget(null)} className="px-5 py-2 border border-gray-800 text-gray-400 font-mono text-xs font-bold cursor-pointer">CANCEL</button>
                <button
                  onClick={() => {
                    if (deleteTarget.type === 'projects') {
                      const updated = draftProjects.filter(p => p.id !== deleteTarget.id);
                      setDraftProjects(updated);
                      saveProjects(updated);
                    } else if (deleteTarget.type === 'certifications') {
                      const updated = draftCerts.filter(c => c.id !== deleteTarget.id);
                      setDraftCerts(updated);
                      saveCertifications(updated);
                    } else if (deleteTarget.type === 'internships') {
                      const updated = draftInternships.filter(i => i.id !== deleteTarget.id);
                      setDraftInternships(updated);
                      saveInternships(updated);
                    }
                    setDeleteTarget(null);
                  }}
                  className="px-5 py-2 bg-red-500 text-white font-mono text-xs font-bold hover:bg-red-600 cursor-pointer uppercase"
                >
                  CONFIRM DELETE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UNSAVED CHANGES MODAL */}
        {showUnsavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-gray-950 border border-amber-500/50 p-6 space-y-4 text-center">
              <AlertTriangle size={36} className="text-amber-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">UNSAVED CHANGES</h3>
              <p className="text-xs font-mono text-gray-400">
                You have unsaved changes in this section. Would you like to save or discard before switching tabs?
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowUnsavedModal(false);
                    setHasUnsaved(false);
                    if (nextTab) setActiveTab(nextTab);
                  }}
                  className="px-4 py-2 border border-gray-800 text-gray-400 font-mono text-xs font-bold cursor-pointer"
                >
                  DISCARD
                </button>
                <button
                  onClick={() => {
                    setShowUnsavedModal(false);
                    if (nextTab) setActiveTab(nextTab);
                  }}
                  className="px-4 py-2 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    setShowUnsavedModal(false);
                    setHasUnsaved(false);
                    if (nextTab) setActiveTab(nextTab);
                  }}
                  className="px-5 py-2 bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400 cursor-pointer uppercase"
                >
                  SAVE & CONTINUE
                </button>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </AnimatePresence>
  );
};
