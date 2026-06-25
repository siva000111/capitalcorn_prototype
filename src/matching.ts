import type { Fund, Startup, Pair, SectorTag, Stage, LocationTag } from './types';

export interface EligibleFund {
  fund: Fund;
  reasons: string[];
}

function passesTicketRule(fund: Fund, raise: number): boolean {
  const { minTicket, maxTicket } = fund;
  if (minTicket != null && maxTicket != null) return raise >= minTicket && raise <= maxTicket;
  if (minTicket != null) return raise >= minTicket;
  if (maxTicket != null) return raise <= maxTicket;
  return true;
}

/**
 * Pure matchmaking rule set: ticket size, stage, location, sector overlap (OR,
 * with Sector Agnostic as a wildcard), and dedupe against any existing pair
 * for this startup (any status, including null).
 */
export function getEligibleFunds(
  startup: Startup,
  allFunds: Fund[],
  existingPairs: Pair[],
  selectedSectors: SectorTag[],
  stage: Stage,
  location: LocationTag
): EligibleFund[] {
  if (selectedSectors.length === 0) return [];

  const pairedFundIds = new Set(
    existingPairs.filter((p) => p.startupId === startup.id).map((p) => p.fundId)
  );

  const result: EligibleFund[] = [];

  for (const fund of allFunds) {
    if (pairedFundIds.has(fund.id)) continue;
    if (fund.stages.length === 0 || fund.locations.length === 0) continue;
    if (!fund.stages.includes(stage)) continue;
    if (!fund.locations.includes(location)) continue;
    if (!passesTicketRule(fund, startup.raise)) continue;

    const isAgnostic = fund.focusAreas.includes('Sector Agnostic');
    const matchedSector = selectedSectors.some((s) => fund.focusAreas.includes(s));
    if (!isAgnostic && !matchedSector) continue;

    const reasons: string[] = [];
    if (matchedSector) reasons.push('Sector fit');
    if (isAgnostic) reasons.push('Sector agnostic');
    reasons.push('Ticket fit');
    reasons.push('Stage/Location fit');

    result.push({ fund, reasons });
  }

  return result;
}
