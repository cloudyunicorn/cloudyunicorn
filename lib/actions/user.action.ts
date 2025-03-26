"use server"

import { useSupabase } from "@/providers/supabase-provider";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface SignUpFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

export async function signOutAction() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    redirect("/");
  };

export async function signInAction(values: FormValues) {
  const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }
  return redirect("/");
}