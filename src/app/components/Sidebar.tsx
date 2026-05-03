"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Music,
  PlusCircle,
  Users,
  Disc3,
  FolderKanban,
  Folder,
  CircleDollarSign,
  Settings,
} from "lucide-react"

export default function Sidebar() {
  const items = [
    ["Dashboard", "/", LayoutDashboard],
    ["Songs", "/list-songs", Music],
    ["Add Song", "/create-song", PlusCircle],
    ["Artists", "#", Users],
    ["Albums / EPs", "#", Disc3],
    ["Projects", "#", FolderKanban],
    ["File Vault", "#", Folder],
    ["Royalties", "#", CircleDollarSign],
    ["Settings", "#", Settings],
  ]

  return (
    <aside className="min-h-screen bg-white border-r border-slate-200 p-6">
      <img src="/logo.png" alt="Sentry Sound" className="w-40 mb-10" />

      {items.map(([label, href, Icon]: any) => (
        <Link
          key={label}
          href={href}
          className="flex items-center gap-3 p-3 rounded-xl mb-2 text-slate-700 hover:bg-blue-600 hover:text-white"
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </aside>
  )
}
