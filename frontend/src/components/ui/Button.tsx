import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

export type VarianteBouton = "cuivre" | "contour" | "fantome" | "rouge";

const VARIANTES: Record<VarianteBouton, string> = {
  cuivre:
    "border-cuivre bg-cuivre text-white hover:border-cuivre-fonce hover:bg-cuivre-fonce",
  contour: "border-ligne bg-white hover:border-encre",
  fantome:
    "border-transparent bg-transparent text-encre-2 hover:border-ligne hover:text-encre",
  rouge:
    "border-rouge bg-rouge text-white hover:border-rouge-fonce hover:bg-rouge-fonce",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg border-[1.5px] px-5 py-[11px] text-[15px] font-semibold transition-colors";

export function classesBouton(
  variant: VarianteBouton = "contour",
  supplement?: string,
): string {
  return `${BASE} ${VARIANTES[variant]}${supplement ? ` ${supplement}` : ""}`;
}

interface BoutonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VarianteBouton;
}

export function Bouton({ variant = "contour", className, ...props }: BoutonProps) {
  return <button className={classesBouton(variant, className)} {...props} />;
}

interface BoutonLienProps {
  to: string;
  variant?: VarianteBouton;
  className?: string;
  children: ReactNode;
}

export function BoutonLien({
  to,
  variant = "contour",
  className,
  children,
}: BoutonLienProps) {
  return (
    <Link to={to} className={classesBouton(variant, className)}>
      {children}
    </Link>
  );
}

const BASE_ICONE =
  "inline-flex items-center justify-center rounded-lg border-[1.5px] border-ligne bg-white text-encre-2 transition-colors";

interface BoutonIconeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  taille?: "normale" | "petite";
  /** Survol rouge pour les actions destructives (supprimer, retirer). */
  danger?: boolean;
}

export function BoutonIcone({
  taille = "normale",
  danger = false,
  className,
  ...props
}: BoutonIconeProps) {
  const dimension = taille === "petite" ? "h-8 w-8" : "h-[38px] w-[38px]";
  const survol = danger
    ? "hover:border-rouge hover:text-rouge"
    : "hover:border-cuivre hover:text-cuivre";
  return (
    <button
      className={`${BASE_ICONE} ${dimension} ${survol} ${className ?? ""}`}
      {...props}
    />
  );
}
