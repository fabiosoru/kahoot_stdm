'use client'

import Link from 'next/link'
import Image from 'next/image'
import { IconSet } from '@/components/Icon'

interface HeaderProps {
  showAdminButton?: boolean
  backLink?: string
  backLabel?: string
}

export default function Header({ showAdminButton = false, backLink, backLabel }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="container-base py-4 flex justify-between items-center">
        {backLink ? (
          // Back navigation
          <Link href={backLink} className="flex items-center gap-2 hover:text-brand-blue transition-colors">
            <IconSet.ChevronRight size={20} className="rotate-180" />
            <span className="font-semibold">{backLabel || 'Retour'}</span>
          </Link>
        ) : (
          // Logo navigation
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/champagne-logo.png"
              alt="Champagne Mobilités"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <div>
              <h1 className="text-sm font-bold text-brand-blue">Quiz - Journée Santé & Sécurité</h1>
            </div>
          </Link>
        )}

        {showAdminButton && (
          <Link href="/admin/login">
            <button className="btn btn-outline btn-sm">
              <IconSet.Settings size={16} />
              Admin
            </button>
          </Link>
        )}
      </div>
    </header>
  )
}
