-- 1. Crear tabla de LEADS (Formulario de captación)
create table if not exists leads (
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

-- 2. Crear tabla de STOCK (Coches disponibles)
create table if not exists stock (
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

-- Habilitar RLS (Row Level Security) y políticas de lectura pública para stock
alter table stock enable row level security;
alter table leads enable row level security;

-- Política: Cualquiera puede ver el stock
create policy "Permitir lectura pública de stock" 
  on stock for select 
  using (true);

-- Política: Cualquiera puede insertar leads (para el formulario)
create policy "Permitir inserción de leads desde el frontend" 
  on leads for insert 
  with check (true);

-- 3. Insertar datos de ejemplo (Seed data) para stock
insert into stock (marca, modelo, precio, ano, kilometros, combustible, etiqueta_dgt, imagenes, informe_url, disponible)
values
  (
    'Porsche',
    '911 Carrera S Coupe (992)',
    132900,
    2021,
    24500,
    'Gasolina',
    'C',
    array['/cars/porsche_911.jpg'],
    'https://www.carfax.es/informe-vehiculo',
    true
  ),
  (
    'Audi',
    'RS6 Avant TFSI V8 Quattro',
    124500,
    2022,
    38000,
    'Gasolina (MHEV)',
    'ECO',
    array['/cars/audi_rs6.jpg'],
    'https://www.carfax.es/informe-vehiculo',
    true
  ),
  (
    'Mercedes-Benz',
    'G-Class G 63 AMG V8 BiTurbo',
    198000,
    2022,
    19500,
    'Gasolina',
    'C',
    array['/cars/g63.jpg'],
    'https://www.carfax.es/informe-vehiculo',
    true
  );
