import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are not set");
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("English_Words_Realtime")
      .select("Word, Zipf-value")
      .order("Zipf-value", { ascending: false })
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const top = Array.isArray(data) && data.length > 0 ? data[0] : null;
    if (!top || !top.Word) {
      return NextResponse.json({ error: "No word found" }, { status: 404 });
    }

    return NextResponse.json({ word: top.Word });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


