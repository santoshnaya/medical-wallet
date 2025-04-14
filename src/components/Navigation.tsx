import Link from 'next/link'
import { MapPin, Image } from 'lucide-react'

const Navigation = () => {
  return (
    <div className="flex items-center gap-4">
      <Link href="/nearby" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
        <MapPin className="h-5 w-5" />
        <span>Nearby</span>
      </Link>
      <Link href="/skin-disease" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
        <Image className="h-5 w-5" />
        <span>Skin Disease</span>
      </Link>
    </div>
  )
}

export default Navigation 