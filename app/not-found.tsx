import Link from 'next/link'
import { IconSet } from '@/components/Icon'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-black text-brand-blue mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous cherchez n'existe pas ou a été supprimée.
        </p>

        <Link href="/">
          <button className="btn btn-primary">
            <IconSet.Home size={16} />
            Retour à l'accueil
          </button>
        </Link>
      </div>
    </div>
  )
}
