export interface CheckResult {
  status: "up" | "down" | "degraded";
  latencyMs: number;
}

export async function pingUrl(url: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // таймаут 8 секунд

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "StatusPulse-Uptime-Monitor/1.0",
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - start;

    if (response.ok || response.status < 500) {
      return {
        status: latencyMs > 2000 ? "degraded" : "up",
        latencyMs,
      };
    } else {
      return {
        status: "down",
        latencyMs,
      };
    }
  } catch (error) {
    const latencyMs = Date.now() - start;
    return {
      status: "down",
      latencyMs,
    };
  }
}