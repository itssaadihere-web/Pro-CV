-- Create credit_transactions table
create table if not exists public.credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  service_name text not null,
  credits_changed integer not null,
  balance_after integer not null,
  created_at timestamptz default now()
);

-- Create service_activities table for tracking all 5 Sophi services
create table if not exists public.service_activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  service_type text not null, -- 'CREATE_CV' | 'TRANSFORM_CV' | 'LINKEDIN_OPTIMIZER' | 'ATS_EVALUATION' | 'TAILOR_CV'
  service_title text not null,
  status text default 'completed',
  target_url text, -- link to view report/result page
  metadata jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.credit_transactions enable row level security;
alter table public.service_activities enable row level security;

-- RLS Policies for credit_transactions
drop policy if exists "Users can view own transactions" on public.credit_transactions;
create policy "Users can view own transactions" on public.credit_transactions
  for select using (auth.uid() = user_id);

drop policy if exists "Service role can manage transactions" on public.credit_transactions;
create policy "Service role can manage transactions" on public.credit_transactions
  for all using (true);

-- RLS Policies for service_activities
drop policy if exists "Users can view own activities" on public.service_activities;
create policy "Users can view own activities" on public.service_activities
  for select using (auth.uid() = user_id);

drop policy if exists "Service role can manage activities" on public.service_activities;
create policy "Service role can manage activities" on public.service_activities
  for all using (true);

-- Create Indexes
create index if not exists idx_credit_transactions_user on public.credit_transactions(user_id);
create index if not exists idx_service_activities_user on public.service_activities(user_id);
