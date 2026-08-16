import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImportSimulator from "@/components/ImportSimulator";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import StockGrid from "@/components/StockGrid";
import MediaFeed from "@/components/MediaFeed";
import QuizForm from "@/components/QuizForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      {/* En desktop (lg:) el main se convierte en el contenedor del snap-scroll.
          En móvil es scroll libre normal. */}
      <main className="flex-grow bg-white lg:h-screen lg:overflow-y-scroll lg:snap-y lg:snap-mandatory lg:scroll-pt-20">
        <Hero />
        <ImportSimulator />
        <Pricing />
        <Process />
        <StockGrid />
        <MediaFeed />
        <QuizForm />
      </main>
      <Footer />
    </>
  );
}
