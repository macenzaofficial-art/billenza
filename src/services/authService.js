import { supabase, isSupabaseConfigured } from './supabaseClient';

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const signInWithEmail = async (email, password) => {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email, password, businessName = '', planTier = 'pro_monthly') => {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { business_name: businessName, plan_tier: planTier },
    },
  });
  if (error) throw error;

  // If session is immediately established (confirm email disabled), provision organization and default profile
  if (data?.user) {
    try {
      await supabase.from('organizations').upsert({
        owner_id: data.user.id,
        name: businessName || 'My Business',
        plan_tier: planTier,
        subscription_status: null,
        updated_at: new Date().toISOString(),
      });
      await supabase.from('profiles').upsert({
        user_id: data.user.id,
        business_name: businessName || 'My Business',
        email: email || '',
        is_default: true,
        data: {
          businessName: businessName || 'My Business',
          email: email || '',
          isDefault: true,
        },
      });
    } catch (e) {
      console.warn('Initial organization/profile setup will be completed at subscription:', e);
    }
  }

  return data;
};

export const signInWithMagicLink = async (email) => {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUserSubscription = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return null;
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Error fetching subscription:', error);
    return null;
  }
  return data;
};
