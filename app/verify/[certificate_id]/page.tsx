"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BadgeCheck, ShieldCheck } from "lucide-react";

type PublicCertificate = {
  verification_id: string;
  work_title: string;
  contributors: { name: string; role: string }[];
  generated_at: string;
};

type VerifyResponse = {
  success: boolean;
  certificate?: PublicCertificate;
  error?: string;
};

export default function VerifyCertificatePage() {
  const params = useParams<{ certificate_id: string }>();
  const certificateId = Array.isArray(params.certificate_id) ? params.certificate_id[0] : params.certificate_id;

  const [certificate, setCertificate] = useState<PublicCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certificateId) return;

    fetch(`/api/verify/${certificateId}`)
      .then((response) => response.json())
      .then((data: VerifyResponse) => {
        if (data.success && data.certificate) {
          setCertificate(data.certificate);
        } else {
          setError(data.error ?? "Certificate not found.");
        }
      })
      .catch(() => setError("Could not load certificate."))
      .finally(() => setLoading(false));
  }, [certificateId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        {loading ? (
          <p className="text-center text-sm text-[#64748B]">Verifying certificate…</p>
        ) : error || !certificate ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-[#C2410C]">Certificate not found</p>
            <p className="mt-2 text-sm text-[#64748B]">{error}</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#EFF6FF] px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-[#2F48F7]" />
              <span className="text-sm font-semibold text-[#2F48F7]">Verified by Sentry Sound</span>
            </div>

            <h1 className="mt-6 text-center text-2xl font-bold text-[#0F172A]">{certificate.work_title}</h1>
            <p className="mt-1 text-center text-xs text-[#64748B]">
              Proof of collaboration · generated {new Date(certificate.generated_at).toLocaleString("en-ZA")}
            </p>

            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Contributors</p>
              {certificate.contributors.map((contributor, index) => (
                <div
                  key={`${contributor.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3"
                >
                  <span className="text-sm font-semibold text-[#111827]">{contributor.name}</span>
                  <span className="text-xs font-medium uppercase text-[#64748B]">{contributor.role}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
              <BadgeCheck className="h-4 w-4" />
              <span>Verification ID: {certificate.verification_id}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
