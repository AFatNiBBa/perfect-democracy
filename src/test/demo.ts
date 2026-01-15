
import { normalizeVotesForUser, sumScores } from "../lib/util";
import { yieldMajoritySteps } from "../lib/majority";
import { Party, UserVote } from "../lib/model";

const a: Party = { name: "A" };
const b: Party = { name: "B" };
const c: Party = { name: "C" };
const d: Party = { name: "D" };

const votes: UserVote[][] = [
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

for (const elm of yieldMajoritySteps(Iterator.from(votes).flatMap(x => normalizeVotesForUser(x))))
	console.log(Object.fromEntries(elm.entries().map(([k, v]) => [k.name, sumScores(v)])));
