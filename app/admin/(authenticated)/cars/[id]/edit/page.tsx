import React from "react";
import { notFound } from "next/navigation";
import { LocalDB } from "@/lib/db/local-db";
import { VehicleForm } from "@/components/admin/VehicleForm";

interface EditCarPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0; // Dynamic server query

export default function EditCarPage({ params }: EditCarPageProps) {
  const vehicle = LocalDB.getVehicleById(params.id);

  if (!vehicle) {
    notFound();
  }

  return <VehicleForm initialVehicle={vehicle} isEditing={true} />;
}
