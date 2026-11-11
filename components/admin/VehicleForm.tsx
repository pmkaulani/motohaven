"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/types/vehicle";
import { Upload, X, Star, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface VehicleFormProps {
  initialVehicle?: Vehicle;
  isEditing?: boolean;
}

export function VehicleForm({ initialVehicle, isEditing = false }: VehicleFormProps) {
  const router = useRouter();

  const [brand, setBrand] = useState(initialVehicle?.brand || "");
  const [model, setModel] = useState(initialVehicle?.model || "");
  const [trim, setTrim] = useState(initialVehicle?.trim || "");
  const [year, setYear] = useState(initialVehicle?.year?.toString() || new Date().getFullYear().toString());
  const [price, setPrice] = useState(initialVehicle?.price?.toString() || "");
  const [mileage, setMileage] = useState(initialVehicle?.mileage?.toString() || "");
  const [engineCc, setEngineCc] = useState(initialVehicle?.engine_cc?.toString() || "2000");
  const [condition, setCondition] = useState(initialVehicle?.condition || "Foreign Used");
  const [transmission, setTransmission] = useState(initialVehicle?.transmission || "Automatic");
  const [fuel, setFuel] = useState(initialVehicle?.fuel || "Petrol");
  const [bodyType, setBodyType] = useState(initialVehicle?.body_type || "SUV");
  const [drivetrain, setDrivetrain] = useState(initialVehicle?.drivetrain || "4WD");
  const [origin, setOrigin] = useState(initialVehicle?.origin || "Japan Import");
  const [stockReference, setStockReference] = useState(initialVehicle?.stock_reference || "");
  const [status, setStatus] = useState(initialVehicle?.status || "Available");
  const [description, setDescription] = useState(initialVehicle?.description || "");
  const [featuresInput, setFeaturesInput] = useState(initialVehicle?.features?.join(", ") || "");

  const [photoUrls, setPhotoUrls] = useState<string[]>(initialVehicle?.photo_urls || []);
  const [coverPhoto, setCoverPhoto] = useState<string>(initialVehicle?.cover_photo || initialVehicle?.photo_urls?.[0] || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setErrorMsg("");

    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const newUrls = [...photoUrls, ...data.urls];
      setPhotoUrls(newUrls);
      if (!coverPhoto && newUrls.length > 0) {
        setCoverPhoto(newUrls[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not upload photos. Check image files.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (urlToRemove: string) => {
    const updated = photoUrls.filter((u) => u !== urlToRemove);
    setPhotoUrls(updated);
    if (coverPhoto === urlToRemove) {
      setCoverPhoto(updated[0] || "");
    }
  };

  const movePhotoLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...photoUrls];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setPhotoUrls(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      brand: brand.trim(),
      model: model.trim(),
      trim: trim.trim() || undefined,
      year: parseInt(year, 10),
      price: parseFloat(price),
      mileage: parseInt(mileage, 10) || 0,
      engine_cc: parseInt(engineCc, 10) || 2000,
      condition,
      transmission,
      fuel,
      body_type: bodyType,
      drivetrain: drivetrain || undefined,
      origin: origin || undefined,
      stock_reference: stockReference.trim() || undefined,
      status,
      description: description.trim(),
      features,
      photo_urls: photoUrls.length > 0 ? photoUrls : ["/images/car-placeholder.jpg"],
      cover_photo: coverPhoto || photoUrls[0] || "/images/car-placeholder.jpg",
    };

    try {
      const url = isEditing && initialVehicle ? `/api/vehicles/${initialVehicle.id}` : "/api/vehicles";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save vehicle");
      }

      router.push("/admin/cars");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save vehicle details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Link
          href="/admin/cars"
          className="p-2 rounded-btn border border-border bg-white text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {isEditing ? `Edit ${initialVehicle?.year} ${initialVehicle?.brand} ${initialVehicle?.model}` : "Add Vehicle to Inventory"}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Fill in vehicle specifications and genuine showroom photographs.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form with clean sections, unboxed, separated by subtle dividers */}
      <form onSubmit={handleSubmit} className="space-y-8 text-sm">
        {/* Section 1: Vehicle Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-text-primary">
            Vehicle details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Make <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Toyota, BMW, Mazda"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Model <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Prado, 320i, CX-5"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Trim / Grade
              </label>
              <input
                type="text"
                placeholder="e.g. TX, M Sport, Limited"
                value={trim}
                onChange={(e) => setTrim(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Year of Manufacture <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="1990"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Selling Price (KSh) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="100000"
                placeholder="e.g. 3500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Mileage (km) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 58000"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Specifications */}
        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text-primary">
            Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:outline-none"
              >
                <option value="Foreign Used">Foreign Used (Import)</option>
                <option value="Locally Used">Locally Used (Kenyan)</option>
                <option value="Brand New">Brand New</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Transmission
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:outline-none"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Fuel Type
              </label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as any)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:outline-none"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Engine (cc)
              </label>
              <input
                type="number"
                value={engineCc}
                onChange={(e) => setEngineCc(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Body Type
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as any)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:outline-none"
              >
                <option value="SUV">SUV</option>
                <option value="Saloon">Saloon</option>
                <option value="Station Wagon">Station Wagon</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Drivetrain
              </label>
              <input
                type="text"
                placeholder="e.g. 4WD, AWD, RWD"
                value={drivetrain}
                onChange={(e) => setDrivetrain(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Stock Reference
              </label>
              <input
                type="text"
                placeholder="e.g. MH-2018-CX5"
                value={stockReference}
                onChange={(e) => setStockReference(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Photographs */}
        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">
              Photographs ({photoUrls.length})
            </h2>
            <span className="text-xs text-text-secondary">
              Star indicates cover image
            </span>
          </div>

          <div className="border border-border rounded-btn p-5 text-center bg-background-secondary/50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="photo-file-input"
            />
            <label
              htmlFor="photo-file-input"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-btn bg-white border border-border text-xs font-semibold text-text-primary hover:bg-background-secondary"
            >
              <Upload className="w-4 h-4 text-action" />
              <span>{uploading ? "Uploading..." : "Upload Showroom Photos"}</span>
            </label>
          </div>

          {photoUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {photoUrls.map((url, index) => {
                const isCover = coverPhoto === url;
                return (
                  <div
                    key={index}
                    className={`relative rounded overflow-hidden border aspect-[4/3] group ${
                      isCover ? "border-text-primary ring-1 ring-text-primary" : "border-border"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => movePhotoLeft(index)}
                          className="p-1 rounded bg-white text-text-primary text-xs"
                          title="Move left"
                        >
                          ←
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setCoverPhoto(url)}
                        className={`p-1 rounded text-xs ${
                          isCover ? "bg-emerald-600 text-white" : "bg-white text-text-primary"
                        }`}
                        title="Set Cover"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(url)}
                        className="p-1 rounded bg-red-600 text-white text-xs"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isCover && (
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                        COVER
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Description & Status */}
        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text-primary">
            Description & Status
          </h2>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Vehicle Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe condition, history, and key equipment."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Key Features (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Sunroof, Leather Seats, 360 Camera, Alloy Wheels"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Inventory Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full sm:w-64 h-11 px-3 bg-white rounded-btn border border-border focus:outline-none"
            >
              <option value="Available">Available (Visible in showroom)</option>
              <option value="Reserved">Reserved (Deposit taken)</option>
              <option value="Sold">Sold (Marked sold)</option>
              <option value="Draft">Draft (Internal)</option>
              <option value="Archived">Archived (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Submission Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Link
            href="/admin/cars"
            className="h-11 px-5 rounded-btn border border-border bg-white text-text-primary text-xs font-semibold hover:bg-background-secondary transition-colors flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-6 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Publish Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
