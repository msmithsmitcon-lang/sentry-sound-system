"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const roles = [
  "composer",
  "lyricist",
  "author",
  "publisher",
  "producer",
  "artist",
  "featured_artist",
  "session_musician",
  "vocalist",
  "arranger",
  "engineer",
  "mastering_engineer",
  "record_label",
  "master_owner",
]

const splitTypes = [
  "composition",
  "lyrics",
  "publishing",
  "master",
  "neighbouring_rights",
]

export default function CreateSongPage() {
  const [form, setForm] = useState({
    work_title: "",
    genre: "",
    mood: "",
    copyright_status: "draft",
    registration_status: "draft",
  })

  const [contributors, setContributors] = useState([
    {
      contributor_id: "",
      name: "",
      role: "composer",
      split_type: "composition",
      percentage: "",
    },
  ])

  const [status, setStatus] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  const totalSplit = contributors.reduce(
    (sum, c) => sum + Number(c.percentage || 0),
    0
  )

  const isSplitValid = totalSplit === 100

  

  const searchContributors = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    const res = await fetch("/api/contributors/search?q=" + encodeURIComponent(query))
    const data = await res.json()
    setSearchResults(data || [])
  }

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateContributor = (index: number, field: string, value: string) => {
  if (field === "name") {
    const existing = searchResults.find(
      (c) => c.full_name?.toLowerCase() === value.toLowerCase()
    )

    if (existing) {
      const alreadyUsed = contributors.some(
        (c, i) => i !== index && c.contributor_id === existing.id
      )

      if (alreadyUsed) {
        setStatus("Contributor already added")
        return
      }
    }
  }
    const updated = [...contributors]
    updated[index] = { ...updated[index], [field]: value }
    setContributors(updated)
  }

  const addContributor = () => {
    setContributors([
      ...contributors,
      {
        contributor_id: "",
        name: "",
        role: "composer",
        split_type: "composition",
        percentage: "",
      },
    ])
  }

  const removeContributor = (index: number) => {
    setContributors(contributors.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const selectedIds = contributors
      .map((c) => c.contributor_id)
      .filter(Boolean)

    if (new Set(selectedIds).size !== selectedIds.length) {
      setStatus("Duplicate contributor selected. Use each contributor only once.")
      return
    }
    if (!isSplitValid) {
      setStatus("Split total must equal 100%")
      return
    }

    setStatus("Saving song and contributors...")

    const cleanContributors = contributors.filter((c) => c.name.trim() !== "")

    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .insert([{ title: form.work_title, asset_type: "music" }])
      .select()
      .single()

    if (assetError || !asset) {
      console.log(assetError)
      setStatus("Error creating asset")
      return
    }

    const { data: work, error: workError } = await supabase
      .from("musical_works")
      .insert([
        {
          asset_id: asset.id,
          work_title: form.work_title,
          genre: form.genre,
          mood: form.mood,
          copyright_status: form.copyright_status,
          registration_status: form.registration_status,
        },
      ])
      .select()
      .single()

    if (workError || !work) {
      console.log(workError)
      setStatus("Error creating song")
      return
    }

    for (const c of cleanContributors) {
      let contributorId = c.contributor_id

      if (!contributorId) {
        const { data: existingContributor } = await supabase
          .from("contributors")
          .select("id")
          .ilike("full_name", c.name.trim())
          .maybeSingle()

        if (existingContributor?.id) {
          contributorId = existingContributor.id
        } else {
        const { data: contributor, error: contributorError } = await supabase
          .from("contributors")
          .insert([
            {
              full_name: c.name,
              stage_name: c.name,
              role: c.role,
              contributor_type: "person",
            },
          ])
          .select()
          .single()

        if (contributorError || !contributor) {
          console.log(contributorError)
          setStatus("Song saved, but contributor save failed")
          return
        }

        contributorId = contributor.id
        }
      }

      const { error: linkError } = await supabase
        .from("work_contributors")
        .insert([
          {
            work_id: work.id,
            contributor_id: contributorId,
            role: c.role,
            split_type: c.split_type,
            percentage: Number(c.percentage || 0),
            confirmed: false,
          },
        ])

      if (linkError) {
        console.log(linkError)
        setStatus("Song saved, but contributor link failed")
        return
      }
    }

    setStatus("Saved successfully")

    setForm({
      work_title: "",
      genre: "",
      mood: "",
      copyright_status: "draft",
      registration_status: "draft",
    })

    setContributors([
      {
        contributor_id: "",
        name: "",
        role: "composer",
        split_type: "composition",
        percentage: "",
      },
    ])
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Song</h1>

      <div className="grid grid-cols-2 gap-6">
        <section className="card">
          <h2 className="text-xl font-bold mb-4">Song Details</h2>

          <div className="space-y-4">
            <input className="input w-full text-sm" placeholder="Song title" value={form.work_title} onChange={(e) => updateForm("work_title", e.target.value)} />
            <input className="input w-full text-sm" placeholder="Genre" value={form.genre} onChange={(e) => updateForm("genre", e.target.value)} />
            <input className="input w-full text-sm" placeholder="Mood" value={form.mood} onChange={(e) => updateForm("mood", e.target.value)} />
          </div>
        </section>

        <section className="card">
          <h2 className="text-xl font-bold mb-4">Compliance Status</h2>

          <div className="space-y-4">
            <select className="input w-full text-sm" value={form.copyright_status} onChange={(e) => updateForm("copyright_status", e.target.value)}>
              <option value="draft">Copyright draft</option>
              <option value="evidence_created">Evidence created</option>
              <option value="copyright_pack_prepared">Pack prepared</option>
              <option value="submitted">Submitted</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="disputed">Disputed</option>
            </select>

            <select className="input w-full text-sm" value={form.registration_status} onChange={(e) => updateForm("registration_status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="not_started">Not started</option>
              <option value="in_progress">In progress</option>
              <option value="submitted">Submitted</option>
              <option value="registered">Registered</option>
            </select>
          </div>
        </section>
      </div>

      <section className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Contributors & Splits</h2>

          <button onClick={addContributor} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
            + Add Contributor
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_120px_90px] gap-3 text-xs font-semibold text-slate-500 px-1">
            <div>Name</div>
            <div>Role</div>
            <div>Split Type</div>
            <div>%</div>
            <div></div>
          </div>

          {contributors.map((c, index) => (
            <div key={index} className="grid grid-cols-[1.5fr_1fr_1fr_120px_90px] gap-3 bg-white border border-slate-200 rounded-xl p-3 items-center">
              <input className="input w-full text-sm" placeholder="Contributor name" value={c.name} onChange={(e) => updateContributor(index, "name", e.target.value)} />

              <select className="input w-full text-sm" value={c.role} onChange={(e) => updateContributor(index, "role", e.target.value)}>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select className="input w-full text-sm" value={c.split_type} onChange={(e) => updateContributor(index, "split_type", e.target.value)}>
                {splitTypes.map((split) => (
                  <option key={split} value={split}>{split}</option>
                ))}
              </select>

              <input className="input w-full text-sm" type="number" placeholder="%" value={c.percentage} onChange={(e) => updateContributor(index, "percentage", e.target.value)} />

              <button onClick={() => removeContributor(index)} className="text-red-500 text-sm hover:underline">
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
      >
        Save Song
      </button>

      <div className="mt-4">
        <p className="text-sm">
          Total Split:{" "}
          <span
            className={
              isSplitValid
                ? "text-green-600 font-bold"
                : "text-red-600 font-bold"
            }
          >
            {totalSplit}%
          </span>
        </p>

        {!isSplitValid && (
          <p className="text-sm text-red-600 mt-1">
            Split must equal exactly 100%
          </p>
        )}

        <p className="text-slate-500">{status}</p>
      </div>
    </div>
  )
}






















