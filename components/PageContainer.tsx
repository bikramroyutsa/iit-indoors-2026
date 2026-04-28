interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {children}
    </div>
  );
}
