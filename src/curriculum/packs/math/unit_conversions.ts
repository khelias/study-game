import type { ContentPack } from '../../types';
import { MATH_UNIT_CONVERSIONS_SKILL } from '../../skills/math';

export type UnitConversionCategory = 'length' | 'mass' | 'volume';

export interface UnitConversionItem {
  category: UnitConversionCategory;
  from: string;
  to: string;
  factor: number;
  emoji: string;
}

const ITEMS: readonly UnitConversionItem[] = [
  { category: 'length', from: 'm', to: 'cm', factor: 100, emoji: '📏' },
  { category: 'length', from: 'km', to: 'm', factor: 1000, emoji: '📐' },
  { category: 'length', from: 'cm', to: 'mm', factor: 10, emoji: '📏' },
  { category: 'mass', from: 'kg', to: 'g', factor: 1000, emoji: '⚖️' },
  { category: 'mass', from: 't', to: 'kg', factor: 1000, emoji: '🏋️' },
  { category: 'volume', from: 'l', to: 'ml', factor: 1000, emoji: '🧪' },
  { category: 'volume', from: 'l', to: 'dl', factor: 10, emoji: '🥛' },
];

export function getUnitConversionsByCategory(
  items: readonly UnitConversionItem[],
): Record<UnitConversionCategory, UnitConversionItem[]> {
  return {
    length: items.filter((item) => item.category === 'length'),
    mass: items.filter((item) => item.category === 'mass'),
    volume: items.filter((item) => item.category === 'volume'),
  };
}

export const MATH_UNIT_CONVERSIONS_PACK: ContentPack<UnitConversionItem> = {
  id: 'math.unit_conversions.core',
  skillId: MATH_UNIT_CONVERSIONS_SKILL.id,
  locale: 'et',
  version: '1.0.0',
  title: {
    et: 'Ühikute teisendused',
    en: 'Unit conversions',
  },
  items: ITEMS,
};
