import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/dsStore';
import { useQuizStore } from '../store/quizStore';

// Trigger the popup after 2.5 minutes (150 seconds)
const POPUP_THRESHOLD_SECONDS = 150;

export function useQuizTimer() {
  const currentScene = useAppStore(s => s.currentScene);
  const triggerPopup = useQuizStore(s => s.triggerPopup);
  const activeQuizType = useQuizStore(s => s.activeQuizType);
  
  const timerRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Reset timer when scene changes
    timerRef.current = 0;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only start timer if we are in an actual DSA scene (not landing page = 0)
    if (currentScene > 0) {
      intervalRef.current = setInterval(() => {
        // Pause timer if a quiz is currently open
        if (useQuizStore.getState().activeQuizType) return;
        
        timerRef.current += 1;
        
        if (timerRef.current >= POPUP_THRESHOLD_SECONDS) {
          triggerPopup(currentScene);
          clearInterval(intervalRef.current); // Stop timer once triggered
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentScene, triggerPopup]);
}
