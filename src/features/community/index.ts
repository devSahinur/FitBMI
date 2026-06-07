/**
 * Community — ARCHITECTURE ONLY (disabled).
 *
 * Future social layer: leaderboard, friends, challenges and achievement
 * sharing. Interfaces are defined so the rest of the app can be wired up; a
 * backend (or peer/relay service) would implement `CommunityService` later.
 */

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUri?: string;
  level: number;
  xp: number;
  rank: number;
}

export interface Friend {
  userId: string;
  name: string;
  avatarUri?: string;
  streak: number;
  online: boolean;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  goal: string;
  participants: number;
  endsAt: number;
  joined: boolean;
}

export interface CommunityService {
  readonly enabled: boolean;
  getLeaderboard(): Promise<LeaderboardEntry[]>;
  getFriends(): Promise<Friend[]>;
  getChallenges(): Promise<CommunityChallenge[]>;
  joinChallenge(id: string): Promise<void>;
  shareAchievement(achievementId: string): Promise<void>;
}

const NOT_IMPLEMENTED = 'Community features are not enabled in this build.';

export const disabledCommunity: CommunityService = {
  enabled: false,
  async getLeaderboard() {
    return [];
  },
  async getFriends() {
    return [];
  },
  async getChallenges() {
    return [];
  },
  async joinChallenge() {
    throw new Error(NOT_IMPLEMENTED);
  },
  async shareAchievement() {
    throw new Error(NOT_IMPLEMENTED);
  },
};

export const CommunityService = disabledCommunity;
