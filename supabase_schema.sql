-- 1. Tabla de perfiles de usuarios (Profiles)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  first_name text,
  last_name text,
  username text unique,
  phone text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para rellenar Profiles automáticamente desde auth.users de Supabase
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, username, phone, is_admin)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'phone',
    case when new.email = 'taibkkabouh@gmail.com' then true else false end
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Tabla de stock de NordImport (Unidades oficiales de importación selecta)
create table if not exists public.stock (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  marca text not null,
  modelo text not null,
  precio numeric not null,
  ano integer not null,
  kilometros integer not null,
  combustible text not null,
  etiqueta_dgt text,
  imagenes text[],
  informe_url text,
  disponible boolean default true
);

-- 3. Tabla de coches del marketplace (Cars - C2C)
create table if not exists public.cars (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  brand text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  kilometers integer,
  power integer,
  fuel_type text,
  body_type text,
  doors integer,
  color text,
  extras text,
  description text,
  images text[] default '{}',
  trust_badges text[] default '{}',
  finance_available boolean default false,
  transmission text,
  province text,
  status text default 'pending', -- 'pending', 'approved', 'sold'
  views integer default 0,
  shares integer default 0,
  seller_id uuid references public.profiles(id) on delete cascade
);

-- 4. Tabla de favoritos del marketplace (Favorites)
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade,
  car_id uuid references public.cars(id) on delete cascade,
  unique(user_id, car_id)
);

-- 5. Tabla de leads del Quiz general (Captación de clientes a la carta)
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nombre text not null,
  telefono text not null,
  email text not null,
  marca_modelo text not null,
  presupuesto_max numeric not null,
  servicio_deseado text check (servicio_deseado in ('basico', 'estandar', 'premium')),
  estado text default 'nuevo'
);

-- 6. Tabla de leads del marketplace (Consultas directas a vendedores por coche)
create table if not exists public.marketplace_leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  car_id uuid references public.cars(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  message text
);

-- 7. Tabla del diccionario de marcas y modelos
create table if not exists public.dictionary_brands (
  id uuid default gen_random_uuid() primary key,
  brand text not null unique,
  models text[] not null default '{}'
);

-- Funciones RPC para estadísticas del marketplace (Incrementadores de vistas y compartidos)
create or replace function public.increment_car_view(target_id uuid)
returns void as $$
begin
  update public.cars
  set views = coalesce(views, 0) + 1
  where id = target_id;
end;
$$ language plpgsql security definer;

create or replace function public.increment_car_share(target_id uuid)
returns void as $$
begin
  update public.cars
  set shares = coalesce(shares, 0) + 1
  where id = target_id;
end;
$$ language plpgsql security definer;

-- Habilitar RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.stock enable row level security;
alter table public.cars enable row level security;
alter table public.favorites enable row level security;
alter table public.leads enable row level security;
alter table public.marketplace_leads enable row level security;
alter table public.dictionary_brands enable row level security;

-- POLÍTICAS DE RLS --

-- Perfiles (Profiles)
create policy "Cualquiera puede leer perfiles" on public.profiles for select using (true);
create policy "Los usuarios pueden actualizar su propio perfil" on public.profiles for update using (auth.uid() = id);

-- Stock (Unidades oficiales de NordImport)
create policy "Permitir lectura pública de stock" on public.stock for select using (true);

-- Cars (Coches del marketplace C2C)
create policy "Cualquiera puede ver coches aprobados" on public.cars for select using (status = 'approved');
create policy "Los vendedores pueden ver sus propios coches de cualquier estado" on public.cars for select using (auth.uid() = seller_id);
create policy "Los vendedores pueden insertar sus propios coches" on public.cars for insert with check (auth.uid() = seller_id);
create policy "Los vendedores pueden actualizar sus propios coches" on public.cars for update using (auth.uid() = seller_id);
create policy "Los vendedores pueden eliminar sus propios coches" on public.cars for delete using (auth.uid() = seller_id);
create policy "Los administradores pueden gestionar todo en cars" on public.cars for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- Favoritos (Favorites)
create policy "Los usuarios pueden gestionar sus propios favoritos" on public.favorites for all using (auth.uid() = user_id);

-- Leads del Quiz General
create policy "Cualquiera puede insertar leads desde el frontend" on public.leads for insert with check (true);

-- Leads del Marketplace
create policy "Cualquiera puede insertar consultas en coches" on public.marketplace_leads for insert with check (true);
create policy "Los vendedores pueden ver consultas sobre sus propios coches" on public.marketplace_leads for select using (
  exists (select 1 from public.cars where id = car_id and seller_id = auth.uid())
);

-- Diccionario de marcas
create policy "Cualquiera puede leer el diccionario de marcas" on public.dictionary_brands for select using (true);

-- SEED DATA DE EJEMPLO PARA STOCK (Coches de NordImport)
insert into public.stock (marca, modelo, precio, ano, kilometros, combustible, etiqueta_dgt, imagenes, informe_url, disponible)
values
  ('Porsche', '911 Carrera S Coupe (992)', 132900, 2021, 24500, 'Gasolina', 'C', array['/cars/porsche_911.jpg'], 'https://www.carfax.es', true),
  ('Audi', 'RS6 Avant TFSI V8 Quattro', 124500, 2022, 38000, 'Gasolina (MHEV)', 'ECO', array['/cars/audi_rs6.jpg'], 'https://www.carfax.es', true),
  ('Mercedes-Benz', 'G-Class G 63 AMG V8 BiTurbo', 198000, 2022, 19500, 'Gasolina', 'C', array['/cars/g63.jpg'], 'https://www.carfax.es', true)
on conflict do nothing;

-- SEED DATA DICCIONARIO DE MARCAS Y MODELOS
insert into public.dictionary_brands (brand, models)
values
  ('Audi', array['A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'e-tron', 'R8', 'RS3', 'RS6']),
  ('BMW', array['Serie 1', 'Serie 3', 'Serie 4', 'Serie 5', 'X1', 'X3', 'X5', 'i4', 'M2', 'M4', 'M5']),
  ('Porsche', array['911 Carrera', 'Cayenne', 'Macan', 'Panamera', 'Taycan', '718 Cayman', '718 Boxster']),
  ('Mercedes-Benz', '{"Clase A", "Clase C", "Clase E", "GLA", "GLC", "GLE", "EQE", "AMG GT", "Clase G"}'),
  ('Volkswagen', '{"Golf", "Polo", "Tiguan", "Touareg", "ID.4", "ID.Buzz", "T-Roc"}')
on conflict (brand) do update set models = excluded.models;
