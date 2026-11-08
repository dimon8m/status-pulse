"use client";

import { useEffect, useState, useCallback } from "react";
import { MonitorCard } from "@/components/MonitorCard";
import { AddMonitorModal } from "@/components/AddMonitorModal";
import { Plus, ShieldCheck, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Monitor {
  id: string;
  name: string;
  url: string;
  status: "up" | "down" | "degraded";
  latency: number;
}

export default function Home() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const fetchMonitors = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("monitors").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setMonitors(data);
    } catch (err) {
      console.error("Error fetching monitors:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const runChecks = async () => {
    setChecking(true);
    try {
      await fetch("/api/check");
      await fetchMonitors();
    } catch (err) {
      console.error("Check error:", err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
    runChecks();
  }, [fetchMonitors]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-100 p-8 md:p-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">StatusPulse</h1>
              <p className="text-sm text-neutral-400">System reliability & uptime command center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runChecks}
              disabled={checking}
              className="flex items-center gap-2 rounded-xl bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all disabled:opacity-50 border border-white/5"
            >
              <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
            >
              <Plus className="h-4 w-4" />
              Add Monitor
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : monitors.length === 0 ? (
          <div className="mt-20 text-center text-neutral-500">
            <p>No monitors found. Add your first service to track!</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {monitors.map((monitor) => (
              <MonitorCard
                key={monitor.id}
                name={monitor.name}
                url={monitor.url}
                status={monitor.status}
                latency={monitor.latency}
                uptime90Days={Array(90).fill(1)}
              />
            ))}
          </div>
        )}
      </div>

      <AddMonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={fetchMonitors}
      />
    </main>
  );
}