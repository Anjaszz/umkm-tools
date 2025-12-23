import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://umkm-tools-ai.vercel.app'
  
  // List of all features
  const features = [
    'background-editor',
    'cs-templates',
    'image-analyzer',
    'photo-enhancer',
    'product-description',
    'social-caption',
  ]

  const featureUrls = features.map((feature) => ({
    url: `${baseUrl}/features/${feature}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...featureUrls,
  ]
}
