import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublishForm from "@/components/marketplace/PublishForm";

export default function PublicarVehiculoPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 min-h-screen py-6">
        <PublishForm />
      </main>
      <Footer />
    </>
  );
}
