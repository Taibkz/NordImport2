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
      <main className="flex-grow bg-white">
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
