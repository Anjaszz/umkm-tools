-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'free', -- 'free', 'premium', 'admin'
  credits NUMERIC(10,2) DEFAULT 10,   -- Initial free credits
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Credit Transactions Table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,    -- e.g., -0.25 for usage, +50 for top-up
  type TEXT NOT NULL,                -- 'usage', 'topup', 'bonus'
  feature TEXT,                      -- 'photo-enhancer', 'poster-generator', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Profiles
-- CLEANUP OLD POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- NEW OPTIMIZED POLICIES
CREATE POLICY "Profile Visibility" 
ON public.profiles FOR SELECT 
USING (
  auth.uid() = id OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Profile Update" 
ON public.profiles FOR UPDATE 
USING (
  auth.uid() = id OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Profile Delete" 
ON public.profiles FOR DELETE 
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 5. Policies for Credit Transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.credit_transactions;

CREATE POLICY "Transaction Visibility" 
ON public.credit_transactions FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 6. Trigger to create profile on signup (Updated with JWT metadata sync)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create the profile
  INSERT INTO public.profiles (id, full_name, credits, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 10, 'free');

  -- 2. Sync role to auth.users raw_app_meta_data for RLS efficiency
  UPDATE auth.users 
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', 'free')
  WHERE id = new.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Function to deduct credits safely
-- DROPPING OLD VERSIONS TO PREVENT OVERLOADING ERRORS
DROP FUNCTION IF EXISTS deduct_credits(UUID, INT, TEXT);
DROP FUNCTION IF EXISTS deduct_credits(UUID, NUMERIC, TEXT);

CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount NUMERIC, p_feature TEXT)
RETURNS VOID AS $$
BEGIN
  -- Logic: Deduct only if user has enough credits or is premium
  IF EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id AND (credits >= p_amount OR role = 'premium' OR role = 'admin')) THEN
    UPDATE profiles 
    SET credits = credits - p_amount 
    WHERE id = p_user_id AND role NOT IN ('premium', 'admin');
    
    INSERT INTO credit_transactions (user_id, amount, type, feature)
    VALUES (p_user_id, -p_amount, 'usage', p_feature);
  ELSE
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Function to update role securely (profile + auth metadata)
CREATE OR REPLACE FUNCTION set_user_role(p_user_id UUID, p_role TEXT)
RETURNS VOID AS $$
BEGIN
  -- 1. Update Profile
  UPDATE public.profiles SET role = p_role WHERE id = p_user_id;

  -- 2. Update Auth Metadata
  UPDATE auth.users 
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', p_role)
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. [CRITICAL] ONE-TIME SYNC FOR EXISTING USERS
-- Run this to ensure your current Admin account gets the "badge" in the system
UPDATE auth.users
SET raw_app_meta_data = 
  COALESCE(raw_app_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', profiles.role)
FROM public.profiles
WHERE auth.users.id = profiles.id;
