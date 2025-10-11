import React from 'react';
import { Container } from 'react-bootstrap';

function Section({ id, title, as = 'h2', variant = 'default', className = '', children }) {
  const Heading = as;
  const sectionClass =
    variant === 'dark'
      ? 'py-5 bg-dark text-white'
      : variant === 'muted'
      ? 'py-5 bg-light'
      : 'py-5';

  return (
    <section id={id} className={`${sectionClass} ${className}`}>
      <Container>
        {title && <Heading className="mb-3">{title}</Heading>}
        {children}
      </Container>
    </section>
  );
}

export default Section;   // 👈 Default export
