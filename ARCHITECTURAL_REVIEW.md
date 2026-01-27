# Architectural Review & Scalability Recommendations

**Date:** 2026-01-27  
**Reviewer:** Expert Solution Architect & Game Engineer  
**Purpose:** Prepare codebase for scaling to more games, database integration, authentication, payments, and additional features

---

## Executive Summary

Your codebase demonstrates **excellent architectural foundations** with clear separation of concerns, type safety, and modular design. However, to scale to 50+ games, add database persistence, authentication, payments, and enterprise features, several strategic changes are needed.

**Current State:** ✅ Well-structured MVP  
**Target State:** 🎯 Enterprise-ready educational platform

---

## 1. Current Architecture Strengths ✅

### 1.1 Excellent Separation of Concerns
- **Engine layer** (`src/engine/`) is pure business logic - ✅ Perfect
- **Feature-based structure** (`src/features/`) - ✅ Scalable
- **Component modularity** - ✅ Individual game views are isolated
- **Type safety** - ✅ Strong TypeScript usage

### 1.2 State Management
- **Zustand stores** properly split (persistent vs session) - ✅ Good pattern
- **LocalStorage persistence** works for MVP - ✅ Appropriate for current scale

### 1.3 Internationalization
- **Type-safe i18n system** - ✅ Excellent foundation
- **Easy to add languages** - ✅ Well-designed

### 1.4 Testing
- **Engine tests** with good coverage - ✅ Critical logic protected
- **Component tests** - ✅ UI tested

---

## 2. Critical Scalability Issues 🔴

### 2.1 Game Registration System (HIGH PRIORITY)

**Current Problem:**
```typescript
// GameRenderer.tsx - Manual switch statement
switch (baseGameType) {
  case 'word_builder':
    return <WordGameView ... />;
  case 'memory_math':
    return <MemoryGameView ... />;
  // ... 10+ more cases
}
```

**Issues:**
- ❌ Adding a new game requires modifying `GameRenderer.tsx`
- ❌ No dynamic game loading
- ❌ No plugin/registry system
- ❌ Hard to support 50+ games

**Solution: Game Registry Pattern**

Create a centralized game registry that auto-discovers and registers games:

```typescript
// src/games/registry.ts
export interface GameRegistryEntry {
  id: string;
  component: React.ComponentType<GameViewProps>;
  generator: GeneratorFunction;
  config: GameConfig;
  validator: (problem: Problem, answer: unknown) => boolean;
}

class GameRegistry {
  private games = new Map<string, GameRegistryEntry>();
  
  register(entry: GameRegistryEntry) {
    this.games.set(entry.id, entry);
  }
  
  get(id: string): GameRegistryEntry | undefined {
    return this.games.get(id);
  }
  
  getAll(): GameRegistryEntry[] {
    return Array.from(this.games.values());
  }
}

export const gameRegistry = new GameRegistry();
```

**Implementation Steps:**
1. Create `src/games/registry.ts`
2. Each game exports its own registration:
   ```typescript
   // src/games/wordBuilder/index.ts
   import { gameRegistry } from '../registry';
   import { WordGameView } from '../../components/gameViews/WordGameView';
   import { generateWordBuilder } from '../../games/generators';
   
   gameRegistry.register({
     id: 'word_builder',
     component: WordGameView,
     generator: generateWordBuilder,
     config: GAME_CONFIG.word_builder,
     validator: validateWordBuilder,
   });
   ```
3. Update `GameRenderer` to use registry:
   ```typescript
   const entry = gameRegistry.get(baseGameType);
   if (!entry) return <ErrorView />;
   const Component = entry.component;
   return <Component problem={problem} onAnswer={onAnswer} ... />;
   ```

**Benefits:**
- ✅ Zero-touch game addition (just create files)
- ✅ Supports dynamic loading
- ✅ Enables game plugins/packages
- ✅ Scales to 100+ games

---

### 2.2 Data Persistence Layer (HIGH PRIORITY)

**Current Problem:**
- ❌ All data in LocalStorage only
- ❌ No cloud sync
- ❌ No multi-device support
- ❌ No backup/recovery
- ❌ No analytics data collection

**Solution: Abstract Persistence Layer**

Create a persistence abstraction that supports both LocalStorage (current) and API (future):

