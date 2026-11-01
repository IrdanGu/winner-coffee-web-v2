import { Info } from "lucide-react";

interface DisclaimerBadgeProps {
  text?: string;
  className?: string;
}

export function DisclaimerBadge({
  text = "Estimasi tarif & ketersediaan awal — konfirmasi jadwal final diproses oleh Admin WhatsApp.",
  className = "",
}: DisclaimerBadgeProps) {
  return (
    <div
      className={`inline-flex items-start gap-2 border border-[#D9D2C7] bg-[#F4EFE6] px-3 py-2 text-[11px] leading-relaxed text-[#555048] ${className}`}
    >
      <Info className="h-3.5 w-3.5 shrink-0 text-[#108474] mt-0.5" />
      <span>{text}</span>
    </div>
  );
}
