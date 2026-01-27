/**
 * ShopModal Component
 * 
 * Modal for purchasing hearts with stars and buying stars (mocked as FREE for now).
 */

import React from 'react';
import { X, Heart, Star, ShoppingBag } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { useGameAudio } from '../../hooks/useGameAudio';
import { FocusTrap } from '../../components/AccessibilityHelpers';

interface ShopModalProps {
  onClose: () => void;
  openedFromNoHearts?: boolean; // If true, show a message about needing hearts to play
}

const HEART_COST_STARS = 10; // 10 stars = 1 heart
const MAX_HEARTS = 5;

export const ShopModal: React.FC<ShopModalProps> = ({ onClose, openedFromNoHearts = false }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const stars = useGameStore(state => state.stars);
  const hearts = useGameStore(state => state.hearts);
  const buyHeartsWithStars = useGameStore(state => state.buyHeartsWithStars);
  const buyStars = useGameStore(state => state.buyStars);
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const { playClick } = useGameAudio(soundEnabled);

  const canBuyHeart = stars >= HEART_COST_STARS && hearts < MAX_HEARTS;
  const heartsNeeded = MAX_HEARTS - hearts;

  const handleBuyHeart = () => {
    if (canBuyHeart) {
      playClick();
      const success = buyHeartsWithStars(1);
      if (success) {
        // Show success feedback (could add notification here)
      }
    }
  };

  const handleBuyStars = () => {
    playClick();
    buyStars(50); // Mock: give 50 stars for free
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        margin: 0,
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && onClose()}
    >
      <FocusTrap active={true}>
        <div 
          className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ margin: '0 auto' }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag size={24} className="text-purple-600" />
              <h2 className="text-2xl font-black text-slate-800">{formatText(t.shop.title)}</h2>
            </div>
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label={t.statsModal.close}
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="space-y-4">
            {/* No Hearts Warning */}
            {openedFromNoHearts && hearts <= 0 && (
              <div className="bg-red-50 border-2 border-red-300 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={20} className="text-red-500 fill-red-500" />
                  <span className="font-bold text-red-700">{formatText(t.shop.noHeartsToPlay)}</span>
                </div>
                <p className="text-sm text-red-600">{formatText(t.shop.buyHeartsToContinue)}</p>
              </div>
            )}

            {/* Current Resources */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-slate-700">{formatText(t.shop.yourStars)}</span>
                </div>
                <span className="text-2xl font-black text-yellow-700">{stars}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart size={20} className="text-red-500 fill-red-500" />
                  <span className="font-bold text-slate-700">{formatText(t.shop.yourHearts)}</span>
                </div>
                <span className="text-2xl font-black text-red-700">{hearts}/{MAX_HEARTS}</span>
              </div>
            </div>

            {/* Buy Hearts Section */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
              <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                {formatText(t.shop.buyHearts)}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {formatText(t.shop.buyHeartsDescription)}
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={handleBuyHeart}
                  disabled={!canBuyHeart}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    canBuyHeart
                      ? 'bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400 active:scale-95'
                      : 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart size={24} className="text-red-500 fill-red-500" />
                    <div className="text-left">
                      <div className="font-bold text-slate-800">{formatText(t.shop.buy1Heart)}</div>
                      <div className="text-sm text-slate-600">
                        {formatText(t.shop.cost)}: <span className="font-bold text-yellow-700">{HEART_COST_STARS} ⭐</span>
                      </div>
                    </div>
                  </div>
                  {!canBuyHeart && hearts >= MAX_HEARTS && (
                    <span className="text-xs text-slate-500">{formatText(t.shop.maxHearts)}</span>
                  )}
                  {!canBuyHeart && stars < HEART_COST_STARS && (
                    <span className="text-xs text-slate-500">{formatText(t.shop.notEnoughStars)}</span>
                  )}
                </button>

                {heartsNeeded > 1 && (
                  <button
                    onClick={() => {
                      if (stars >= HEART_COST_STARS * heartsNeeded) {
                        playClick();
                        buyHeartsWithStars(heartsNeeded);
                      }
                    }}
                    disabled={stars < HEART_COST_STARS * heartsNeeded}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      stars >= HEART_COST_STARS * heartsNeeded
                        ? 'bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400 active:scale-95'
                        : 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Heart size={24} className="text-red-500 fill-red-500" />
                      <div className="text-left">
                        <div className="font-bold text-slate-800">
                          {formatText(t.shop.buyHeartsCount).replace('{count}', String(heartsNeeded))}
                        </div>
                        <div className="text-sm text-slate-600">
                          {formatText(t.shop.cost)}: <span className="font-bold text-yellow-700">{HEART_COST_STARS * heartsNeeded} ⭐</span>
                        </div>
                      </div>
                    </div>
                    {stars < HEART_COST_STARS * heartsNeeded && (
                      <span className="text-xs text-slate-500">{formatText(t.shop.notEnoughStars)}</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Buy Stars Section (Mocked as FREE) */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
              <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                {formatText(t.shop.buyStars)}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {formatText(t.shop.buyStarsDescription)}
              </p>
              
              <button
                onClick={handleBuyStars}
                className="w-full p-4 rounded-xl border-2 bg-yellow-50 border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400 active:scale-95 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Star size={24} className="text-yellow-500 fill-yellow-500" />
                  <div className="text-left">
                    <div className="font-bold text-slate-800">{formatText(t.shop.buy50Stars)}</div>
                    <div className="text-sm text-slate-600">
                      {formatText(t.shop.price)}: <span className="font-bold text-green-600">{formatText(t.shop.free)}</span>
                    </div>
                  </div>
                </div>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {formatText(t.shop.free)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
