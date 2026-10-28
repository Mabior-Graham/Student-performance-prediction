import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      <main className="flex min-h-screen flex-col items-center justify-center px-8 py-20 sm:px-20">
        <div className="flex flex-col gap-8 max-w-2xl">
          {/* Logo and Title */}
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
              className="invert dark:invert-0"
            />
            <h1 className="text-4xl sm:text-5xl font-bold text-center">
              Welcome to Your App
            </h1>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-4">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center">
              This app now supports light and dark modes with Tailwind CSS. Your theme preference is saved automatically.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Image
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
              />
              Documentation
            </a>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Deploy Now
            </a>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3">Theme Features</h2>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>✓ Dark mode toggle in the top-right corner</li>
              <li>✓ Theme preference persisted in local storage</li>
              <li>✓ Smooth transitions between themes</li>
              <li>✓ System preference detection (default)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
