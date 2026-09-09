import type { ComponentType } from "react";

import type { IllustrationNom } from "@/types";
import { AlimIllustration } from "@/components/produit/illustrations/AlimIllustration";
import { CarteMereIllustration } from "@/components/produit/illustrations/CarteMereIllustration";
import { ClavierIllustration } from "@/components/produit/illustrations/ClavierIllustration";
import { EcranIllustration } from "@/components/produit/illustrations/EcranIllustration";
import { HddIllustration } from "@/components/produit/illustrations/HddIllustration";
import { RamIllustration } from "@/components/produit/illustrations/RamIllustration";
import { SourisIllustration } from "@/components/produit/illustrations/SourisIllustration";
import { SsdIllustration } from "@/components/produit/illustrations/SsdIllustration";
import { SsdSataIllustration } from "@/components/produit/illustrations/SsdSataIllustration";

const ILLUSTRATIONS: Record<IllustrationNom, ComponentType> = {
  ram: RamIllustration,
  ssd: SsdIllustration,
  "ssd-sata": SsdSataIllustration,
  hdd: HddIllustration,
  clavier: ClavierIllustration,
  souris: SourisIllustration,
  ecran: EcranIllustration,
  alim: AlimIllustration,
  cm: CarteMereIllustration,
};

/** Schéma technique du produit, choisi d'après son type d'illustration. */
export function ProductIllustration({ nom }: { nom: IllustrationNom }) {
  const Illustration = ILLUSTRATIONS[nom];
  return <Illustration />;
}
