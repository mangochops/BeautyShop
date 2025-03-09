import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CategoryForm from "@/components/admin/category-form"
import { getCategoryById } from "@/lib/admin"
import { updateCategory } from "@/lib/admin"

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const category = await getCategoryById(params.id)

  if (!category) {
    notFound()
  }

  async function handleUpdateCategory(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const slug = formData.get("slug") as string

    // Update the category
    await updateCategory(params.id, {
      name,
      slug,
      image: category.image,
    })

    redirect("/admin/categories")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <Link href="/admin/categories">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <CategoryForm category={category} action={handleUpdateCategory} />
    </div>
  )
}

