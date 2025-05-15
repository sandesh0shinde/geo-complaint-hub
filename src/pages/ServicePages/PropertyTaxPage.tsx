
import React from "react";
import Layout from "@/components/Layout";
import PropertyTaxForm from "@/components/ServiceForms/PropertyTaxForm";

export default function PropertyTaxPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <PropertyTaxForm />
      </div>
    </Layout>
  );
}
