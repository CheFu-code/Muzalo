import Link from "next/link";
import { AlertCircle } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 sm:px-6">
      <div className="text-center">
        <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 sm:mb-6 sm:h-20 sm:w-20">
          <AlertCircle className="h-8 w-8 text-red-500 sm:h-10 sm:w-10" />
        </div>
        <h1 className="mb-3 text-3xl font-semibold text-white sm:text-4xl">404 - Not Found</h1>
        <p className="mb-6 text-sm text-gray-400 sm:mb-8 sm:text-base">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm text-white transition-colors hover:bg-purple-700 sm:px-6 sm:py-3"
        >
          Back to Library
        </Link>
      </div>
    </div>
  );
}
