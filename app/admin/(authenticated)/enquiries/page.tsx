import React from "react";
import { redirect } from "next/navigation";
import { EnquiriesRepository } from "@/lib/repositories/enquiries";
import { getStaffSession } from "@/lib/auth/guards";
import { EnquiryStatusUpdater } from "@/components/admin/EnquiryStatusUpdater";
import { Phone, MessageCircle, Calendar, Mail } from "lucide-react";
import { toKenyanInternationalDigits } from "@/lib/config/dealership";

export const revalidate = 0; // Dynamic server query

export default async function AdminEnquiriesPage() {
  const session = getStaffSession();
  if (!session) {
    redirect("/admin/login");
  }

  const enquiries = await EnquiriesRepository.getStaffEnquiries(session);

  // Deterministic ordering: created_at DESC (Fixes Priority 1.7)
  enquiries.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Customer Enquiries & Viewing Requests
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          {enquiries.length} total customer leads recorded. Contact customers promptly to confirm appointments.
        </p>
      </div>

      <div className="bg-white border border-border overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-secondary">
            No customer enquiries recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {enquiries.map((enq) => {
              const waNumber = toKenyanInternationalDigits(enq.phone);
              const waMessage = `Hello ${enq.customer_name}, this is MotoHaven Nairobi following up on your enquiry regarding ${enq.vehicle_name || "our showroom inventory"}.`;

              return (
                <div key={enq.id} className="p-5 sm:p-6 hover:bg-background-secondary/30 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-text-primary">
                          {enq.customer_name}
                        </h2>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-background-secondary border border-border text-text-secondary">
                          {enq.enquiry_type}
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

                    <div>
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
                          <Calendar className="w-3.5 h-3.5 text-text-primary" />
                          <span>Preferred Date: <strong>{enq.preferred_date}</strong> {enq.preferred_time ? `(${enq.preferred_time})` : ""}</span>
                        </p>
                      )}
                      {enq.message && (
                        <p className="text-text-secondary bg-background-secondary p-2.5 border border-border mt-1 leading-relaxed">
                          &quot;{enq.message}&quot;
                        </p>
                      )}
                    </div>

                    {/* Direct Contact Actions */}
                    <div className="flex flex-col sm:items-end justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`tel:${enq.phone.replace(/\s+/g, "")}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-field bg-white text-text-primary hover:bg-background-secondary transition-colors min-h-[36px]"
                        >
                          <Phone className="w-3.5 h-3.5 text-text-secondary" />
                          <span>Call {enq.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-whatsapp text-white hover:bg-brand-whatsappHover transition-colors font-semibold min-h-[36px]"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>

                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-field bg-white text-text-secondary hover:text-text-primary min-h-[36px]"
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
