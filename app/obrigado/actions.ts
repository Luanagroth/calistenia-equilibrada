import { createClient } from "@/lib/supabase/client";

export async function submitPaymentRequest(formData: {
  name: string;
  email: string;
  phone?: string;
  receiptFile?: File | null;
}) {
  const supabase = createClient();

  let receiptUrl: string | null = null;

  if (formData.receiptFile) {
    const fileExt = formData.receiptFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-receipts")
      .upload(filePath, formData.receiptFile);

    if (!uploadError) {
      const { data } = supabase.storage.from("payment-receipts").getPublicUrl(filePath);
      receiptUrl = data.publicUrl;
    }
  }

  const { error } = await supabase.from("payment_requests").insert({
    name: formData.name,
    email: formData.email,
    phone: formData.phone || null,
    receipt_url: receiptUrl,
    status: "pending",
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}