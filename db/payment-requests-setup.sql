-- Execute no SQL Editor do Supabase

-- Criar tabela de solicitações de pagamento
create table payment_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  receipt_url text,
  status text default 'pending',
  created_at timestamp default now()
);

-- Criar bucket de storage para comprovantes
create storage bucket payment-receipts public;

-- Habilitar RLS (opcional, mas recomendado)
alter table payment_requests enable row level security;

-- Política para admin ler todos
create policy "Admin can select all payment_requests" 
  on payment_requests for select 
  using (true);

-- Política para admin inserir
create policy "Admin can insert payment_requests" 
  on payment_requests for insert 
  using (true);

-- Política para admin atualizar
create policy "Admin can update payment_requests" 
  on payment_requests for update 
  using (true);