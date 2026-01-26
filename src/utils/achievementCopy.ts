import type { Translations } from '../i18n';

export const getAchievementCopy = (t: Translations, id: string): { title: string; desc: string } => {
  const item = t.achievements.items[id as keyof typeof t.achievements.items];
  if (item) {
    return { title: item.title, desc: item.desc };
  }
  return { title: id, desc: '' };
};
