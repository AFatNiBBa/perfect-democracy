
import { addToGroup, sumScores } from "./util";
import { CalcVote, Party } from "./model";

/**
 * Yields the steps of a majority election given a list of calculated votes.
 * Every yielded value is the same {@link Map} instance: Ensure to clone it if you want to keep the history of the steps or to mutate it.
 * These are the steps of the algorithm:
 * - Group the votes by their current active party
 * - (Yield the initial grouping)
 * - Until theres more than one party left:
 * 	- Find the party with the least votes
 * 	- (Throw in case of a tie)
 * 	- Remove that party from the grouping
 * 	- Reallocate the votes of the removed party to the next non-eliminated party (If any) in their ranking
 * 	- (Yield the initial grouping)
 * @param list The votes to process
 */
export function *yieldMajoritySteps(list: Iterable<CalcVote>) {
	const group = Map.groupBy(list, x => x.parties[x.index]);
	const losers = new Set<Party>();

	yield group;

	while (group.size > 1) {
		var minParty: Party, minScore = Infinity, tie = false;

		for (const [party, items] of group) {
			const sum = sumScores(items);

			if (sum === minScore) {
				tie = true;
				continue;
			}

			if (sum > minScore) continue;
			minParty = party;
			minScore = sum;
			tie = false;
		}

		if (tie) throw new Error(`Cannot resolve election: Tie detected with ${JSON.stringify(minParty!.name)} at ${minScore.toFixed(2)} votes`);
		losers.add(minParty!);
		const votesToReprocess = group.get(minParty!)!;
		group.delete(minParty!);

		outer: for (const elm of votesToReprocess) {
			var nextParty: Party;
			do if (!(nextParty = elm.parties[++elm.index])) continue outer;
			while (losers.has(nextParty));
			addToGroup(group, nextParty, elm);
		}

		yield group;
	}
}