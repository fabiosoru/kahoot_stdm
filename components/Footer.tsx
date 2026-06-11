interface FooterProps {
  compact?: boolean
}

export default function Footer({ compact = false }: FooterProps) {
  if (compact) {
    return (
      <footer className="border-t border-gray-200 py-4">
        <div className="container-base text-center text-xs text-gray-600">
          <p>© 2026 Champagne Mobilités • Tous droits réservés</p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-gray-200 py-8 mt-16">
      <div className="container-base text-center text-sm text-gray-600">
        <p>Journée Santé & Sécurité • 2026 • Champagne Mobilités</p>
      </div>
    </footer>
  )
}