```typescript
// src/services/persistence/types.ts
export interface PersistenceAdapter {
  save(key: string, data: unknown): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  sync?(): Promise<void>; // For cloud sync
}

// src/services/persistence/localStorageAdapter.ts
export class LocalStorageAdapter implements PersistenceAdapter {
  async save(key: string, data: unknown): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
  }
  // ...
}

// src/services/persistence/apiAdapter.ts
export class ApiAdapter implements PersistenceAdapter {
  constructor(private apiClient: ApiClient) {}
  
  async save(key: string, data: unknown): Promise<void> {
    await this.apiClient.put(`/user/data/${key}`, data);
  }
  // ...
}

// src/services/persistence/index.ts
export class PersistenceService {
  private adapter: PersistenceAdapter;
  
  constructor(adapter: PersistenceAdapter) {
    this.adapter = adapter;
  }
  
  async saveGameState(state: GameStore): Promise<void> {
    await this.adapter.save('gameState', state);
  }
  
  async loadGameState(): Promise<GameStore | null> {
    return this.adapter.load<GameStore>('gameState');
  }
}
```

**Migration Strategy:**
1. Create persistence abstraction (Phase 1)
2. Keep LocalStorage as default adapter
3. Add API adapter when backend is ready
4. Implement hybrid mode (LocalStorage + API sync)

---

### 2.3 API Service Layer (HIGH PRIORITY)

**Current Problem:**
- ❌ No API abstraction
- ❌ No HTTP client
- ❌ No request/response types
- ❌ No error handling for network calls

**Solution: Create API Service Layer**

```typescript
// src/services/api/client.ts
export class ApiClient {
  private baseURL: string;
  private token?: string;
  
  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
  }
  
  setAuthToken(token: string) {
    this.token = token;
  }
  
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
  
  async post<T>(path: string, data: unknown): Promise<T> {
    // ...
  }
  
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }
  
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }
    return response.json();
  }
}

// src/services/api/endpoints.ts
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  user: {
    profile: '/user/profile',
    progress: '/user/progress',
    achievements: '/user/achievements',
  },
  games: {
    list: '/games',
    config: (id: string) => `/games/${id}/config`,
    stats: (id: string) => `/games/${id}/stats`,
  },
  payments: {
    subscriptions: '/payments/subscriptions',
    purchase: '/payments/purchase',
    webhook: '/payments/webhook',
  },
};
```

**Benefits:**
- ✅ Centralized API logic
- ✅ Easy to add authentication
- ✅ Type-safe endpoints
- ✅ Consistent error handling

---

### 2.4 Authentication System (MEDIUM PRIORITY)

**Current Problem:**
- ❌ No user accounts
- ❌ No authentication
- ❌ No user profiles
- ❌ No multi-user support

**Solution: Auth Service with JWT**

```typescript
// src/services/auth/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  subscription?: SubscriptionStatus;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// src/services/auth/authService.ts
export class AuthService {
  constructor(private apiClient: ApiClient) {}
  
  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post<{ user: User; token: string }>(
      apiEndpoints.auth.login,
      { email, password }
    );
    
    this.setToken(response.token);
    return response.user;
  }
  
  async register(data: RegisterData): Promise<User> {
    // ...
  }
  
  async logout(): Promise<void> {
    this.clearToken();
    await apiClient.post(apiEndpoints.auth.logout, {});
  }
  
  private setToken(token: string) {
    localStorage.setItem('auth_token', token);
    this.apiClient.setAuthToken(token);
  }
  
  private clearToken() {
    localStorage.removeItem('auth_token');
    this.apiClient.setAuthToken('');
  }
}

// src/stores/authStore.ts
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user: User) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
```

**Integration Points:**
- Update `gameStore` to sync with user profile
- Add auth guards to protected routes
- Implement token refresh logic

---

### 2.5 Database Schema Design (MEDIUM PRIORITY)

**Recommended Database Structure:**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles (age groups)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  profile_type VARCHAR(50) NOT NULL, -- 'starter' | 'advanced'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game progress
CREATE TABLE game_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  game_type VARCHAR(100) NOT NULL,
  profile_type VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  stats JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_type, profile_type)
);

-- Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_id VARCHAR(100) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Game sessions
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  game_type VARCHAR(100) NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  score INTEGER DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tier VARCHAR(50) NOT NULL, -- 'free' | 'premium' | 'family'
  status VARCHAR(50) NOT NULL, -- 'active' | 'cancelled' | 'expired'
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  payment_provider VARCHAR(50),
  external_id VARCHAR(255)
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) NOT NULL,
  provider VARCHAR(50),
  external_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**TypeScript Types:**

```typescript
// src/types/database.ts
export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface DbGameProgress {
  id: string;
  user_id: string;
  game_type: string;
  profile_type: ProfileType;
  level: number;
  stats: Stats;
  updated_at: Date;
}

// ... more types
```

