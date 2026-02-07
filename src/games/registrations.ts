/**
 * Game Registrations
 * 
 * This file registers all games with the game registry.
 * To add a new game:
 * 1. Create the game view component
 * 2. Create the generator function
 * 3. Create the validator function
 * 4. Add registration here
 * 
 * Games are automatically registered when this module is imported.
 */

import { gameRegistry } from './registry';
import { GAME_CONFIG } from './data';
import { Generators } from './generators';
import {
  BalanceScaleView,
  StandardGameView,
  WordGameView,
  WordCascadeView,
  PatternTrainView,
  MemoryGameView,
  RoboPathView,
  SyllableGameView,
  TimeGameView,
  UnitConversionView,
  StarMapperView,
  ShapeShiftView,
  BattleLearnView,
} from '../components/gameViews';
import { MathSnakeView } from '../components/MathSnakeView';
import { CompareSizesView } from '../components/CompareSizesView';
import {
  validateWordBuilder,
  validateWordCascade,
  validateSyllableBuilder,
  validateLetterMatch,
  validateSentenceLogic,
  validatePattern,
  validateTimeMatch,
  validateBalanceScale,
  validateUnitConversion,
  validateCompareSizes,
  validateMathSnake,
  validateMemoryMath,
  validateRoboPath,
  validateStarMapper,
  validateShapeShift,
  validateBattleLearn,
} from './validators';

/**
 * Register all games with the registry
 * 
 * This function is called automatically when the module is imported.
 */
