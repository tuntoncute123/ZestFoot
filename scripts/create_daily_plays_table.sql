-- Create table to track daily game plays
CREATE TABLE IF NOT EXISTS public.daily_game_plays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    game_name TEXT NOT NULL,
    last_played_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, game_name, last_played_at) -- Constraint might be tricky with timestamp, better separate date logic or just insert raw
);

-- Better index to find today's plays quickly
CREATE INDEX IF NOT EXISTS idx_daily_game_plays_user_game ON public.daily_game_plays(user_id, game_name);

-- RLS Policies
ALTER TABLE public.daily_game_plays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own plays" ON public.daily_game_plays
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plays" ON public.daily_game_plays
    FOR INSERT WITH CHECK (auth.uid() = user_id);
