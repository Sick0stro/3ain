import CarLicensePlateRecognition from "@/components/car-license-plate-recognition";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/ui/logo";

export default function Home() {
  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr,auto] items-center justify-center p-8 bg-gray-50 gap-8">
      {/* Top Logo */}
      <div className="self-center">
        <Logo src="/gcolaf.png" alt="App Logo" />
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>كود عين المركبة</CardTitle>
          <CardDescription>
            نسخة تجريبية للتعرف على هوية مالك المركبة باستخدام تقنية التعرف
            التلقائي على لوحات أرقام المركبات. إصدار : 19/10/2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CarLicensePlateRecognition />
        </CardContent>
        <CardFooter>
          <div className="fixed bottom-0 left-0 flex w-full justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black p-4">
            <a
              className="flex items-center justify-center gap-2"
              href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/logo.svg"
                alt="Mutawer Logo"
                className="dark:invert"
                width={100}
                height={24}
                priority
              />
              هندسة{" "}
            </a>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