---

### 2.6 Payment Integration (MEDIUM PRIORITY)

**Current State:**
- ✅ Monetization structure exists
- ❌ No actual payment processing
- ❌ No subscription management

**Solution: Payment Service Abstraction**

```typescript
// src/services/payments/types.ts
export interface PaymentProvider {
  createSubscription(data: CreateSubscriptionData): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  processWebhook(payload: unknown): Promise<WebhookEvent>;
}

// src/services/payments/stripeProvider.ts
export class StripeProvider implements PaymentProvider {
  constructor(private stripe: Stripe) {}
  
  async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
    // Stripe integration
  }
}

// src/services/payments/paymentService.ts
export class PaymentService {
  constructor(private provider: PaymentProvider, private apiClient: ApiClient) {}
  
  async subscribe(tier: SubscriptionTier): Promise<Subscription> {
    const subscription = await this.provider.createSubscription({
      tier,
      userId: this.getCurrentUserId(),
    });
    
    // Sync with backend
    await this.apiClient.post(apiEndpoints.payments.subscriptions, subscription);
    
    return subscription;
  }
}
```

**Recommended Providers:**
- **Stripe** - Best for subscriptions, webhooks, international
- **Paddle** - Good for EU, handles VAT
- **RevenueCat** - Mobile-first, cross-platform

---

### 2.7 Game Data Management (LOW PRIORITY)

**Current Problem:**
- ❌ Game data hardcoded in `data.ts`
- ❌ No CMS for content updates
- ❌ Difficult to A/B test game configurations

**Solution: Content Management API**

```typescript
// src/services/content/types.ts
export interface GameContent {
  id: string;
  config: GameConfig;
  wordDatabase: WordObject[];
  scenes: Record<string, Scene>;
  metadata: {
    version: number;
    updatedAt: Date;
    locale: SupportedLocale;
  };
}

// src/services/content/contentService.ts
export class ContentService {
  async getGameContent(gameId: string, locale: SupportedLocale): Promise<GameContent> {
    // Fetch from API or cache
  }
  
  async updateGameContent(gameId: string, content: Partial<GameContent>): Promise<void> {
    // Admin-only endpoint
  }
}
```

**Benefits:**
- ✅ Update game content without code deployment
- ✅ A/B test different configurations
- ✅ Multi-language content management
- ✅ Version control for content

---

## 3. Recommended File Structure Changes

### 3.1 New Directories

```
src/
├── services/              # NEW: Service layer
│   ├── api/              # API client, endpoints
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── types.ts
│   ├── auth/             # Authentication
│   │   ├── authService.ts
│   │   ├── authStore.ts
│   │   └── types.ts
│   ├── persistence/      # Data persistence abstraction
│   │   ├── persistenceService.ts
│   │   ├── localStorageAdapter.ts
│   │   ├── apiAdapter.ts
│   │   └── types.ts
│   ├── payments/         # Payment processing
│   │   ├── paymentService.ts
│   │   ├── stripeProvider.ts
│   │   └── types.ts
│   └── content/          # Content management
│       ├── contentService.ts
│       └── types.ts
├── games/                # MODIFIED: Add registry
│   ├── registry.ts       # NEW: Game registry
│   ├── wordBuilder/      # NEW: Game packages
│   │   ├── index.ts      # Auto-registers game
│   │   ├── config.ts
│   │   └── generator.ts
│   └── ...
├── stores/               # MODIFIED: Add auth store
│   ├── authStore.ts      # NEW: Authentication state
│   ├── gameStore.ts      # MODIFIED: Sync with API
│   └── playSessionStore.ts
└── types/                # MODIFIED: Add database types
    ├── database.ts       # NEW: DB schema types
    ├── api.ts            # NEW: API request/response types
    └── ...
```

---

## 4. Migration Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Prepare infrastructure without breaking current functionality

1. ✅ Create API service layer (no-op implementation)
2. ✅ Create persistence abstraction (LocalStorage adapter)
3. ✅ Create game registry system
4. ✅ Migrate existing games to registry pattern
5. ✅ Add database type definitions

**Deliverables:**
- API client ready (not used yet)
- Persistence service ready (uses LocalStorage)
- Game registry working
- All existing games registered

---

### Phase 2: Backend Integration (Weeks 3-4)
**Goal:** Add backend API without disrupting users

1. ✅ Implement authentication service
2. ✅ Create auth store
3. ✅ Add API adapter for persistence
4. ✅ Implement hybrid persistence (LocalStorage + API)
5. ✅ Add user profile sync

