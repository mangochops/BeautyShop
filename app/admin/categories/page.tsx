import Link from "next/link"
import { Plus, Edit, Trash, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCategories } from "@/lib/products"
import DeleteCategoryButton from "@/components/admin/delete-category-button"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="relative pb-0">
              <div className="absolute right-4 top-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <DeleteCategoryButton id={category.id}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DeleteCategoryButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>Slug: {category.slug}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={category.image || "/placeholder.svg?height=300&width=400"}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

