-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE app_role AS ENUM ('writer', 'producer');
CREATE TYPE script_status AS ENUM ('concept', 'draft', 'final');
CREATE TYPE script_visibility AS ENUM ('private', 'protected', 'public');
CREATE TYPE match_state AS ENUM ('suggested', 'liked', 'connected', 'blocked');
CREATE TYPE message_type AS ENUM ('text', 'file', 'system');
CREATE TYPE call_status AS ENUM ('scheduled', 'live', 'ended');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Writer-specific profile data
CREATE TABLE public.writer_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  genres TEXT[] DEFAULT '{}',
  links JSONB DEFAULT '{}',
  trust_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Producer-specific profile data
CREATE TABLE public.producer_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  studio_name TEXT,
  bio TEXT,
  genres TEXT[] DEFAULT '{}',
  website TEXT,
  verification_status verification_status DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scripts table
CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  writer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  logline TEXT,
  genre TEXT,
  status script_status DEFAULT 'draft',
  visibility script_visibility DEFAULT 'private',
  storage_key TEXT,
  drm_hash TEXT,
  cover_url TEXT,
  page_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Video pitches table
CREATE TABLE public.video_pitches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  writer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  script_id UUID REFERENCES public.scripts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  duration_sec INTEGER,
  caption_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  writer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  script_id UUID REFERENCES public.scripts(id) ON DELETE SET NULL,
  state match_state DEFAULT 'suggested',
  reason JSONB DEFAULT '{}',
  score FLOAT DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(writer_id, producer_id, script_id)
);

-- Message threads table
CREATE TABLE public.message_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  writer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(writer_id, producer_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type message_type DEFAULT 'text',
  body TEXT,
  file_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Calls table
CREATE TABLE public.calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  provider_room_id TEXT,
  status call_status DEFAULT 'scheduled',
  recording_key TEXT,
  summary JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Collections table (for producers)
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Collection items table
CREATE TABLE public.collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(collection_id, script_id)
);

-- Access grants table (for DRM/protected scripts)
CREATE TABLE public.access_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  granted_to_producer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  nda_accepted BOOLEAN DEFAULT false,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(script_id, granted_to_producer_id)
);

-- Event log table for audit trail
CREATE TABLE public.event_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for writer_profiles
CREATE POLICY "Anyone can view writer profiles" ON public.writer_profiles FOR SELECT USING (true);
CREATE POLICY "Writers can update own profile" ON public.writer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Writers can insert own profile" ON public.writer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for producer_profiles
CREATE POLICY "Anyone can view producer profiles" ON public.producer_profiles FOR SELECT USING (true);
CREATE POLICY "Producers can update own profile" ON public.producer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Producers can insert own profile" ON public.producer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for scripts
CREATE POLICY "Writers can view own scripts" ON public.scripts FOR SELECT USING (auth.uid() = writer_id);
CREATE POLICY "Public scripts visible to all" ON public.scripts FOR SELECT USING (visibility = 'public');
CREATE POLICY "Producers can view scripts they have access to" ON public.scripts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.access_grants 
    WHERE access_grants.script_id = scripts.id 
    AND access_grants.granted_to_producer_id = auth.uid()
    AND access_grants.expires_at > now()
  )
);
CREATE POLICY "Writers can insert own scripts" ON public.scripts FOR INSERT WITH CHECK (auth.uid() = writer_id);
CREATE POLICY "Writers can update own scripts" ON public.scripts FOR UPDATE USING (auth.uid() = writer_id);
CREATE POLICY "Writers can delete own scripts" ON public.scripts FOR DELETE USING (auth.uid() = writer_id);

-- RLS Policies for video_pitches
CREATE POLICY "Writers can view own pitches" ON public.video_pitches FOR SELECT USING (auth.uid() = writer_id);
CREATE POLICY "Writers can insert own pitches" ON public.video_pitches FOR INSERT WITH CHECK (auth.uid() = writer_id);
CREATE POLICY "Writers can update own pitches" ON public.video_pitches FOR UPDATE USING (auth.uid() = writer_id);
CREATE POLICY "Writers can delete own pitches" ON public.video_pitches FOR DELETE USING (auth.uid() = writer_id);

-- RLS Policies for matches
CREATE POLICY "Writers can view matches involving them" ON public.matches FOR SELECT USING (auth.uid() = writer_id);
CREATE POLICY "Producers can view matches involving them" ON public.matches FOR SELECT USING (auth.uid() = producer_id);
CREATE POLICY "Users can insert matches" ON public.matches FOR INSERT WITH CHECK (auth.uid() = writer_id OR auth.uid() = producer_id);
CREATE POLICY "Users can update own matches" ON public.matches FOR UPDATE USING (auth.uid() = writer_id OR auth.uid() = producer_id);

-- RLS Policies for message_threads
CREATE POLICY "Participants can view threads" ON public.message_threads FOR SELECT USING (auth.uid() = writer_id OR auth.uid() = producer_id);
CREATE POLICY "Participants can create threads" ON public.message_threads FOR INSERT WITH CHECK (auth.uid() = writer_id OR auth.uid() = producer_id);

-- RLS Policies for messages
CREATE POLICY "Thread participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.message_threads 
    WHERE message_threads.id = messages.thread_id 
    AND (message_threads.writer_id = auth.uid() OR message_threads.producer_id = auth.uid())
  )
);
CREATE POLICY "Thread participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.message_threads 
    WHERE message_threads.id = thread_id 
    AND (message_threads.writer_id = auth.uid() OR message_threads.producer_id = auth.uid())
  ) AND auth.uid() = sender_id
);

-- RLS Policies for calls
CREATE POLICY "Thread participants can view calls" ON public.calls FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.message_threads 
    WHERE message_threads.id = calls.thread_id 
    AND (message_threads.writer_id = auth.uid() OR message_threads.producer_id = auth.uid())
  )
);
CREATE POLICY "Thread participants can create calls" ON public.calls FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.message_threads 
    WHERE message_threads.id = thread_id 
    AND (message_threads.writer_id = auth.uid() OR message_threads.producer_id = auth.uid())
  )
);

-- RLS Policies for collections
CREATE POLICY "Producers can view own collections" ON public.collections FOR SELECT USING (auth.uid() = producer_id);
CREATE POLICY "Producers can create collections" ON public.collections FOR INSERT WITH CHECK (auth.uid() = producer_id);
CREATE POLICY "Producers can update own collections" ON public.collections FOR UPDATE USING (auth.uid() = producer_id);
CREATE POLICY "Producers can delete own collections" ON public.collections FOR DELETE USING (auth.uid() = producer_id);

-- RLS Policies for collection_items
CREATE POLICY "Collection owners can manage items" ON public.collection_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE collections.id = collection_items.collection_id 
    AND collections.producer_id = auth.uid()
  )
);

-- RLS Policies for access_grants
CREATE POLICY "Writers can view grants for their scripts" ON public.access_grants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.scripts WHERE scripts.id = access_grants.script_id AND scripts.writer_id = auth.uid())
);
CREATE POLICY "Producers can view their grants" ON public.access_grants FOR SELECT USING (auth.uid() = granted_to_producer_id);
CREATE POLICY "Writers can create grants" ON public.access_grants FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.scripts WHERE scripts.id = script_id AND scripts.writer_id = auth.uid())
);

-- RLS Policies for event_logs
CREATE POLICY "Users can view own event logs" ON public.event_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert event logs" ON public.event_logs FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON public.scripts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_threads;