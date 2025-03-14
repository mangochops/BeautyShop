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
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-10 md:py-16 lg:py-24">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight">
              Discover Your{" "}
              <span className="text-pink-400 drop-shadow-md">Natural Beauty</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8">
              Premium beauty products crafted to enhance your natural glow—cruelty-free, sustainable, and made with love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-pink-500 text-white hover:bg-pink-600 transition-all duration-300 shadow-lg rounded-full px-6 py-2 w-full sm:w-auto"
                >
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-pink-600 transition-all duration-300 rounded-full px-6 py-2 w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-20 container mx-auto px-4 mt-12 md:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-lg text-center transition-all hover:shadow-xl">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-pink-600 text-xl md:text-2xl">🌿</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2">
              Natural Ingredients
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Made with the finest natural ingredients for your skin.
            </p>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-lg text-center transition-all hover:shadow-xl">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-pink-600 text-xl md:text-2xl">🐰</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2">
              Cruelty-Free
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Ethical beauty with no animal testing.
            </p>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-lg text-center transition-all hover:shadow-xl">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-pink-600 text-xl md:text-2xl">♻️</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2">
              Sustainable
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Eco-friendly packaging and sourcing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}