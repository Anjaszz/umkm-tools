import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UMKM Tools AI',
    short_name: 'UMKM Tools',
    description: 'Solusi cerdas berbasis AI untuk membantu digitalisasi UMKM Indonesia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#E8ECEF',
    theme_color: '#2ECC71',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
