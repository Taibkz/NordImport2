"use client";

import React, { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublishForm from "@/components/marketplace/PublishForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditarVehiculoPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 min-h-screen pt-[72px] lg:pt-[80px] pb-6">
        <PublishForm carId={id} />
      </main>
      <Footer />
    </>
  );
}
