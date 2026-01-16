
import { UserVote, CalcVote, BaseVote } from "./model";

/**
 * Sums the scores of a list of votes
 * @param list The votes of which to sum the scores
 */
export const sumScores = (list: Iterable<BaseVote>) => Iterator.from(list).reduce((sum, x) => sum + x.score, 0);

/**
 * Normalizes a list of user votes by giving their scores the proper sign and re-proportioning them so that the sum of their absolute values is 1.
 * If the sum of the scores is 0, nothing is yielded, as the votes have no effect
 * @param list A list of user votes that all belong to the same user
 */
export function *normalizeVotesForUser(list: UserVote[]) {
	const sum = sumScores(list);
	if (!sum) return;
	yield* Iterator.from(list).map<CalcVote>(x => ({
		score: (x.score / sum) * (x.positive ? 1 : -1),
		parties: x.parties,
		index: 0
	}));
}

/**
 * Adds an element to one of the lists of {@link map}
 * @param map The {@link Map} that stores the groups to which to add the element
 * @param k The key to which to add the element
 * @param v The element to add
 */
export function addToGroup<K, V>(map: Map<K, V[]>, k: K, v: V) {
	const list = map.get(k);
	if (!list) map.set(k, [ v ]);
	else list.push(v);
}