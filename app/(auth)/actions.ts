"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  //Redirige al catálogo si el login es exitoso
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      //Pasamos el nombre completo a la metadata para que el triggre de la BD lo capture
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }
  //Redirige con un mensaje de éxito para que revisen su correo
  redirect(
    "/login?message=Revisa tu correo electrónico para confirmar el registro",
  );
}

export async function Logout() {
  const supabase = await createClient();

  //Borra la sesión en Supabase y limpia las cookies del navegador
  await supabase.auth.signOut();

  //Redirige al usuario a la home limpia
  redirect("/");
}
