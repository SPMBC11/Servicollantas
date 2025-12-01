import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ children, className = "", ...props }) => {
  return (
    <section className={`py-16 px-4 ${className}`} {...props}>
      {children}
    </section>
  );
};

export default Section;
