import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  console.log({ admin })

  // Create categories
  const skincare = await prisma.category.upsert({
    where: { slug: "skincare" },
    update: {},
    create: {
      name: "Skincare",
      slug: "skincare",
      description: "Products for your skincare routine",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop",
    },
  })

  const makeup = await prisma.category.upsert({
    where: { slug: "makeup" },
    update: {},
    create: {
      name: "Makeup",
      slug: "makeup",
      description: "Makeup products for your beauty routine",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=500&auto=format&fit=crop",
    },
  })

  const haircare = await prisma.category.upsert({
    where: { slug: "haircare" },
    update: {},
    create: {
      name: "Haircare",
      slug: "haircare",
      description: "Products for your hair",
      image: "https://images.unsplash.com/photo-1626120032630-b51c96a544de?q=80&w=500&auto=format&fit=crop",
    },
  })

  // Create products
  const facialSerum = await prisma.product.upsert({
    where: { slug: "hydrating-facial-serum" },
    update: {},
    create: {
      name: "Hydrating Facial Serum",
      slug: "hydrating-facial-serum",
      description:
        "A lightweight, hydrating serum that delivers intense moisture to the skin. Formulated with hyaluronic acid and vitamin E.",
      price: 3999,
      originalPrice: 4999,
      categoryId: skincare.id,
      featured: true,
      inStock: true,
      stockQuantity: 50,
      sku: "SKN-SRM-001",
    },
  })

  // Add product image
  await prisma.productImage.create({
    data: {
      url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop",
      alt: "Hydrating Facial Serum",
      productId: facialSerum.id,
      isMain: true,
    },
  })

  const lipstick = await prisma.product.upsert({
    where: { slug: "matte-liquid-lipstick" },
    update: {},
    create: {
      name: "Matte Liquid Lipstick",
      slug: "matte-liquid-lipstick",
      description:
        "Long-lasting, highly pigmented liquid lipstick with a comfortable matte finish. Available in 12 stunning shades.",
      price: 2499,
      categoryId: makeup.id,
      featured: true,
      inStock: true,
      stockQuantity: 100,
      sku: "MKP-LPS-001",
    },
  })

  // Add product image
  await prisma.productImage.create({
    data: {
      url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop",
      alt: "Matte Liquid Lipstick",
      productId: lipstick.id,
      isMain: true,
    },
  })

  const hairMask = await prisma.product.upsert({
    where: { slug: "repairing-hair-mask" },
    update: {},
    create: {
      name: "Repairing Hair Mask",
      slug: "repairing-hair-mask",
      description:
        "Intensive treatment mask that repairs damaged hair, restores moisture, and adds shine. Ideal for dry, damaged, or color-treated hair.",
      price: 3499,
      originalPrice: 3999,
      categoryId: haircare.id,
      featured: true,
      inStock: true,
      stockQuantity: 75,
      sku: "HCR-MSK-001",
    },
  })

  // Add product image
  await prisma.productImage.create({
    data: {
      url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=500&auto=format&fit=crop",
      alt: "Repairing Hair Mask",
      productId: hairMask.id,
      isMain: true,
    },
  })

  // Create store settings
  await prisma.settings.upsert({
    where: { key: "store" },
    update: {},
    create: {
      key: "store",
      value: {
        name: "Beauty Shop",
        description: "Premium beauty products for skincare, makeup, haircare, and more.",
        currency: "KES",
        address: "123 Beauty Lane, Nairobi, Kenya",
        email: "contact@beautyshop.com",
        phone: "+254 712 345 678",
        social: {
          facebook: "https://facebook.com/beautyshop",
          instagram: "https://instagram.com/beautyshop",
          twitter: "https://twitter.com/beautyshop",
        },
        shipping: {
          freeShippingThreshold: 5000,
          standardShippingRate: 500,
        },
        tax: {
          rate: 16, // 16% VAT
        },
      },
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

