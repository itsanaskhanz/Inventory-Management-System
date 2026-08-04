import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <Typography variant="h1">404</Typography>

        <div className="flex max-w-md flex-col gap-2">
          <Typography variant="h3" className="font-semibold">
            Page not found
          </Typography>
          <Typography variant="body1" color="secondary">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            may have been moved or no longer exists.
          </Typography>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/home">
            <Button size="lg" rounded="md" aria-label="Go to home">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="lg"
              variant="secondary"
              rounded="md"
              aria-label="Go back to login"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to login</span>
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default NotFound;