**Deliverables:**
- Users can log in/register
- Data syncs to backend
- LocalStorage fallback works
- Multi-device support

---

### Phase 3: Payments (Weeks 5-6)
**Goal:** Enable monetization

1. ✅ Integrate payment provider (Stripe recommended)
2. ✅ Implement subscription management
3. ✅ Add payment webhook handling
4. ✅ Update monetization store
5. ✅ Add subscription UI

**Deliverables:**
- Users can subscribe
- Payment processing works
- Subscription status synced
- Feature flags respect subscriptions

---

### Phase 4: Scaling (Weeks 7-8)
**Goal:** Support 50+ games and advanced features

1. ✅ Implement content management API
2. ✅ Add analytics service
3. ✅ Create admin dashboard (optional)
4. ✅ Add A/B testing infrastructure
5. ✅ Performance optimizations

**Deliverables:**
- Easy to add new games
- Content can be updated via API
- Analytics tracking
- Admin tools (if needed)

---

## 5. Code Examples

### 5.1 Game Registry Implementation

```typescript
// src/games/registry.ts
import type { GameConfig, Problem, GeneratorFunction } from '../types/game';
import type { ComponentType } from 'react';

export interface GameViewProps {
  problem: Problem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
  level?: number;
  onMove?: (direction: Direction) => void;
}

export interface GameRegistryEntry {
  id: string;
  component: ComponentType<GameViewProps>;
  generator: GeneratorFunction;
  config: GameConfig;
  validator: (problem: Problem, answer: unknown) => boolean;
  allowedProfiles: ProfileType[];
}

class GameRegistry {
  private games = new Map<string, GameRegistryEntry>();
  
  register(entry: GameRegistryEntry): void {
    if (this.games.has(entry.id)) {
      console.warn(`Game ${entry.id} is already registered`);
    }
    this.games.set(entry.id, entry);
  }
  
  get(id: string): GameRegistryEntry | undefined {
    return this.games.get(id);
  }
  
  getAll(): GameRegistryEntry[] {
    return Array.from(this.games.values());
  }
  
  getByProfile(profile: ProfileType): GameRegistryEntry[] {
    return this.getAll().filter(g => g.allowedProfiles.includes(profile));
  }
}

export const gameRegistry = new GameRegistry();

// Auto-register games on import
import './wordBuilder';
import './memoryMath';
// ... other games
```

### 5.2 Updated GameRenderer

```typescript
// src/features/gameplay/GameRenderer.tsx
import { gameRegistry } from '../../games/registry';

export const GameRenderer: React.FC<GameRendererProps> = ({ 
  gameType, 
  problem, 
  onAnswer, 
  onMove, 
  soundEnabled, 
  level 
}) => {
  const baseGameType = gameType.replace('_adv', '');
  const entry = gameRegistry.get(baseGameType);
  
  if (!entry) {
    return (
      <div className="text-center p-8 text-red-600">
        Unknown game type: "{gameType}"
      </div>
    );
  }
  
  const Component = entry.component;
  return (
    <Component
      problem={problem}
      onAnswer={onAnswer}
      onMove={onMove}
      soundEnabled={soundEnabled}
      level={level}
    />
  );
};
```

### 5.3 Persistence Service Usage

```typescript
// src/stores/gameStore.ts (modified)
import { persistenceService } from '../services/persistence';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ... existing state
      
      // Modified actions to use persistence service
      recordAnswer: async (isCorrect: boolean, points: number = 0) => {
        const state = get();
        // ... existing logic
        
        // Save to persistence (LocalStorage or API)
        await persistenceService.saveGameState({
          ...state,
          stats: updatedStats,
        });
        
        return { newAchievements: achievementData };
      },
    }),
    {
      // Keep LocalStorage as fallback
      name: APP_KEY,
      // ... existing config
    }
  )
);
```

---

## 6. Testing Strategy

### 6.1 Service Layer Tests

```typescript
// src/services/api/__tests__/client.test.ts
describe('ApiClient', () => {
  it('should add auth token to headers', async () => {
    const client = new ApiClient({ baseURL: 'https://api.example.com' });
    client.setAuthToken('test-token');
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });
    
    await client.get('/test');
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });
});
```

### 6.2 Game Registry Tests

