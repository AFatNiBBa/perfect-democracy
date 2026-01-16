
/** Type that represents a political party */
export interface Party {
	name: string;
	color: string;
}

/**
 * Type that represents the common parts of a vote.
 * The vote contains a decimal score and a list of parties, which is composed by the voted one and an ordered list of fallbacks
 */
export interface BaseVote {
	score: number;
	parties: Party[];
}

/**
 * Type that represents a user's vote.
 * The score is an absolute value, but the vote can be made positive or negative through the {@link positive} field.
 * Each user has the voting power of 1, but can allocate many votes, and each score's real value is it's fraction of the total (Like the {@link CSS.fr} unit) for that user
 */
export interface UserVote extends BaseVote {
	positive: boolean;
}

/**
 * Type that represents a calculation vote.
 * The score is a value from -1 to 1 that rapresents the fraction of a user's voting power and whether the vote is for or against its parties.
 * The {@link index} field stores the index of the current active party in the {@link parties} list
 */
export interface CalcVote extends BaseVote {
	index: number;
}