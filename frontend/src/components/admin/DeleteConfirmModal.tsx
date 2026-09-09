import { Bouton } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface DeleteConfirmModalProps {
  ouvert: boolean;
  produitNom: string;
  onConfirmer: () => void;
  onAnnuler: () => void;
}

/** Confirmation avant suppression définitive d'un produit. */
export function DeleteConfirmModal({
  ouvert,
  produitNom,
  onConfirmer,
  onAnnuler,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      ouvert={ouvert}
      onFermer={onAnnuler}
      titreId="titre-suppression"
      largeur="petite"
    >
      <h2 id="titre-suppression" className="text-[19px] font-bold">
        Supprimer le produit ?
      </h2>
      <p className="mb-5 mt-2 text-encre-2">
        « {produitNom} » sera retiré du catalogue.
      </p>
      <div className="flex justify-end gap-2.5">
        <Bouton variant="fantome" onClick={onAnnuler}>
          Annuler
        </Bouton>
        <Bouton variant="rouge" onClick={onConfirmer}>
          Supprimer
        </Bouton>
      </div>
    </Modal>
  );
}
