export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-[#5B5BFF]/20 bg-[#5B5BFF]/10 px-4 py-2 text-sm font-semibold text-[#4444E6]">
          Sentry Sound Platform
        </div>

        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Music rights and royalty operations, built properly.
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600">
          A public landing page for Sentry Sound Platform. This route is isolated from the TEST Control Panel and does not touch backend, API, auth, schema, or dashboard systems.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a className="rounded-2xl bg-gradient-to-r from-[#5B5BFF] to-[#4444E6] px-7 py-4 font-bold text-white shadow-lg shadow-indigo-500/20" href="#">
            Get Started
          </a>

          <a className="rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 shadow-sm" href="#">
            View Plans
          </a>
        </div>
      </section>
    </main>
  );
}
