-- Storage bucket for outfitter logos and cover photos
insert into storage.buckets (id, name, public)
values ('outfitter-assets', 'outfitter-assets', true)
on conflict (id) do nothing;

-- Anyone can upload to outfitter-assets bucket
create policy "Public upload outfitter-assets" on storage.objects
  for insert with check (bucket_id = 'outfitter-assets');

-- Anyone can read outfitter-assets
create policy "Public read outfitter-assets" on storage.objects
  for select using (bucket_id = 'outfitter-assets');

-- Owner can update their own files
create policy "Owner update outfitter-assets" on storage.objects
  for update using (bucket_id = 'outfitter-assets');

-- Owner can delete their own files
create policy "Owner delete outfitter-assets" on storage.objects
  for delete using (bucket_id = 'outfitter-assets');
