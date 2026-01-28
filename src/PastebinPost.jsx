import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PastebinPost() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [created, setCreated] = useState(null);

  const canCreate = useMemo(
    () => content.trim().length > 0 && !creating,
    [content, creating]
  );

  function parseOptionalInt(v) {
    const s = String(v ?? "").trim();
    if (s === "") return undefined;
    const n = Number(s);
    if (!Number.isInteger(n) || n < 1) return NaN;
    return n;
  }

  async function onCreate() {
    setCreateError("");
    setCreated(null);

    const ttlSeconds = parseOptionalInt(ttl);
    if (Number.isNaN(ttlSeconds)) {
      setCreateError("TTL must be an integer ≥ 1 (or leave blank).");
      return;
    }

    const mv = parseOptionalInt(maxViews);
    if (Number.isNaN(mv)) {
      setCreateError("Max views must be an integer ≥ 1 (or leave blank).");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttlSeconds,
          max_views: mv,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setCreateError(
          data?.error || data?.message || `Request failed (${res.status}).`
        );
        return;
      }

      setCreated(data);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (e) {
      setCreateError(e?.message || "Network error.");
    } finally {
      setCreating(false);
    }
  }

  async function copy(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }

  const shareUrl = created?.id
    ? `${window.location.origin}/#/paste/${created.id}`
    : "";

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="mx-auto max-w-3xl">
        <section className="bg-slate-50 border border-slate-300">
          <div className="px-8 py-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              Pastebin
            </h1>
            <div className="bg-red-500 text-white p-6 text-2xl">
              Tailwind Test
            </div>

            <p className="mt-2 text-sm text-slate-600">
              Create a paste with optional expiry or view limits.
            </p>

            <div className="my-8 h-px bg-slate-200" />

            <h2 className="text-2xl font-bold text-slate-800">
              Create a New Paste
            </h2>

            <textarea
              className="mt-2 h-44 w-full resize-none rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="min-w-[130px] font-medium">
                  Expiry Time (TTL):
                </div>
                <input
                  className="h-9 w-24 rounded-md border border-slate-300 bg-white px-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  inputMode="numeric"
                  placeholder="optional"
                />
                <span className="text-slate-600">seconds</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="min-w-[130px] font-medium">Max Views:</div>
                <input
                  className="h-9 w-24 rounded-md border border-slate-300 bg-white px-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  inputMode="numeric"
                  placeholder="optional"
                />
                <span className="text-slate-600">views</span>
              </div>
            </div>

            <button
              className="mt-6 inline-flex h-10 w-40 items-center justify-center rounded-md bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              onClick={onCreate}
              disabled={!canCreate}
              type="button"
            >
              {creating ? "Creating..." : "Create"}
            </button>

            <div className="my-6 h-px bg-slate-200" />

            {createError ? (
              <p className="text-sm font-medium text-red-600">{createError}</p>
            ) : null}

            {created?.id ? (
              <>
                <div className="my-6 h-px bg-slate-200" />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">
                    Paste created! Share this link:
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      className="h-10 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm"
                      readOnly
                      value={shareUrl}
                    />
                    <button
                      className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                      onClick={() => copy(shareUrl)}
                      type="button"
                    >
                      Copy
                    </button>
                    <button
                      className="flex h-10 items-center rounded-md bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                      type="button"
                      onClick={() => navigate(`/paste/${created.id}`)}
                    >
                      Open
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
