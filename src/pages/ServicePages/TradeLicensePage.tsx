
import React from "react";
import Layout from "@/components/Layout";
import TradeLicenseForm from "@/components/ServiceForms/TradeLicenseForm";

export default function TradeLicensePage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <TradeLicenseForm />
      </div>
    </Layout>
  );
}
