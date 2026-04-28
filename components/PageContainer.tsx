interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-10">
      {children}
    </main>
  );
}
