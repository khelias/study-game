import type { ContentPack } from '../../types';
import { MATH_GRID_NAVIGATION_SKILL } from '../../skills/math';

export type RoboPathProgressionProfile = 'starter' | 'advanced';

export interface RoboPathProfileItem {
  kind: 'profile';
  profile: RoboPathProgressionProfile;
  baseGrid: number;
  maxGrid: number;
  obstacleBonus: number;
  firstLevelObstacleBonus: number;
}

export interface RoboPathGridStageItem {
  kind: 'grid_stage';
  minLevel: number;
  maxLevel?: number;
  gridGrowth: number;
}

export interface RoboPathObstacleStageItem {
  kind: 'obstacle_stage';
  minLevel: number;
  maxLevel?: number;
  baseObstacles: number;
  levelOffset: number;
  growthDivisor: number;
  obstacleVariance: number;
}

export interface RoboPathGenerationSettingsItem {
  kind: 'settings';
  maxObstacleFloor: number;
  maxObstacleRatio: number;
  reservedCells: number;
  minGoalDistanceRatio: number;
  maxGoalDistanceRatio: number;
}

export type RoboPathProgressionItem =
  | RoboPathProfileItem
  | RoboPathGridStageItem
  | RoboPathObstacleStageItem
  | RoboPathGenerationSettingsItem;

const ITEMS: readonly RoboPathProgressionItem[] = [
  {
    kind: 'profile',
    profile: 'starter',
    baseGrid: 3,
    maxGrid: 7,
    obstacleBonus: 0,
    firstLevelObstacleBonus: 0,
  },
  {
    kind: 'profile',
    profile: 'advanced',
    baseGrid: 4,
    maxGrid: 8,
    obstacleBonus: 1,
    firstLevelObstacleBonus: 2,
  },
  { kind: 'grid_stage', minLevel: 1, maxLevel: 2, gridGrowth: 0 },
  { kind: 'grid_stage', minLevel: 3, maxLevel: 5, gridGrowth: 1 },
  { kind: 'grid_stage', minLevel: 6, maxLevel: 10, gridGrowth: 2 },
  { kind: 'grid_stage', minLevel: 11, maxLevel: 15, gridGrowth: 3 },
  { kind: 'grid_stage', minLevel: 16, gridGrowth: 4 },
  {
    kind: 'obstacle_stage',
    minLevel: 1,
    maxLevel: 1,
    baseObstacles: 0,
    levelOffset: 1,
    growthDivisor: 1,
    obstacleVariance: 1,
  },
  {
    kind: 'obstacle_stage',
    minLevel: 2,
    maxLevel: 3,
    baseObstacles: 1,
    levelOffset: 0,
    growthDivisor: 2,
    obstacleVariance: 1,
  },
  {
    kind: 'obstacle_stage',
    minLevel: 4,
    maxLevel: 5,
    baseObstacles: 2,
    levelOffset: 3,
    growthDivisor: 2,
    obstacleVariance: 1,
  },
  {
    kind: 'obstacle_stage',
    minLevel: 6,
    maxLevel: 8,
    baseObstacles: 3,
    levelOffset: 5,
    growthDivisor: 2,
    obstacleVariance: 1,
  },
  {
    kind: 'obstacle_stage',
    minLevel: 9,
    maxLevel: 12,
    baseObstacles: 4,
    levelOffset: 8,
    growthDivisor: 2,
    obstacleVariance: 2,
  },
  {
    kind: 'obstacle_stage',
    minLevel: 13,
    baseObstacles: 5,
    levelOffset: 12,
    growthDivisor: 3,
    obstacleVariance: 2,
  },
  {
    kind: 'settings',
    maxObstacleFloor: 5,
    maxObstacleRatio: 0.25,
    reservedCells: 4,
    minGoalDistanceRatio: 0.5,
    maxGoalDistanceRatio: 0.9,
  },
];

export function getRoboPathProfile(
  items: readonly RoboPathProgressionItem[],
  profile: RoboPathProgressionProfile,
): RoboPathProfileItem {
  const item = items.find(
    (entry): entry is RoboPathProfileItem => entry.kind === 'profile' && entry.profile === profile,
  );
  if (!item) {
    throw new Error(`No robo path profile found for ${profile}`);
  }
  return item;
}

export function getRoboPathGridStage(
  items: readonly RoboPathProgressionItem[],
  level: number,
): RoboPathGridStageItem {
  const item = items.find(
    (entry): entry is RoboPathGridStageItem =>
      entry.kind === 'grid_stage' &&
      level >= entry.minLevel &&
      (entry.maxLevel === undefined || level <= entry.maxLevel),
  );
  if (!item) {
    throw new Error(`No robo path grid stage found for level ${level}`);
  }
  return item;
}

export function getRoboPathObstacleStage(
  items: readonly RoboPathProgressionItem[],
  level: number,
): RoboPathObstacleStageItem {
  const item = items.find(
    (entry): entry is RoboPathObstacleStageItem =>
      entry.kind === 'obstacle_stage' &&
      level >= entry.minLevel &&
      (entry.maxLevel === undefined || level <= entry.maxLevel),
  );
  if (!item) {
    throw new Error(`No robo path obstacle stage found for level ${level}`);
  }
  return item;
}

export function getRoboPathSettings(
  items: readonly RoboPathProgressionItem[],
): RoboPathGenerationSettingsItem {
  const item = items.find(
    (entry): entry is RoboPathGenerationSettingsItem => entry.kind === 'settings',
  );
  if (!item) {
    throw new Error('No robo path generation settings found');
  }
  return item;
}

export function getRoboPathGridSize(
  items: readonly RoboPathProgressionItem[],
  profile: RoboPathProgressionProfile,
  level: number,
): number {
  const profileItem = getRoboPathProfile(items, profile);
  const stage = getRoboPathGridStage(items, level);
  return Math.min(profileItem.baseGrid + stage.gridGrowth, profileItem.maxGrid);
}

export const MATH_GRID_NAVIGATION_PACK: ContentPack<RoboPathProgressionItem> = {
  id: 'math.grid_navigation.core',
  skillId: MATH_GRID_NAVIGATION_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: {
    et: 'Ruudustikul liikumise astmestik',
    en: 'Grid navigation progression',
  },
  items: ITEMS,
};
