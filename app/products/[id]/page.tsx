import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductById, getRelatedProducts } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import ProductCard from "@/components/product-card"
import AddToCartButton from "@/components/add-to-cart-button"
import { formatCurrency } from "@/lib/format"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(product.category)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/products" className="text-pink-600 hover:underline">
          ← Back to products
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="bg-muted rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
            <img
              src={product.image || getProductImage(product.category)}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted rounded-lg overflow-hidden aspect-square">
                <img
                  src={product.image || getProductImage(product.category, i)}
                  alt={`${product.name} view ${i}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                  />
                ))}
            </div>
            <span className="ml-2 text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-2xl font-bold text-pink-600">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>
            )}
            {product.originalPrice && (
              <span className="ml-2 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded-full text-xs font-medium">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          <p className="text-foreground mb-6">{product.description}</p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center">
              <Button variant="outline" size="icon" className="h-10 w-10">
                -
              </Button>
              <span className="mx-4 w-8 text-center">1</span>
              <Button variant="outline" size="icon" className="h-10 w-10">
                +
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <AddToCartButton product={product} />
            <Button variant="outline" size="lg" className="flex items-center">
              <Heart className="mr-2 h-5 w-5" /> Wishlist
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Shipping & Returns */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Free Shipping</h4>
                <p className="text-sm text-muted-foreground">Free standard shipping on orders over KES 5,000</p>
              </div>
            </div>
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Secure Payment</h4>
                <p className="text-sm text-muted-foreground">Your payment information is processed securely</p>
              </div>
            </div>
            <div className="flex items-start">
              <RotateCcw className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">30-Day Returns</h4>
                <p className="text-sm text-muted-foreground">Simple returns up to 30 days after purchase</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="w-full justify-start border-b rounded-none">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="py-4">
          <div className="prose dark:prose-invert max-w-none">
            <p>{product.description}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
              nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt,
              nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
            </p>
            <ul>
              <li>Dermatologically tested</li>
              <li>Suitable for all skin types</li>
              <li>Cruelty-free and vegan</li>
              <li>Free from parabens, sulfates, and phthalates</li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="ingredients" className="py-4">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Aqua, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Helianthus Annuus Seed Oil, Butyrospermum
              Parkii Butter, Squalane, Ceteareth-20, Glyceryl Stearate, Phenoxyethanol, Tocopherol, Parfum, Xanthan Gum,
              Sodium Hydroxide, Citric Acid.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              * Ingredients may vary slightly between product variants. Always refer to the packaging for the most
              accurate information.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="how-to-use" className="py-4">
          <div className="prose dark:prose-invert max-w-none">
            <p>For best results, follow these steps:</p>
            <ol>
              <li>Cleanse your face with a gentle cleanser</li>
              <li>Apply a small amount of product to your fingertips</li>
              <li>Gently massage into your skin using upward circular motions</li>
              <li>Allow to absorb fully before applying other products</li>
              <li>Use morning and evening as part of your skincare routine</li>
            </ol>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="py-4">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-border pb-6 last:border-0">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <Star
                          key={j}
                          className={`h-4 w-4 ${j < 4 + (i % 2) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                        />
                      ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">Verified Purchase</span>
                </div>
                <h4 className="font-medium">Great product, highly recommend!</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
                  nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                <div className="mt-2 text-sm text-muted-foreground">
                  <span>Jane D. - </span>
                  <span>3 months ago</span>
                </div>
              </div>
            ))}

            <Button variant="outline">Load More Reviews</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

// Helper function to get product images based on category
function getProductImage(category: string, variant = 0): string {
  const images = {
    skincare: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228852-6d35a585d566?q=80&w=500&auto=format&fit=crop",
    ],
    makeup: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599733458262-62eb6c2b1eaa?q=80&w=500&auto=format&fit=crop",
    ],
    haircare: [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626120032630-b51c96a544de?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500&auto=format&fit=crop",
    ],
    fragrance: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592945403407-9caf930b0c4b?q=80&w=500&auto=format&fit=crop",
    ],
    "bath-body": [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570213489059-0aac6626b344?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583106617534-c3a2a5fb5f95?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584949514490-73fc1a2faa97?q=80&w=500&auto=format&fit=crop",
    ],
    tools: [
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?q=80&w=500&auto=format&fit=crop",
    ],
  }

  const categoryImages = images[category as keyof typeof images] || [
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&auto=format&fit=crop",
  ]

  return categoryImages[variant % categoryImages.length]
}

