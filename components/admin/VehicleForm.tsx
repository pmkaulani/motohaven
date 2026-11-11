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

  // Photo URLs state
  const [photoUrls, setPhotoUrls] = useState<string[]>(initialVehicle?.photo_urls || []);
  const [coverPhoto, setCoverPhoto] = useState<string>(initialVehicle?.cover_photo || initialVehicle?.photo_urls?.[0] || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle local photo upload via /api/upload
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cars"
            className="p-2 rounded-btn border border-border bg-white text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {isEditing ? `Edit ${initialVehicle?.year} ${initialVehicle?.brand} ${initialVehicle?.model}` : "Add New Vehicle to Inventory"}
            </h1>
            <p className="text-xs text-text-secondary">
              Enter vehicle specifications and genuine showroom photographs.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Basic Vehicle Details Card */}
        <div className="bg-white p-6 rounded-card border border-border shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            1. Core Vehicle Identity & Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Make / Manufacturer <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Toyota, BMW, Mazda"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Model <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Prado TX, 320i, CX-5"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Trim / Grade
              </label>
              <input
                type="text"
                placeholder="e.g. L-Package, M Sport, Limited"
                value={trim}
                onChange={(e) => setTrim(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Year of Manufacture <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="1990"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Selling Price (KSh) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="100000"
                placeholder="e.g. 3500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Mileage (km) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 58000"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Stock Reference / Tag
              </label>
              <input
                type="text"
                placeholder="e.g. MH-2018-CX5"
                value={stockReference}
                onChange={(e) => setStockReference(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white p-6 rounded-card border border-border shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            2. Technical Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
              >
                <option value="Foreign Used">Foreign Used (Import)</option>
                <option value="Locally Used">Locally Used (Kenyan)</option>
                <option value="Brand New">Brand New</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Transmission
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Fuel Type
              </label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as any)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
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
              <label className="block font-semibold text-text-primary mb-1">
                Engine Displacement (cc)
              </label>
              <input
                type="number"
                value={engineCc}
                onChange={(e) => setEngineCc(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Body Type
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as any)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
              >
                <option value="SUV">SUV</option>
                <option value="Saloon">Saloon / Sedan</option>
                <option value="Station Wagon">Station Wagon</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Pickup">Pickup</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Drivetrain
              </label>
              <input
                type="text"
                placeholder="e.g. 4WD, AWD, RWD"
                value={drivetrain}
                onChange={(e) => setDrivetrain(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Origin / Import Country
              </label>
              <input
                type="text"
                placeholder="e.g. Japan Import, UK Import"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Photography & Cover Selector */}
        <div className="bg-white p-6 rounded-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              3. Vehicle Photographs ({photoUrls.length})
            </h2>
            <span className="text-[11px] text-text-secondary">
              Click star to set Cover Image
            </span>
          </div>

          {/* Upload Input */}
          <div className="border-2 border-dashed border-border rounded-card p-6 text-center hover:border-action transition-colors bg-background-secondary/30">
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
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-action shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-text-primary">
                {uploading ? "Uploading high-res photos..." : "Click to select or drag showroom photographs"}
              </p>
              <p className="text-[11px] text-text-secondary">
                Supports JPG, PNG, WebP up to 10MB each.
              </p>
            </label>
          </div>

          {/* Photo Previews Strip with Reorder & Cover Selector */}
          {photoUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {photoUrls.map((url, index) => {
                const isCover = coverPhoto === url;
                return (
                  <div
                    key={index}
                    className={`relative rounded overflow-hidden border aspect-[4/3] group ${
                      isCover ? "ring-2 ring-emerald-600 border-emerald-600" : "border-border"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => movePhotoLeft(index)}
                          className="p-1 rounded bg-white text-text-primary text-[10px]"
                          title="Move left"
                        >
                          ←
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setCoverPhoto(url)}
                        className={`p-1 rounded text-[10px] ${
                          isCover ? "bg-emerald-600 text-white" : "bg-white text-text-primary"
                        }`}
                        title="Set as Cover"
                      >
                        <Star className="w-3 h-3 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(url)}
                        className="p-1 rounded bg-red-600 text-white text-[10px]"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {isCover && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-bold">
                        COVER
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Narrative Description & Features */}
        <div className="bg-white p-6 rounded-card border border-border shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            4. Description & Key Equipment
          </h2>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Dealership Notes & Detailed Condition
            </label>
            <textarea
              rows={4}
              placeholder="Describe vehicle condition, service history, key equipment, and logbook availability."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Key Features (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Sunroof, Leather Seats, 360 Camera, Alloy Wheels, Push Start"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Inventory Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full sm:w-64 p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
            >
              <option value="Available">Available (Visible on public website)</option>
              <option value="Reserved">Reserved (Deposit taken)</option>
              <option value="Sold">Sold (Marked as sold)</option>
              <option value="Draft">Draft (Internal preparation)</option>
              <option value="Archived">Archived (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Form Submission Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/cars"
            className="px-5 py-2.5 rounded-btn border border-border bg-white text-text-primary font-semibold hover:bg-background-tertiary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-btn bg-action text-white font-semibold hover:bg-action-hover transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving Vehicle..." : isEditing ? "Update Vehicle" : "Publish to Showroom Stock"}
          </button>
        </div>
      </form>
    </div>
  );
}
