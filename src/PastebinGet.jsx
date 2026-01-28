import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PastebinGet() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchPaste() {
      const pid = String(id || "").trim();
      if (!pid) {
        setError("Invalid paste id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setData(null);

      try {
        const res = await fetch(`/api/pastes/${pid}`);

        if (res.status === 404) {
          setError("Paste not available (404).");
          return;
        }
        if (!res.ok) {
          setError(`Failed to fetch (${res.status}).`);
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e?.message || "Network error.");
      } finally {
        setLoading(false);
      }
    }

    fetchPaste();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="mx-auto max-w-4xl">
        <section className="bg-slate-50">
          <div className="px-8 py-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              Pastebin-Lite
            </h1>

            <div className="my-8 h-px bg-slate-200" />

            <h2 className="text-2xl font-bold text-slate-800">View Paste</h2>

            <div className="my-6 h-px bg-slate-200" />

            {loading ? (
              <p className="text-sm text-slate-600">Loading...</p>
            ) : error ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-center text-xl font-bold text-slate-800">
                  Paste Not Available
                </h3>
                <p className="mt-3 text-center text-sm text-slate-600">
                  {error}
                </p>
                <p className="mt-4 text-center text-xs text-slate-600">
                  It may have expired or reached its view limit.
                </p>
              </div>
            ) : data ? (
              <>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                    {data.content}
                  </pre>
                </div>

                <p className="mt-4 text-sm text-slate-600">
                  Remaining views:{" "}
                  <span className="font-medium">
                    {data.remaining_views ?? "Unlimited"}
                  </span>
                  {" · "}
                  Expires at:{" "}
                  <span className="font-medium">
                    {data.expires_at ?? "Never"}
                  </span>
                </p>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
