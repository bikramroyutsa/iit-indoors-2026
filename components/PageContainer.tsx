interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      {children}
    </main>
  );
}
