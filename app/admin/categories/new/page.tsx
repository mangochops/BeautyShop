import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CategoryForm from "@/components/admin/category-form"
import { createCategory } from "@/lib/admin"

export default async function NewCategoryPage() {
  async function handleCreateCategory(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const slug = formData.get("slug") as string

    // Create the category
    await createCategory({
      name,
      slug,
      image: "/placeholder.svg?height=300&width=300&text=" + name,
    })

    redirect("/admin/categories")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Category</h1>
        <Link href="/admin/categories">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <CategoryForm action={handleCreateCategory} />
    </div>
  )
}

