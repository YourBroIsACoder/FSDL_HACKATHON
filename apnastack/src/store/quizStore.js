import { create } from 'zustand'

export const useQuizStore = create((set, get) => ({
  activeQuizType: null, // 'popup' | 'concept' | null
  activeSceneId: null,
  completedPopups: [],  // Array of scene IDs that have already shown the popup

  triggerPopup: (sceneId) => {
    const { completedPopups } = get()
    if (!completedPopups.includes(sceneId)) {
      set({ activeQuizType: 'popup', activeSceneId: sceneId })
    }
  },

  openSelector: () => {
    set({ activeQuizType: 'selector' })
  },

  startConceptQuiz: (sceneId) => {
    set({ activeQuizType: 'concept', activeSceneId: sceneId })
  },

  closeQuiz: () => {
    const { activeQuizType, activeSceneId, completedPopups } = get()
    
    // If we are closing a popup, mark it as completed so it doesn't show again
    if (activeQuizType === 'popup') {
      if (!completedPopups.includes(activeSceneId)) {
        set({ completedPopups: [...completedPopups, activeSceneId] })
      }
    }
    
    set({ activeQuizType: null })
  }
}))
