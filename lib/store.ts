'use client'

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
}

interface UniverseState {
  // User state
  currentUser: Profile | null
  partner: Profile | null
  isLoggedIn: boolean
  
  // Universe state
  loveMeter: number
  chaosLevel: number
  adventurePoints: number
  heartsSent: number
  daysTogether: number
  relationshipStartDate: string
  
  // UI state
  currentWorld: string
  isLoading: boolean
  showParticles: boolean
  soundEnabled: boolean
  
  // Discoveries
  discoveries: string[]
  achievements: string[]
  
  // Actions
  setCurrentUser: (user: Profile | null) => void
  setPartner: (partner: Profile | null) => void
  setLoggedIn: (status: boolean) => void
  setLoveMeter: (value: number) => void
  incrementHeartsSent: () => void
  setCurrentWorld: (world: string) => void
  setLoading: (loading: boolean) => void
  toggleParticles: () => void
  toggleSound: () => void
  addDiscovery: (discovery: string) => void
  addAchievement: (achievement: string) => void
  incrementChaos: () => void
  incrementAdventure: (points: number) => void
}

export const useUniverseStore = create<UniverseState>()(
  persist(
    (set) => ({
      // Initial state
      currentUser: null,
      partner: null,
      isLoggedIn: false,
      loveMeter: 100,
      chaosLevel: 50,
      adventurePoints: 0,
      heartsSent: 0,
      daysTogether: 0,
      relationshipStartDate: '2024-01-01',
      currentWorld: 'home',
      isLoading: false,
      showParticles: true,
      soundEnabled: true,
      discoveries: [],
      achievements: [],
      
      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setPartner: (partner) => set({ partner }),
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      setLoveMeter: (value) => set({ loveMeter: Math.min(100, Math.max(0, value)) }),
      incrementHeartsSent: () => set((state) => ({ heartsSent: state.heartsSent + 1 })),
      setCurrentWorld: (world) => set({ currentWorld: world }),
      setLoading: (loading) => set({ isLoading: loading }),
      toggleParticles: () => set((state) => ({ showParticles: !state.showParticles })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      addDiscovery: (discovery) => set((state) => ({
        discoveries: state.discoveries.includes(discovery) 
          ? state.discoveries 
          : [...state.discoveries, discovery]
      })),
      addAchievement: (achievement) => set((state) => ({
        achievements: state.achievements.includes(achievement)
          ? state.achievements
          : [...state.achievements, achievement]
      })),
      incrementChaos: () => set((state) => ({ 
        chaosLevel: Math.min(100, state.chaosLevel + 5) 
      })),
      incrementAdventure: (points) => set((state) => ({ 
        adventurePoints: state.adventurePoints + points 
      })),
    }),
    {
      name: 'lampy-rose-universe',
      partialize: (state) => ({
        discoveries: state.discoveries,
        achievements: state.achievements,
        soundEnabled: state.soundEnabled,
        showParticles: state.showParticles,
      }),
    }
  )
)
