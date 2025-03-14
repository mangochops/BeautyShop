import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        src="/hero-video.mp4" // Replace with your video file path or URL
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      {/* Overlay for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>

      {/* Content */}
      <div className="flex z-20 container mx-auto px-4 py-10 md:py-16 lg:py-24">
        <div className="flex flex-col items-center gap-8 md:gap-12 text-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight tracking-tight">
              Discover Your{" "}
              <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                Natural Beauty
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 md:mb-8 font-light max-w-xl mx-auto">
              Elevate your glow with premium, cruelty-free, and sustainable beauty products—crafted with love and nature in mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-md rounded-full px-6 py-2 md:px-8 md:py-3 w-full sm:w-auto font-semibold"
                >
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-2 border-pink-400 hover:bg-pink-400/20 hover:text-white transition-all duration-300 rounded-full px-6 py-2 md:px-8 md:py-3 w-full sm:w-auto font-semibold"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex z-20 container mx-auto px-4 mt-12 md:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-md text-center transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-pink-600 text-xl md:text-2xl">🌿</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2 tracking-wide">
              Natural Ingredients
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-light">
              Pure, nature-derived elements for radiant skin.
            </p>
          </div>
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-md text-center transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-pink-600 text-xl md:text-2xl">🐰</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2 tracking-wide">
              Cruelty-Free
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-light">
              Ethical beauty, never tested on animals.
            </p>
          </div>
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-md text-center transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-pink-600 text-xl md:text-2xl">♻️</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2 tracking-wide">
              Sustainable
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-light">
              Eco-conscious packaging and sourcing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}