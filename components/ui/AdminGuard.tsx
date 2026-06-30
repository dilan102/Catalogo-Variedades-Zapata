'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    const verifySession = async () => {
      try {
        const response = await fetch('/api/me')
        const data = await response.json()

        if (active && !data.authenticated) {
          router.replace('/admin/login')
        }
      } catch {
        if (active) {
          router.replace('/admin/login')
        }
      } finally {
        if (active) {
          setChecking(false)
        }
      }
    }

    void verifySession()

    return () => {
      active = false
    }
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFCF9] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#DCEFDD] bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded-full bg-[#EAF8EC] animate-pulse" />
            <div className="h-3 w-full rounded-full bg-[#EAF8EC] animate-pulse" />
            <div className="h-3 w-3/4 rounded-full bg-[#EAF8EC] animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
