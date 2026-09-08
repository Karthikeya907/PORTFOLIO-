import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://revpzenwwreboqwqkbxv.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lRBwUp5oon4bmDPWOE7euQ_kXdsn8cq';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database helper to fetch portfolio section data
export const fetchSectionData = async (section: string) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('content')
      .eq('section', section)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn(`Supabase fetch error for section ${section}:`, error.message);
      return null;
    }
    return data ? data.content : null;
  } catch (err) {
    console.warn(`Supabase fetch exception for section ${section}:`, err);
    return null;
  }
};

// Database helper to save portfolio section data
export const saveSectionData = async (section: string, content: any): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('portfolio_content')
      .upsert({ section, content, updated_at: new Date().toISOString() }, { onConflict: 'section' });

    if (error) {
      console.error(`Supabase save error for section ${section}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Supabase save exception for section ${section}:`, err);
    return false;
  }
};

// Helper to save contact form messages into Supabase Cloud DB
export const sendContactMessage = async (msg: { name: string; email: string; message: string }): Promise<boolean> => {
  try {
    const existingMessages = (await fetchSectionData('messages')) || [];
    const newMessages = [
      { id: Date.now().toString(), ...msg, timestamp: new Date().toISOString(), read: false }, ...existingMessages
    ];
    return await saveSectionData('messages', newMessages);
  } catch (e) {
    console.error('Error saving contact message:', e);
    return false;
  }
};

// Storage helper to upload file to Supabase bucket 'portfolio-assets'
export const uploadFileToSupabase = async (
  file: File | Blob | string,
  fileName: string,
  folder = 'media'
): Promise<{ success: boolean; fileUrl?: string }> => {
  if (!supabase) return { success: false };

  try {
    const bucket = 'portfolio-assets';
    const filePath = `${folder}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    let fileBody: File | Blob;

    if (typeof file === 'string') {
      // Base64 or Data URL string conversion
      const response = await fetch(file);
      fileBody = await response.blob();
    } else {
      fileBody = file;
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBody, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return {
          success: true,
          fileUrl: publicUrlData.publicUrl,
        };
      }
    } else {
      console.warn('Supabase storage upload policy/error, falling back to reliable data URL:', uploadError.message);
    }

    // Fallback: If Storage bucket has RLS restriction, return base64 data URL directly
    if (typeof file === 'string') {
      return { success: true, fileUrl: file };
    }

    return { success: false };
  } catch (err) {
    console.warn('Supabase storage upload exception, falling back to data URL:', err);
    if (typeof file === 'string') {
      return { success: true, fileUrl: file };
    }
    return { success: false };
  }
};
