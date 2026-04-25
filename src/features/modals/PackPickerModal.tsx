// PackPickerModal — opened from a mechanic card on MenuScreen.
// Lists the bindings inside that mechanic so the user can pick a content
// pack (skill). Each row → starts the corresponding game binding by id.
import React from 'react';
import { X, Type, type LucideIcon } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { FocusTrap } from '../../components/AccessibilityHelpers';
import type { GameConfig, MechanicConfig } from '../../types/game';

interface PackPickerModalProps {
  mechanicConfig: MechanicConfig;
  bindings: Array<{
    config: GameConfig;
    iconComponent: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
    level: number;
    highScore: number;
    isNew: boolean;
  }>;
  onSelect: (gameId: string) => void;
  onClose: () => void;
}

export const PackPickerModal: React.FC<PackPickerModalProps> = ({
  mechanicConfig,
  bindings,
  onSelect,
  onClose,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();

  const mechanicCopy = t.mechanics[mechanicConfig.id as keyof typeof t.mechanics];
  const mechanicTitle: string = (mechanicCopy?.title ?? mechanicConfig.title) as string;
  const heading = `${mechanicConfig.emoji ?? ''} ${formatText(mechanicTitle)}`.trim();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && onClose()}
    >
      <FocusTrap active={true}>
        <div
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col border-2 border-slate-200"
          style={{ margin: '0 auto' }}
        >
          <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {formatText(t.menuSpecific.choosePack)}
              </div>
              <h2 className="text-xl font-black text-slate-800 truncate">{heading}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex-shrink-0"
              aria-label={String(t.common.close)}
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <ul className="flex flex-col gap-2">
              {bindings.map(({ config, iconComponent, level, highScore, isNew }) => {
                const Icon = iconComponent || Type;
                const title: string = (t.games[config.id as keyof typeof t.games]?.title ??
                  config.title) as string;
                const desc: string = (t.games[config.id as keyof typeof t.games]?.desc ??
                  config.desc) as string;
                const difficultyText = config.difficulty
                  ? ((t.difficulty[config.difficulty as keyof typeof t.difficulty] ??
                      config.difficulty) as string)
                  : null;

                return (
                  <li key={config.id}>
                    <button
                      onClick={() => onSelect(config.id)}
                      className={`group relative w-full flex items-center gap-3 p-3 rounded-2xl border-2 ${config.theme.border} ${config.theme.bg} hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-left`}
                      aria-label={`${formatText(title)} - ${formatText(desc)}`}
                    >
                      {isNew && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow z-10 border-2 border-white">
                          {formatText(t.menuSpecific.newGame)}
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${config.theme.iconBg} ${config.theme.text} flex-shrink-0`}
                      >
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-black text-base ${config.theme.text} truncate`}>
                          {formatText(title)}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 truncate">
                          {formatText(desc)}
                        </div>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          {difficultyText && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                config.difficulty === 'easy'
                                  ? 'bg-green-100 text-green-700'
                                  : config.difficulty === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {formatText(difficultyText)}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-slate-500">
                            🏆 {highScore > 0 ? highScore : '-'}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${config.theme.iconBg} border-2 ${config.theme.border} flex-shrink-0`}
                      >
                        <span className="text-[9px] font-bold text-slate-500">
                          {formatText(t.game.level)}
                        </span>
                        <span className={`text-lg font-black ${config.theme.text}`}>{level}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
