"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export function AddMonitorModal({ isOpen, onClose, onAdded }: ModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("monitors").insert([
        {
          name,
          url,
          status: "up",
          latency: 0,
        },
      ]);

      if (error) {
        console.error("Supabase insert error details:", error);
        alert(`Ошибка Supabase: ${error.message}`);
        return;
      }

      onAdded();
      onClose();
      setName("");
      setUrl("");
    } catch (err: any) {
      console.error("Catch error adding monitor:", err);
      alert(`Ошибка: ${err.message || "Не удалось добавить монитор"}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-lg font-semibold text-white">Add New Monitor</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400">Service Name</label>
            <input
              type="text"
              placeholder="My Production API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-800/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400">URL (Endpoint)</label>
            <input
              type="url"
              placeholder="https://api.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-800/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Monitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}