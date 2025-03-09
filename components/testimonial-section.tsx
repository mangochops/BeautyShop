import { Star } from "lucide-react"

export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Skincare Enthusiast",
      content:
        "I've tried countless skincare products, but BeautyShop's serums have transformed my skin. The quality is unmatched!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      role: "Makeup Artist",
      content:
        "As a professional makeup artist, I need products that perform. BeautyShop's makeup line is now a staple in my kit.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=80&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Loyal Customer",
      content:
        "I love that BeautyShop products are cruelty-free and sustainable. The results are amazing and I feel good about my purchase.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=80&auto=format&fit=crop",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-background p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                    />
                  ))}
              </div>

              <p className="text-foreground">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

