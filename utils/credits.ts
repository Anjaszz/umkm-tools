import { createClient } from './supabase/client';

export async function getUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function useCredit(featureName: string, amount: number = 1) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.rpc('deduct_credits', {
    p_user_id: user.id,
    p_amount: amount,
    p_feature: featureName
  });

  if (error) {
    throw new Error(error.message || 'Gagal memproses credit');
  }

  return true;
}
