import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { pingUrl } from "@/lib/checker";

export async function GET() {
  try {
    const { data: monitors, error } = await supabase.from("monitors").select("*");
    if (error) throw error;
    if (!monitors || monitors.length === 0) {
      return NextResponse.json({ message: "No monitors found" });
    }

    const updates = monitors.map(async (monitor) => {
      const result = await pingUrl(monitor.url);
      
      await supabase
        .from("monitors")
        .update({
          status: result.status,
          latency: result.latencyMs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", monitor.id);
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true, checked: monitors.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}