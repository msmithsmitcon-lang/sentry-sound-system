"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ListSongsPage() {
  const [songs, setSongs] = useState<any[]>([])

  useEffect(() => {
    const loadSongs = async () => {
      const { data, error } = await supabase
        .from("musical_works")
        .select("*")
        .order("created_at", { ascending: false })

      console.log("DATA:", data)
      console.log("ERROR:", error)

      if (data) setSongs(data)
    }

    loadSongs()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>All Songs</h1>

      {songs.map((song) => (
        <div key={song.id}>
          {song.work_title}
        </div>
      ))}
    </div>
  )
}