```typescript
// src/games/__tests__/registry.test.ts
describe('GameRegistry', () => {
  it('should register and retrieve games', () => {
    const entry: GameRegistryEntry = {
      id: 'test_game',
      component: TestGameView,
      generator: testGenerator,
      config: testConfig,
      validator: testValidator,
      allowedProfiles: ['starter'],
    };
    
    gameRegistry.register(entry);
    const retrieved = gameRegistry.get('test_game');
    
    expect(retrieved).toEqual(entry);
  });
});
```

---

## 7. Performance Considerations

### 7.1 Code Splitting

```typescript
// Lazy load game components
const WordGameView = lazy(() => import('../../components/gameViews/WordGameView'));
const MemoryGameView = lazy(() => import('../../components/gameViews/MemoryGameView'));

// In GameRenderer
const Component = lazy(() => 
  Promise.resolve({ default: entry.component })
);
```

### 7.2 Data Caching

```typescript
// src/services/api/cache.ts
class ApiCache {
  private cache = new Map<string, { data: unknown; expires: number }>();
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || entry.expires < Date.now()) {
      return null;
    }
    return entry.data as T;
  }
  
  set(key: string, data: unknown, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }
}
```

---

## 8. Security Considerations

### 8.1 Authentication
- ✅ Use JWT tokens with expiration
- ✅ Implement token refresh
- ✅ Store tokens securely (httpOnly cookies preferred)
- ✅ Validate tokens on every API request

### 8.2 Data Protection
- ✅ Encrypt sensitive data (payment info, personal data)
- ✅ Use HTTPS for all API calls
- ✅ Implement rate limiting
- ✅ Validate all user inputs

### 8.3 Payment Security
- ✅ Never store credit card data
- ✅ Use PCI-compliant payment providers
- ✅ Validate webhook signatures
- ✅ Implement idempotency for payments

---

## 9. Monitoring & Analytics

### 9.1 Analytics Service

```typescript
// src/services/analytics/analyticsService.ts
export class AnalyticsService {
  trackEvent(event: string, properties?: Record<string, unknown>): void {
    // Send to analytics provider (e.g., Google Analytics, Mixpanel)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
  }
  
  trackGameStart(gameType: string): void {
    this.trackEvent('game_start', { game_type: gameType });
  }
  
  trackAnswer(gameType: string, isCorrect: boolean): void {
    this.trackEvent('answer_submitted', {
      game_type: gameType,
      is_correct: isCorrect,
    });
  }
}
```

### 9.2 Error Tracking

```typescript
// src/services/monitoring/errorTracking.ts
export class ErrorTrackingService {
  captureException(error: Error, context?: Record<string, unknown>): void {
    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, { extra: context });
    }
  }
}
```

---

## 10. Summary of Required Changes

### Immediate (Phase 1)
1. ✅ Create `src/services/` directory structure
2. ✅ Implement game registry system
3. ✅ Migrate games to registry pattern
4. ✅ Create persistence abstraction
5. ✅ Add database type definitions

### Short-term (Phase 2-3)
1. ✅ Implement authentication system
2. ✅ Add API service layer
3. ✅ Integrate payment provider
4. ✅ Add subscription management

### Long-term (Phase 4+)
1. ✅ Content management API
2. ✅ Analytics infrastructure
3. ✅ Admin dashboard
4. ✅ A/B testing framework

---

## 11. Breaking Changes & Migration

### 11.1 Game Registration
**Breaking:** Games must be registered via registry  
**Migration:** Update all games to use registry pattern

### 11.2 State Persistence
**Non-breaking:** LocalStorage remains default  
**Migration:** Gradually migrate to API sync

### 11.3 Authentication
**Breaking:** Users will need to create accounts  
**Migration:** Provide guest mode initially, then require login

---

## 12. Estimated Effort

| Phase | Duration | Complexity | Risk |
|-------|----------|------------|------|
| Phase 1: Foundation | 2 weeks | Medium | Low |
| Phase 2: Backend | 2 weeks | High | Medium |
| Phase 3: Payments | 2 weeks | Medium | Medium |
| Phase 4: Scaling | 2 weeks | Low | Low |
| **Total** | **8 weeks** | - | - |

---

## Conclusion

Your codebase has **excellent foundations**. The recommended changes will:

1. ✅ **Scale to 50+ games** via registry system
2. ✅ **Support database persistence** via abstraction layer
3. ✅ **Enable authentication** with proper service layer
4. ✅ **Integrate payments** with existing monetization structure
5. ✅ **Maintain code quality** with type safety and testing

**Next Steps:**
1. Review this document
2. Prioritize phases based on business needs
3. Start with Phase 1 (foundation) - lowest risk
4. Iterate based on user feedback

**Questions or concerns?** Let's discuss specific implementation details.
