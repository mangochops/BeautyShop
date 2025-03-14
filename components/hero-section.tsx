import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden">
      {/* Video Background */}
      <video
        src="/hero-video.mp4" // Replace with your video file path or URL
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      {/* Overlay with Increased Opacity */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/20 z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 py-10 md:py-16 lg:py-24">
        <div className="flex flex-col items-center gap-8 md:gap-12 text-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight tracking-tight animate-fade-in-down">
              Unleash Your{" "}
              <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">
                Inner Glow
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 md:mb-8 font-light max-w-xl mx-auto animate-fade-in-up delay-200">
              Hey beautiful, join us on a journey to radiant skin and soulful confidence. Our cruelty-free, nature-kissed treasures are made just for you—with love, care, and a sprinkle of magic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-md rounded-full px-6 py-2 md:px-8 md:py-3 w-full sm:w-auto font-semibold  dark:from-pink-600 dark:to-rose-700 dark:hover:from-pink-700 dark:hover:to-rose-800"
                >
                  Explore Your Favorites
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black border-2 border-rose-400 hover:bg-rose-400/20 hover:text-white transition-all duration-300 rounded-full px-6 py-2 md:px-8 md:py-3 w-full sm:w-auto font-semibold animate-fade-in delay-400 dark:border-rose-500 dark:hover:bg-rose-500/20"
                >
                  Meet Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Over Video */}
      <div className="relative z-20 container mx-auto px-4 pb-12 md:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-xl text-center transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up delay-600">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-100 dark:bg-rose-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-rose-600 text-xl md:text-2xl">🌸</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2 tracking-wide">
              Botanical Bliss
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-light">
              Pamper your skin with the gentlest touch of nature’s finest.
            </p>
          </div>
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-xl text-center transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up delay-800">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-100 dark:bg-rose-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-rose-600 text-xl md:text-2xl">💖</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2 tracking-wide">
              Kindness First
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-light">
              Feel good knowing no creatures were harmed for your beauty.
            </p>
          </div>
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-xl text-center transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up delay-1000">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-100 dark:bg-rose-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-rose-600 text-xl md:text-2xl">🌍</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2 tracking-wide">
              Earth-Loving
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-light">
              Glow sustainably with eco-friendly vibes from us to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}