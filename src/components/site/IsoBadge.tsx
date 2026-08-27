/**
 * Badge de certificación ISO 9001:2015 armado en código (sin imagen externa).
 * Ícono de escudo con check en trazo (no relleno) en rojo de marca, y texto en
 * dos líneas. Hereda el fondo/borde de la tarjeta contenedora, así que no lleva
 * chrome propio en la franja de métricas.
 *
 * `compact` → versión a mitad de tamaño, horizontal, para el footer.
 *
 * NOTA: si el organismo certificador provee su isotipo oficial, reemplazar este
 * badge por ese archivo tal cual (sin recolorear ni deformar).
 */
function ShieldCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3 5 5.7v5.1c0 4.3 2.9 7.4 7 8.7 4.1-1.3 7-4.4 7-8.7V5.7L12 3Z" />
      <path d="m8.7 12 2.3 2.3 4.3-4.3" />
    </svg>
  );
}

export function IsoBadge({
  compact = false,
  className = "",
  label = "Certificados",
}: {
  compact?: boolean;
  className?: string;
  label?: string;
}) {
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
        <span className="leading-tight">
          <span className="block text-xs font-medium text-foreground">ISO 9001:2015</span>
          <span className="block text-[0.65rem] text-muted-foreground">{label}</span>
        </span>
      </span>
    );
  }

  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <ShieldCheck className="h-10 w-10 text-primary" />
      <p className="mt-3 font-display text-lg font-medium text-foreground">ISO 9001:2015</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
