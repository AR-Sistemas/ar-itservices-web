/** Asterisco de campo obligatorio (el texto "* Campos obligatorios" explica el signo). */
export function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-brand-text">
      *
    </span>
  );
}
