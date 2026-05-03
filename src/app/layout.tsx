import "./globals.css"
import Sidebar from "./components/Sidebar"
import { Search } from "lucide-react"

export const metadata = {
  title: "Sentry Sound",
  description: "Music management system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="grid grid-cols-[240px_1fr] min-h-screen">
          <Sidebar />

          <div>
            <header className="h-20 border-b border-slate-200 bg-white flex items-center px-8">
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  placeholder="Search songs, artists, files..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </header>

            <main className="p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
