import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImportSimulator from "@/components/ImportSimulator";
import StockGrid from "@/components/StockGrid";
import Services from "@/components/Services";
import Process from "@/components/Process";
import MediaFeed from "@/components/MediaFeed";
import QuizForm from "@/components/QuizForm";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        <Hero />
        <ImportSimulator />
        <Services />
        <Process />
        <Pricing />
        <StockGrid />
        <MediaFeed />
        <QuizForm />
      </main>
      <Footer />
    </>
  );
}
