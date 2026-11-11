import React from "react";
import { LocalDB } from "@/lib/db/local-db";
import { EnquiryStatusUpdater } from "@/components/admin/EnquiryStatusUpdater";
import { Phone, MessageCircle, Calendar, Mail } from "lucide-react";
import { toKenyanInternationalDigits } from "@/lib/config/dealership";

export const revalidate = 0; // Dynamic server query

export default function AdminEnquiriesPage() {
  const enquiries = LocalDB.getEnquiries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Customer Enquiries & Viewing Requests
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          {enquiries.length} total customer leads recorded. Contact customers promptly to confirm appointments.
        </p>
      </div>

      <div className="bg-white rounded-card border border-border shadow-sm overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-secondary">
            No customer enquiries recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {enquiries.map((enq) => {
              const waNumber = toKenyanInternationalDigits(enq.phone);
              const waMessage = `Hello ${enq.customer_name}, this is MotoHaven Nairobi following up on your enquiry regarding ${enq.vehicle_name || "our inventory"}.`;

              return (
                <div key={enq.id} className="p-5 sm:p-6 hover:bg-background-secondary/30 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-text-primary">
                          {enq.customer_name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-background-secondary border border-border text-text-secondary">
                          {enq.enquiry_type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Received on {new Date(enq.created_at).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <EnquiryStatusUpdater
                        enquiryId={enq.id}
                        currentStatus={enq.status}
                        currentNotes={enq.notes}
                      />
                    </div>
                  </div>

                  {/* Vehicle target & customer notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="space-y-1">
                      <p className="font-semibold text-text-primary">
                        Vehicle: {enq.vehicle_name || "General Showroom Consultation"}
                      </p>
                      {enq.preferred_date && (
                        <p className="text-text-secondary flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-action" />
                          <span>Preferred Date: <strong>{enq.preferred_date}</strong></span>
                        </p>
                      )}
                      {enq.message && (
                        <p className="text-text-secondary bg-background-secondary p-2.5 rounded border border-border mt-1">
                          &quot;{enq.message}&quot;
                        </p>
                      )}
                    </div>

                    {/* Direct Contact Actions */}
                    <div className="flex flex-col sm:items-end justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`tel:${enq.phone.replace(/\s+/g, "")}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-background-secondary border border-border text-text-primary hover:bg-background-tertiary transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-action" />
                          <span>Call {enq.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-brand-whatsapp text-white hover:bg-brand-whatsappHover transition-colors font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>

                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-background-secondary border border-border text-text-secondary hover:text-text-primary"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </a>
                        )}
                      </div>

                      {enq.notes && (
                        <p className="text-[11px] text-text-secondary italic">
                          Staff Note: {enq.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
