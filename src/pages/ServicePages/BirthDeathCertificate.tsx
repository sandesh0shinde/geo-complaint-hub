
import React from "react";
import Layout from "@/components/Layout";
import BirthDeathForm from "@/components/ServiceForms/BirthDeathForm";

export default function BirthDeathCertificate() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <BirthDeathForm />
      </div>
    </Layout>
  );
}
