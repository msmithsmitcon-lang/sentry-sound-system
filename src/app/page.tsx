"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function HomePage() {
  const [totalSongs, setTotalSongs] = useState(0)
  const [recentSongs, setRecentSongs] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data, count } = await supabase
        .from("musical_works")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5)

      if (data) {
        setRecentSongs(data)
        setTotalSongs(count || data.length)
      }
    }

    load()
  }, [])

  return (
    <main>
      <header className="flex justify-between items-center mb-8">
        <div>
          <p className="text-slate-500">Welcome back,</p>
          <h1 className="text-3xl font-bold text-slate-900">Sentry Sound 👋</h1>
        </div>

        <Link href="/create-song" className="bg-blue-600 px-5 py-3 rounded-xl font-bold">
          + New Song
        </Link>
      </header>

      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500">Total Songs</p>
          <h2 className="text-4xl font-bold text-slate-900">{totalSongs}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500">Total Streams</p>
          <h2 className="text-4xl font-bold text-slate-900">0</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500">Total Royalties</p>
          <h2 className="text-4xl font-bold text-slate-900">R0</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500">Active Projects</p>
          <h2 className="text-4xl font-bold text-slate-900">0</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Quick Actions</h2>

        <div className="grid grid-cols-4 gap-4">
          <Link href="/create-song" className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm text-slate-900">
            Add New Song
          </Link>

          <Link href="/list-songs" className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm text-slate-900">
            View Songs
          </Link>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm text-slate-500">
            Upload Files
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm text-slate-500">
            New Project
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Recent Songs</h2>

          {recentSongs.map((song) => (
            <div key={song.id} className="py-3 border-b border-slate-200">
              <strong className="text-slate-900">{song.work_title}</strong>
              <div className="text-sm text-slate-500">
                {song.registration_status || "Draft"}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-slate-900">File Vault</h2>
          <p className="text-slate-500">Coming next.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">Recent Activity</h2>
          <p className="text-slate-500">Coming later.</p>
        </div>
      </div>
    </main>
  )
}
