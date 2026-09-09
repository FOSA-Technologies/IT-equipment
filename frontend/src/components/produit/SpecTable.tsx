/** Tableau de fiche technique : clés en gris, valeurs en gras. */
export function SpecTable({ fiche }: { fiche: Record<string, string> }) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-[10px] border border-ligne">
      <tbody>
        {Object.entries(fiche).map(([cle, valeur]) => (
          <tr key={cle} className="border-t border-ligne first:border-t-0">
            <th className="w-2/5 bg-illu px-[18px] py-3 text-left text-sm font-medium text-encre-2">
              {cle}
            </th>
            <td className="px-[18px] py-3 text-sm font-semibold">{valeur}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
