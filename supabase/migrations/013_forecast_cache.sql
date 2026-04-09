-- Cache for NOAA NWPS flow forecasts (30-min TTL via app logic)
create table if not exists public.forecast_cache (
  gauge_id text primary key,
  nws_id text not null,
  forecasts jsonb not null,
  fetched_at timestamptz not null default now()
);

create index if not exists idx_forecast_cache_fetched on public.forecast_cache(fetched_at);

alter table public.forecast_cache enable row level security;

create policy "Forecast cache is publicly readable"
  on public.forecast_cache for select
  using (true);

create policy "System can write forecast cache"
  on public.forecast_cache for all
  using (true);
