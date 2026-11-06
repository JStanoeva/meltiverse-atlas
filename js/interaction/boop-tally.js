/** How many boops each ledger entry has received during this visit. */
const boopCounts = {};
let total = 0;

export function recordBoop(entry) {
  boopCounts[entry] = (boopCounts[entry] || 0) + 1;
  total++;
}
export const boopsAt = (entry) => boopCounts[entry] || 0;
export const totalBoops = () => total;
