interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export const Section = ({ children, className }: SectionProps) => {
  return (
    <section className={`flex flex-col max-w-[1500px] px-4 py-8 ${className}`}>
      {children}
    </section>
  );
};
