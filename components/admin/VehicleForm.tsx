"use client";

import React, { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Vehicle, VehicleProofRecords } from "@/types/vehicle";
import { Upload, X, Star, ArrowLeft, AlertCircle, Save } from "lucide-react";

interface Props {
  initialVehicle?: Vehicle | null;
  isEditing?: boolean;
}

export function VehicleForm({ initialVehicle, isEditing = false }: Props) {
  const router = useRouter();

  // Unique IDs for accessibility
  const brandId = useId();
  const modelId = useId();
  const trimId = useId();
  const yearId = useId();
  const priceId = useId();
  const mileageId = useId();
  const engineCcId = useId();
  const conditionId = useId();
  const transmissionId = useId();
  const fuelId = useId();
  const bodyTypeId = useId();
  const drivetrainId = useId();
  const originId = useId();
  const stockRefId = useId();
  const statusId = useId();
  const descriptionId = useId();
  const featuresId = useId();
  const fileInputId = useId();

  // Proof records IDs
  const mileageSourceId = useId();
  const exportSheetId = useId();
  const chassisStatusId = useId();
  const logbookStatusId = useId();
  const dutyStatusId = useId();

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

  // Proof / Paperwork records
  const [mileageSource, setMileageSource] = useState(initialVehicle?.proof_records?.mileage_source || "Recorded at showroom check");
  const [exportSheetStatus, setExportSheetStatus] = useState(initialVehicle?.proof_records?.export_sheet_status || "Provided");
  const [chassisCheckStatus, setChassisCheckStatus] = useState(initialVehicle?.proof_records?.chassis_check_status || "Staff checked");
  const [logbookStatus, setLogbookStatus] = useState(initialVehicle?.proof_records?.logbook_status || "Available at showroom");
  const [dutyStatus, setDutyStatus] = useState(initialVehicle?.proof_records?.duty_status || "Fully paid / duty cleared");

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

    const proof_records: VehicleProofRecords = {
      mileage_source: mileageSource || undefined,
      export_sheet_status: exportSheetStatus as any,
      chassis_check_status: chassisCheckStatus as any,
      logbook_status: logbookStatus as any,
      duty_status: dutyStatus as any,
    };

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
      proof_records,
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
          className="p-2 text-text-secondary hover:text-text-primary rounded-btn transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Back to inventory"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            {isEditing ? `Edit: ${initialVehicle?.brand} ${initialVehicle?.model}` : "Add Vehicle to Inventory"}
          </h1>
          <p className="text-xs text-text-secondary">
            Nairobi showroom physical inventory record.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-sm">
        {/* Section 1: Core Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-text-primary border-b border-border pb-2">
            Vehicle details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={brandId} className="block text-xs font-semibold text-text-primary mb-1">
                Make / Brand <span className="text-red-500">*</span>
              </label>
              <input
                id={brandId}
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Toyota, BMW, Mazda"
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              />
            </div>

            <div>
              <label htmlFor={modelId} className="block text-xs font-semibold text-text-primary mb-1">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                id={modelId}
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Prado TX, 320i, CX-5"
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              />
            </div>

            <div>
              <label htmlFor={trimId} className="block text-xs font-semibold text-text-primary mb-1">
                Trim / Variant
              </label>
              <input
                id={trimId}
                type="text"
                value={trim}
                onChange={(e) => setTrim(e.target.value)}
                placeholder="e.g. TX-L Package, M Sport"
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              />
            </div>

            <div>
              <label htmlFor={yearId} className="block text-xs font-semibold text-text-primary mb-1">
                Year of Manufacture <span className="text-red-500">*</span>
              </label>
              <input
                id={yearId}
                type="number"
                required
                min={1980}
                max={2030}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              />
            </div>

            <div>
              <label htmlFor={priceId} className="block text-xs font-semibold text-text-primary mb-1">
                Price (KSh) <span className="text-red-500">*</span>
              </label>
              <input
                id={priceId}
                type="number"
                required
                min={0}
                step={50000}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 4500000"
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              />
            </div>

            <div>
              <label htmlFor={mileageId} className="block text-xs font-semibold text-text-primary mb-1">
                Mileage (km)
              </label>
              <input
                id={mileageId}
                type="number"
                min={0}
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 68000"
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
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
              <label htmlFor={conditionId} className="block text-xs font-semibold text-text-primary mb-1">
                Condition
              </label>
              <select
                id={conditionId}
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="Foreign Used">Foreign Used</option>
                <option value="Locally Used">Locally Used</option>
                <option value="Brand New">Brand New</option>
              </select>
            </div>

            <div>
              <label htmlFor={transmissionId} className="block text-xs font-semibold text-text-primary mb-1">
                Transmission
              </label>
              <select
                id={transmissionId}
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label htmlFor={fuelId} className="block text-xs font-semibold text-text-primary mb-1">
                Fuel Type
              </label>
              <select
                id={fuelId}
                value={fuel}
                onChange={(e) => setFuel(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label htmlFor={bodyTypeId} className="block text-xs font-semibold text-text-primary mb-1">
                Body Type
              </label>
              <select
                id={bodyTypeId}
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="SUV">SUV & 4x4</option>
                <option value="Saloon">Saloon</option>
                <option value="Station Wagon">Station Wagon</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>

            <div>
              <label htmlFor={engineCcId} className="block text-xs font-semibold text-text-primary mb-1">
                Engine Capacity (cc)
              </label>
              <input
                id={engineCcId}
                type="number"
                value={engineCc}
                onChange={(e) => setEngineCc(e.target.value)}
                placeholder="2000"
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              />
            </div>

            <div>
              <label htmlFor={statusId} className="block text-xs font-semibold text-text-primary mb-1">
                Listing Status
              </label>
              <select
                id={statusId}
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="Available">Available (Live)</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Archived">Archived (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Verification & Paperwork (Finding 13) */}
        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text-primary">
            Verification & Paperwork records
          </h2>
          <p className="text-xs text-text-secondary">
            Record honest showroom evidence. Only stated facts will be displayed to customers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={mileageSourceId} className="block text-xs font-semibold text-text-primary mb-1">
                Odometer / Mileage Source
              </label>
              <input
                id={mileageSourceId}
                type="text"
                value={mileageSource}
                onChange={(e) => setMileageSource(e.target.value)}
                placeholder="e.g. Export inspection certificate / JEVIC"
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              />
            </div>

            <div>
              <label htmlFor={exportSheetId} className="block text-xs font-semibold text-text-primary mb-1">
                Export / Auction Sheet Status
              </label>
              <select
                id={exportSheetId}
                value={exportSheetStatus}
                onChange={(e) => setExportSheetStatus(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="Provided">Provided</option>
                <option value="Not supplied">Not supplied</option>
                <option value="Not applicable">Not applicable</option>
              </select>
            </div>

            <div>
              <label htmlFor={chassisStatusId} className="block text-xs font-semibold text-text-primary mb-1">
                Chassis / VIN Check
              </label>
              <select
                id={chassisStatusId}
                value={chassisCheckStatus}
                onChange={(e) => setChassisCheckStatus(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="Staff checked">Staff checked</option>
                <option value="Not checked">Not checked</option>
                <option value="Not supplied">Not supplied</option>
              </select>
            </div>

            <div>
              <label htmlFor={logbookStatusId} className="block text-xs font-semibold text-text-primary mb-1">
                Logbook Status
              </label>
              <select
                id={logbookStatusId}
                value={logbookStatus}
                onChange={(e) => setLogbookStatus(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="Available at showroom">Available at showroom</option>
                <option value="In processing">In processing</option>
                <option value="Duty cleared, awaiting transfer">Duty cleared, awaiting transfer</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={dutyStatusId} className="block text-xs font-semibold text-text-primary mb-1">
                Duty / Import Status
              </label>
              <select
                id={dutyStatusId}
                value={dutyStatus}
                onChange={(e) => setDutyStatus(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
              >
                <option value="Fully paid / duty cleared">Fully paid / duty cleared</option>
                <option value="In bond / subject to duty">In bond / subject to duty</option>
                <option value="Locally registered">Locally registered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Photographs */}
        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">
              Photographs ({photoUrls.length})
            </h2>
            <span className="text-xs text-text-secondary">
              Star indicates cover image
            </span>
          </div>

          <div className="border border-border p-5 text-center bg-background-secondary">
            {/* Keyboard-accessible file input (sr-only, not display:none; Fixes Finding 9) */}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              disabled={uploading}
              className="sr-only"
              id={fileInputId}
            />
            <label
              htmlFor={fileInputId}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-field text-xs font-semibold text-text-primary hover:bg-background-secondary focus-within:ring-2 focus-within:ring-text-primary min-h-[44px]"
            >
              <Upload className="w-4 h-4 text-text-primary" />
              <span>{uploading ? "Uploading..." : "Upload Showroom Photographs (JPEG, PNG, WebP)"}</span>
            </label>
          </div>

          {photoUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {photoUrls.map((url, index) => {
                const isCover = coverPhoto === url;
                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden border aspect-[4/3] group ${
                      isCover ? "border-text-primary ring-2 ring-text-primary" : "border-border"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Vehicle photograph ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Touch-first photo controls: visible on mobile phones, hover/focus on desktop (Fixes Finding 10 & 15) */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 p-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => movePhotoLeft(index)}
                          className="p-1.5 bg-white text-text-primary text-xs min-w-[36px] min-h-[36px] flex items-center justify-center font-bold"
                          title="Move left"
                          aria-label={`Move photo ${index + 1} left`}
                        >
                          ←
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setCoverPhoto(url)}
                        className={`p-1.5 text-xs min-w-[36px] min-h-[36px] flex items-center justify-center ${
                          isCover ? "bg-emerald-600 text-white" : "bg-white text-text-primary"
                        }`}
                        title="Set Cover"
                        aria-label={`Set photo ${index + 1} as cover photograph`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(url)}
                        className="p-1.5 bg-red-600 text-white text-xs min-w-[36px] min-h-[36px] flex items-center justify-center"
                        title="Remove"
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 5: Description & Features */}
        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text-primary">
            Description and Features
          </h2>

          <div>
            <label htmlFor={descriptionId} className="block text-xs font-semibold text-text-primary mb-1">
              Vehicle Description
            </label>
            <textarea
              id={descriptionId}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Factual notes on showroom vehicle condition, import history, recent servicing..."
              className="w-full p-3 bg-white border border-field text-text-primary focus:border-text-primary"
            />
          </div>

          <div>
            <label htmlFor={featuresId} className="block text-xs font-semibold text-text-primary mb-1">
              Features (comma separated)
            </label>
            <input
              id={featuresId}
              type="text"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="Leather seats, Sunroof, Reverse Camera, 360 View"
              className="w-full h-11 px-3 bg-white border border-field text-text-primary focus:border-text-primary"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
          <Link
            href="/admin/cars"
            className="px-5 py-2.5 border border-field text-text-secondary hover:text-text-primary text-xs font-semibold min-h-[44px] flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Record..." : isEditing ? "Update Vehicle Record" : "Save and Publish"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
