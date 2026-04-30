import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pixel-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-mint rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mint-soft rounded-full mix-blend-screen filter blur-[120px] opacity-10" />

      <div className="z-10 flex flex-col items-center justify-center p-8 text-center bg-deep-teal border-8 border-black shadow-[0_0_0_4px_var(--mint),_12px_12px_0px_#000]">
        <h1 className="text-8xl font-bold text-mint drop-shadow-[4px_4px_0px_#000] mb-2 animate-glitch">
          404
        </h1>

        <div className="text-6xl mb-6">👾</div>

        <h2 className="text-2xl text-mint-soft tracking-widest font-bold mb-4 uppercase">
          page not found
        </h2>

        <p className="text-foreground max-w-md mb-8 font-pixelify">
          oops! looks like you've wandered out of bounds. the page you're looking for doesn't exist.
        </p>

        <Link href="/" className="pixel-button inline-block text-center">
          return to base
        </Link>
      </div>
    </div>
  );
}
