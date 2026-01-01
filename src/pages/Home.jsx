import React from "react";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Projects } from "../components/Projects";
import { Testimonials } from "../components/Testimonials";
import { QuoteForm } from "../components/QuoteForm";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { InmobiliariaPreview } from "../components/InmobiliariaPreview";


export default function Home() {
  return (
    <>
      <Hero />

      {/* Sección ABOUT */}
      <div id="about">
        <About />
      </div>

      {/* Sección SERVICES */}
      <div id="services">
        <Services />
      </div>

      {/* Sección PROYECTOS */}
      <div id="projects">
        <Projects />
      </div>

      {/* Sección INMOBILIARIA (condicional) */}
      <div id="inmobiliaria">
        <InmobiliariaPreview />
      </div>

      {/* Sección TESTIMONIOS */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* Sección QUOTE FORM */}
      <div id="quote-form">
        <QuoteForm />
      </div>

      <WhatsAppButton />
    </>
  );
}

