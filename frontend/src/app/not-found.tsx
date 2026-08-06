import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-4">
          <Typography
            variant="h1"
            className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-7xl font-black text-transparent"
          >
            404
          </Typography>

          <div className="flex max-w-md flex-col gap-2">
            <Typography variant="h3" className="font-semibold">
              Page not found
            </Typography>
            <Typography variant="body1" color="secondary">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              may have been moved or no longer exists.
            </Typography>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/home">
              <Button size="lg" rounded="lg" aria-label="Go to home">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="secondary"
                rounded="lg"
                aria-label="Go back to login"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to login</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default NotFound;