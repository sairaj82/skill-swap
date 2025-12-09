import { User, Skill } from "../types";

/**
 * Finds potential matches for a user based on their teaching and learning needs.
 * 
 * @param currentUser The user looking for matches
 * @param pool All other users in the platform
 * @returns Array of users ranked by match quality
 */
export function findMatches(currentUser: User, pool: User[]) {
    return pool.map(candidate => {
        // 1. Can candidate teach what current user wants?
        const learningMatches = currentUser.learning.filter(learnSkill =>
            candidate.teaching.some(teachSkill => teachSkill.category === learnSkill.category)
        );

        // 2. Can current user teach what candidate wants?
        const teachingMatches = currentUser.teaching.filter(teachSkill =>
            candidate.learning.some(learnSkill => learnSkill.category === teachSkill.category)
        );

        const score = (learningMatches.length * 2) + (teachingMatches.length * 1);
        const isPerfectMatch = learningMatches.length > 0 && teachingMatches.length > 0;

        return {
            user: candidate,
            score,
            isPerfectMatch,
            matchedSkills: [...learningMatches, ...teachingMatches]
        };
    }).filter(match => match.score > 0).sort((a, b) => b.score - a.score);
}