function registerAllGames(): void {
  // Word Builder
  const wordBuilderConfig = GAME_CONFIG.word_builder;
  const wordBuilderGenerator = Generators.word_builder;
  if (!wordBuilderConfig || !wordBuilderGenerator) {
    console.error('Missing word_builder config or generator');
    return;
  }
  gameRegistry.register({
    id: 'word_builder',
    component: WordGameView,
    generator: wordBuilderGenerator,
    config: wordBuilderConfig,
    validator: validateWordBuilder,
    allowedProfiles: wordBuilderConfig.allowedProfiles,
  });

  // Word Cascade
  const wordCascadeConfig = GAME_CONFIG.word_cascade;
  const wordCascadeGenerator = Generators.word_cascade;
  if (wordCascadeConfig && wordCascadeGenerator) {
    gameRegistry.register({
      id: 'word_cascade',
      component: WordCascadeView,
      generator: wordCascadeGenerator,
      config: wordCascadeConfig,
      validator: validateWordCascade,
      allowedProfiles: wordCascadeConfig.allowedProfiles,
    });
  }

  // Syllable Builder
  const syllableBuilderConfig = GAME_CONFIG.syllable_builder;
  const syllableBuilderGenerator = Generators.syllable_builder;
  if (syllableBuilderConfig && syllableBuilderGenerator) {
    gameRegistry.register({
      id: 'syllable_builder',
      component: SyllableGameView,
      generator: syllableBuilderGenerator,
      config: syllableBuilderConfig,
      validator: validateSyllableBuilder,
      allowedProfiles: syllableBuilderConfig.allowedProfiles,
    });
  }

  // Pattern Train
  const patternConfig = GAME_CONFIG.pattern;
  const patternGenerator = Generators.pattern;
  if (patternConfig && patternGenerator) {
    gameRegistry.register({
      id: 'pattern',
      component: PatternTrainView,
      generator: patternGenerator,
      config: patternConfig,
      validator: validatePattern,
      allowedProfiles: patternConfig.allowedProfiles,
    });
  }

  // Sentence Logic
  const sentenceLogicConfig = GAME_CONFIG.sentence_logic;
  const sentenceLogicGenerator = Generators.sentence_logic;
  if (sentenceLogicConfig && sentenceLogicGenerator) {
    gameRegistry.register({
      id: 'sentence_logic',
      component: StandardGameView,
      generator: sentenceLogicGenerator,
      config: sentenceLogicConfig,
      validator: validateSentenceLogic,
      allowedProfiles: sentenceLogicConfig.allowedProfiles,
    });
  }

  // Memory Math
  const memoryMathConfig = GAME_CONFIG.memory_math;
  const memoryMathGenerator = Generators.memory_math;
  if (memoryMathConfig && memoryMathGenerator) {
    gameRegistry.register({
      id: 'memory_math',
      component: MemoryGameView,
      generator: memoryMathGenerator,
      config: memoryMathConfig,
      validator: validateMemoryMath,
      allowedProfiles: memoryMathConfig.allowedProfiles,
    });
  }

  // Robo Path
  const roboPathConfig = GAME_CONFIG.robo_path;
  const roboPathGenerator = Generators.robo_path;
  if (roboPathConfig && roboPathGenerator) {
    gameRegistry.register({
      id: 'robo_path',
      component: RoboPathView,
      generator: roboPathGenerator,
      config: roboPathConfig,
      validator: validateRoboPath,
      allowedProfiles: roboPathConfig.allowedProfiles,
    });
  }

  // Math Snake
  const mathSnakeConfig = GAME_CONFIG.math_snake;
  const mathSnakeGenerator = Generators.math_snake;
  if (mathSnakeConfig && mathSnakeGenerator) {
    gameRegistry.register({
      id: 'math_snake',
      component: MathSnakeView,
      generator: mathSnakeGenerator,
      config: mathSnakeConfig,
      validator: validateMathSnake,
      allowedProfiles: mathSnakeConfig.allowedProfiles,
    });
  }

  // Letter Match
  const letterMatchConfig = GAME_CONFIG.letter_match;
  const letterMatchGenerator = Generators.letter_match;
  if (letterMatchConfig && letterMatchGenerator) {
    gameRegistry.register({
      id: 'letter_match',
      component: StandardGameView,
      generator: letterMatchGenerator,
      config: letterMatchConfig,
      validator: validateLetterMatch,
      allowedProfiles: letterMatchConfig.allowedProfiles,
    });
  }

  // Unit Conversion
  const unitConversionConfig = GAME_CONFIG.unit_conversion;
  const unitConversionGenerator = Generators.unit_conversion;
  if (unitConversionConfig && unitConversionGenerator) {
    gameRegistry.register({
      id: 'unit_conversion',
      component: UnitConversionView,
      generator: unitConversionGenerator,
      config: unitConversionConfig,
      validator: validateUnitConversion,
      allowedProfiles: unitConversionConfig.allowedProfiles,
    });
  }

  // Compare Sizes
  const compareSizesConfig = GAME_CONFIG.compare_sizes;
  const compareSizesGenerator = Generators.compare_sizes;
  if (compareSizesConfig && compareSizesGenerator) {
    gameRegistry.register({
      id: 'compare_sizes',
      component: CompareSizesView,
      generator: compareSizesGenerator,
      config: compareSizesConfig,
      validator: validateCompareSizes,
      allowedProfiles: compareSizesConfig.allowedProfiles,
    });
  }

  // Balance Scale (Advanced)
  const balanceScaleConfig = GAME_CONFIG.balance_scale;
  const balanceScaleGenerator = Generators.balance_scale;
  if (balanceScaleConfig && balanceScaleGenerator) {
    gameRegistry.register({
      id: 'balance_scale',
      component: BalanceScaleView,
      generator: balanceScaleGenerator,
      config: balanceScaleConfig,
      validator: validateBalanceScale,
      allowedProfiles: balanceScaleConfig.allowedProfiles,
    });
  }

  // Time Match (Advanced)
  const timeMatchConfig = GAME_CONFIG.time_match;
  const timeMatchGenerator = Generators.time_match;
  if (timeMatchConfig && timeMatchGenerator) {
    gameRegistry.register({
      id: 'time_match',
      component: TimeGameView,
      generator: timeMatchGenerator,
      config: timeMatchConfig,
      validator: validateTimeMatch,
      allowedProfiles: timeMatchConfig.allowedProfiles,
    });
  }

  // Star Mapper
  const starMapperConfig = GAME_CONFIG.star_mapper;
  const starMapperGenerator = Generators.star_mapper;
  if (starMapperConfig && starMapperGenerator) {
    gameRegistry.register({
      id: 'star_mapper',
      component: StarMapperView,
      generator: starMapperGenerator,
      config: starMapperConfig,
      validator: validateStarMapper,
      allowedProfiles: starMapperConfig.allowedProfiles,
    });
  }

  // Shape Shift
  const shapeShiftConfig = GAME_CONFIG.shape_shift;
  const shapeShiftGenerator = Generators.shape_shift;
  if (shapeShiftConfig && shapeShiftGenerator) {
    gameRegistry.register({
      id: 'shape_shift',
      component: ShapeShiftView,
      generator: shapeShiftGenerator,
      config: shapeShiftConfig,
      validator: validateShapeShift,
      allowedProfiles: shapeShiftConfig.allowedProfiles,
    });
  }

  // BattleLearn (profile-based difficulty in generator)
  const battlelearnConfig = GAME_CONFIG.battlelearn;
  const battlelearnGenerator = Generators.battlelearn;
  if (battlelearnConfig && battlelearnGenerator) {
    gameRegistry.register({
      id: 'battlelearn',
      component: BattleLearnView,
      generator: battlelearnGenerator,
      config: battlelearnConfig,
      validator: validateBattleLearn,
      allowedProfiles: battlelearnConfig.allowedProfiles,
    });
  }
}

// Auto-register games when module is imported
registerAllGames();
