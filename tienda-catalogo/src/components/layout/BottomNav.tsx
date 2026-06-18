'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid2X2, Search, Settings } from 'lucide-react'

const tabs = [
  { href: '/',       icon: Home,      label: 'Inicio'   },
  { href: '/buscar', icon: Search,    label: 'Buscar'   },
  { href: '/catalogo',icon: Grid2X2,  label: 'Catálogo' },
  { href: '/admin',  icon: Settings,  label: 'Admin'    },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-100 safe-area-pb">
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                active ? 'text-stone-900' : 'text-stone-400'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${active ? 'text-stone-900' : 'text-stone-400'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
