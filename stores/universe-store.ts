import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Profile {
  id: string
  display_name: string
  avatar_url?: string
  mood: string
  status: string
  favorite_color: string
  bio?: string
  relationship_start_date: string
}

interface UniverseState {
  // User state
  currentUser: Profile | null
  partner: Profile | null
  setCurrentUser: (user: Profile | null) => void
  setPartner: (partner: Profile | null) => void
  
  // Universe state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Love meter and stats
  loveMeter: number
  chaosLevel: number
  adventurePoints: number
  heartsShared: number
  setLoveMeter: (value: number) => void
  setChaosLevel: (value: number) => void
  incrementHearts: () => void
  
  // Current mood
  currentMood: string
  setCurrentMood: (mood: string) => void
  
  // Discovered secrets
  discoveredSecrets: string[]
  addDiscoveredSecret: (secret: string) => void
  
  // Achievements
  unlockedAchievements: string[]
  unlockAchievement: (achievement: string) => void
  
  // Weather/atmosphere mode
  weatherMode: 'stars' | 'rain' | 'snow' | 'petals' | 'hearts'
  setWeatherMode: (mode: 'stars' | 'rain' | 'snow' | 'petals' | 'hearts') => void
  
  // Sound enabled
  soundEnabled: boolean
  toggleSound: () => void
  
  // Night mode intensity
  nightIntensity: number
  setNightIntensity: (value: number) => void
}

export const useUniverseStore = create<UniverseState>()(
  persist(
    (set) => ({
      // User state
      currentUser: null,
      partner: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      setPartner: (partner) => set({ partner }),
      
      // Universe state
      isLoading: true,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Love meter and stats
      loveMeter: 100,
      chaosLevel: 50,
      adventurePoints: 0,
      heartsShared: 0,
      setLoveMeter: (value) => set({ loveMeter: Math.min(100, Math.max(0, value)) }),
      setChaosLevel: (value) => set({ chaosLevel: Math.min(100, Math.max(0, value)) }),
      incrementHearts: () => set((state) => ({ heartsShared: state.heartsShared + 1 })),
      
      // Current mood
      currentMood: 'happy',
      setCurrentMood: (mood) => set({ currentMood: mood }),
      
      // Discovered secrets
      discoveredSecrets: [],
      addDiscoveredSecret: (secret) => set((state) => ({
        discoveredSecrets: state.discoveredSecrets.includes(secret) 
          ? state.discoveredSecrets 
          : [...state.discoveredSecrets, secret]
      })),
      
      // Achievements
      unlockedAchievements: [],
      unlockAchievement: (achievement) => set((state) => ({
        unlockedAchievements: state.unlockedAchievements.includes(achievement)
          ? state.unlockedAchievements
          : [...state.unlockedAchievements, achievement]
      })),
      
      // Weather mode
      weatherMode: 'stars',
      setWeatherMode: (mode) => set({ weatherMode: mode }),
      
      // Sound
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      // Night intensity
      nightIntensity: 80,
      setNightIntensity: (value) => set({ nightIntensity: value }),
    }),
    {
      name: 'lampy-rose-universe',
    }
  )
)
