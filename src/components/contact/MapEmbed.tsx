import { MAP_QUERY } from "@/lib/constants";

export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <iframe
        title="Map showing CHIC Complex, Kigali, Rwanda"
        src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
        className="h-80 w-full sm:h-96"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
