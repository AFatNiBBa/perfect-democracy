
import { normalizeVotesForUser, sumScores } from "../lib/util";
import { yieldMajoritySteps } from "../lib/majority";
import { Party, UserVote } from "../lib/model";

const empty: Party = { name: "", color: "transparent" };
const a: Party = { name: "A", color: "red" };
const b: Party = { name: "B", color: "green" };
const c: Party = { name: "C", color: "blue" };
const d: Party = { name: "D", color: "yellow" };

const userVotes: UserVote[][] = [
	[
		{ score: 3, positive: true, parties: [a, b] }, // .5
		{ score: 2, positive: false, parties: [c] }, // .33333333333333333333
		{ score: 1, positive: true, parties: [c, b, a] } // .16666666666666666667
	],
	[
		{ score: 10, positive: true, parties: [a] }, // .625
		{ score: 4, positive: true, parties: [c, a, b] }, // .25
		{ score: 2, positive: false, parties: [c, a] } // .125
	],
	// [
	// 	{ score: 0.16666666666666666, positive: true, parties: [d] },
	// 	{ score: 0.8333333333333334, positive: false, parties: [c] }
	// ]
];

const calcVotes = Iterator
		.from(userVotes)
		.flatMap(x => normalizeVotesForUser(x))
		.toArray();

//////////////////////////////////////////////////////////////////////////////////////////

export const DEMO_INITIAL_SCORE = calcVotes.reduce((sum, v) => sum + Math.abs(v.score), 0);

export const DEMO_RESULTS = yieldMajoritySteps(calcVotes)
	.map(step => step
		.entries()
		.map(([ party, v ]) => ({ party, value: sumScores(v) }))
		.filter(x => x.value > 0)
		.toArray())
	.map(x => (x.push({ party: empty, value: DEMO_INITIAL_SCORE - x.reduce((sum, x) => sum + x.value, 0) }), x))
	.toArray();