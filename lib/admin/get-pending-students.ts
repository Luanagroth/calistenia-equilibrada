import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

export type PendingStudent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  receiptUrl: string | null;
  status: string;
  createdAt: string;
};

export async function getPendingStudents(): Promise<PendingStudent[]> {
  const { data, error } = await supabaseAdmin
    .from("payment_requests")
    .select("id, name, email, phone, receipt_url, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    receiptUrl: row.receipt_url ?? null,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function getPendingStudentById(id: string): Promise<PendingStudent | null> {
  const { data, error } = await supabaseAdmin
    .from("payment_requests")
    .select("id, name, email, phone, receipt_url, status, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    receiptUrl: data.receipt_url ?? null,
    status: data.status,
    createdAt: data.created_at,
  };
}