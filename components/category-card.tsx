import Link from "next/link"
import type { Category } from "@/types/category"

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group relative rounded-lg overflow-hidden">
        <div className="aspect-square bg-muted">
          <img
            src={category.image || getCategoryImage(category.slug)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <h3 className="text-white text-xl font-bold">{category.name}</h3>
        </div>
      </div>
    </Link>
  )
}

// Helper function to get category images
function getCategoryImage(slug: string): string {
  const images = {
    skincare: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop",
    makeup: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=500&auto=format&fit=crop",
    haircare: "https://images.unsplash.com/photo-1626120032630-b51c96a544de?q=80&w=500&auto=format&fit=crop",
    fragrance: "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=500&auto=format&fit=crop",
    "bath-body": "https://images.unsplash.com/photo-1570213489059-0aac6626b344?q=80&w=500&auto=format&fit=crop",
    tools: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=500&auto=format&fit=crop",
  }

  return (
    images[slug as keyof typeof images] ||
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&auto=format&fit=crop"
  )
}

