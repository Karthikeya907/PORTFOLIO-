import React, { createContext, useContext, useState, useEffect } from 'react';
import projectsData from '../data/projects.json';
import internshipsData from '../data/internships.json';
import certificationsData from '../data/certifications.json';
import skillsData from '../data/skills.json';
import profileData from '../data/profile.json';
import type { MissionData } from '../components/MissionCard';

export interface InternshipItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  location?: string;
  description: string;
  technologies: string[];
  certificateAvailable?: boolean;
  certificateUrl?: string;
  companyLogo?: string;
  hidden?: boolean;
}

export interface CertItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  url?: string;
  certificateFile?: string;
  visible?: boolean;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ProfileInfo {
  name: string;
  title: string;
  shortIntro: string;
  profileImage?: string;
  email: string;
  phone: string;
  whatsapp: string;
  location?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  visible: boolean;
}

export interface AboutInfo {
  shortIntro: string;
  description: string;
  currentFocus: string;
  interests: string[];
}

export interface ResumeInfo {
  fileUrl: string;
  filename: string;
  available: boolean;
  lastUpdated: string;
}

export interface SiteSettings {
  siteTitle: string;
  heroHeading: string;
  heroSubtitle: string;
  showSections: Record<string, boolean>;
  enableAnimations: boolean;
  enableSound: boolean;
}

interface PortfolioContextType {
  projects: MissionData[];
  internships: InternshipItem[];
  certifications: CertItem[];
  skills: SkillCategory[];
  profile: ProfileInfo;
  socialLinks: SocialLink[];
  about: AboutInfo;
  resume: ResumeInfo;
  settings: SiteSettings;
  loading: boolean;
  updateSection: (section: string, data: any) => Promise<boolean>;
  uploadFile: (fileName: string, fileData: string, fileCategory?: string) => Promise<{ success: boolean; fileUrl?: string }>;
  exportBackup: () => Promise<any>;
  importBackup: (backupData: any) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:3000`;
  }
  return 'http://localhost:3000';
};

export const API_BASE = getApiBase();

export const getImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('http://localhost:3000') || url.startsWith('http://127.0.0.1:3000')) {
    const relativePath = url.replace(/^http:\/\/[^/]+/, '');
    return `${getApiBase()}${relativePath}`;
  }
  if (url.startsWith('/uploads')) {
    return `${getApiBase()}${url}`;
  }
  return url;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<MissionData[]>(projectsData as MissionData[]);
  const [internships, setInternships] = useState<InternshipItem[]>(internshipsData as InternshipItem[]);
  const [certifications, setCertifications] = useState<CertItem[]>(certificationsData as CertItem[]);
  const [skills, setSkills] = useState<SkillCategory[]>(skillsData as SkillCategory[]);
  const [profile, setProfile] = useState<ProfileInfo>(profileData.profile as ProfileInfo);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(profileData.socialLinks as SocialLink[]);
  const [about, setAbout] = useState<AboutInfo>(profileData.about as AboutInfo);
  const [resume, setResume] = useState<ResumeInfo>(profileData.resume as ResumeInfo);
  const [settings, setSettings] = useState<SiteSettings>(profileData.settings as SiteSettings);
  const [loading, setLoading] = useState(true);

  const normalizeProjects = (projs: MissionData[]) =>
    projs.map((p) => ({
      ...p,
      image: p.image ? getImageUrl(p.image) : p.image,
    }));

  const refreshData = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/portfolio`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.projects) setProjects(normalizeProjects(json.data.projects));
          if (json.data.internships) setInternships(json.data.internships);
          if (json.data.certifications) setCertifications(json.data.certifications);
          if (json.data.skills) setSkills(json.data.skills);
          if (json.data.profile) setProfile(json.data.profile);
          if (json.data.socialLinks) setSocialLinks(json.data.socialLinks);
          if (json.data.about) setAbout(json.data.about);
          if (json.data.resume) setResume(json.data.resume);
          if (json.data.settings) setSettings(json.data.settings);
        }
      }
    } catch (err) {
      console.warn('Could not connect to portfolio backend API, using local fallbacks.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateSection = async (section: string, data: any): Promise<boolean> => {
    // Update local state immediately for snappy UI
    if (section === 'projects') setProjects(data);
    else if (section === 'internships') setInternships(data);
    else if (section === 'certifications') setCertifications(data);
    else if (section === 'skills') setSkills(data);
    else if (section === 'profile') setProfile(data);
    else if (section === 'socialLinks') setSocialLinks(data);
    else if (section === 'about') setAbout(data);
    else if (section === 'resume') setResume(data);
    else if (section === 'settings') setSettings(data);

    try {
      const res = await fetch(`${getApiBase()}/api/admin/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });
      const json = await res.json();
      return json.success === true;
    } catch (err) {
      console.error('Failed to send update to backend API:', err);
      return false;
    }
  };

  const uploadFile = async (fileName: string, fileData: string, fileCategory = 'media') => {
    try {
      const res = await fetch(`${getApiBase()}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileData, fileCategory }),
      });
      const json = await res.json();
      if (json.success) {
        return { success: true, fileUrl: getImageUrl(json.fileUrl) };
      }
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
    return { success: false };
  };

  const exportBackup = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/export`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Failed to export backup:', err);
    }
    return {
      projects,
      internships,
      certifications,
      skills,
      profileData: { profile, socialLinks, about, resume, settings },
    };
  };

  const importBackup = async (backupData: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData),
      });
      const json = await res.json();
      if (json.success) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error('Failed to import backup:', err);
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        internships,
        certifications,
        skills,
        profile,
        socialLinks,
        about,
        resume,
        settings,
        loading,
        updateSection,
        uploadFile,
        exportBackup,
        importBackup,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
