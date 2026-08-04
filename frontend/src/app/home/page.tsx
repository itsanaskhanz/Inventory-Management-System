import { Footer } from "@/components/ui/Footer";
import { Logo } from "@/components/ui/Logo";
import { Typography } from "@/components/ui/Typography";
import appConfig from "@/config/app.config";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div className="w-full max-w-xs">
          <Logo size="lg" />
        </div>
        <Typography variant="h3" weight="bold">
          Welcome to {appConfig.appName}
        </Typography>
        <Typography variant="body1" color="secondary" className="max-w-md">
          {appConfig.appDescription}
        </Typography>
      </div>
      <Footer />
    </main>
  );
};

export default Page;
