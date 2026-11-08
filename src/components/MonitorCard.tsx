"use client";

import { motion } from "framer-motion";
import { Activity, ArrowUpRight } from "lucide-react";

interface MonitorProps {
  name: string;
  url: string;
  status: "up" | "down" | "degraded";
  latency: number;
  uptime90Days: number[];
}

export function MonitorCard({ name, url, status, latency, uptime90Days }: MonitorProps) {
  const isUp = status === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl border border-white/10 bg-neutral-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            {isUp && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex h-3 w-3 rounded-full ${
                isUp ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {name}
            </h3>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200"
            >
              {url} <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-neutral-800/60 px-3 py-1.5 border border-white/5">
          <Activity className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-xs font-mono font-medium text-neutral-200">
            {latency} ms
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-neutral-400">
          <span>90 days ago</span>
          <span className="font-mono text-emerald-400">99.98% uptime</span>
          <span>Today</span>
        </div>
        <div className="flex h-6 items-center gap-[3px]">
          {uptime90Days.map((val, idx) => (
            <div
              key={idx}
              title={`Day ${idx + 1}: ${val === 1 ? "Operational" : "Downtime"}`}
              className={`h-full flex-1 rounded-[2px] transition-all hover:scale-110 ${
                val === 1
                  ? "bg-emerald-500/80 hover:bg-emerald-400"
                  : "bg-rose-500 hover:bg-rose-400"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}