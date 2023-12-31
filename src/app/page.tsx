import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-xl font-medium">Mikhail Lutsenko</h1>
        <h5 className="text-base">Full-Stack Web Developer</h5>
        <Link
          href="https://github.com/caffellatte"
          className="underline underline-offset-2 hover:no-underline transition-all duration-200 ease-in-out"
        >
          github.com/caffellatte
        </Link>
      </div>
    </main>
  );
}
