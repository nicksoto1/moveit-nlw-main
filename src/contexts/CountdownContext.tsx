import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useContext,
} from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
  isActive: boolean;
  hasFinished: boolean;
  minutes: number;
  seconds: number;
  resetCountdown: () => void;
  startCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useContext(ChallengesContext);

  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  
  function startCountdown() {
    setIsActive(true);
  }
  
  function resetCountdown() {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setTime(25 * 60);
  }
  

  useEffect(() => {
    window.onbeforeunload = () => {
      if (isActive) {
        return "Você perderá o progresso do countdown até aqui, tem certeza?";
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      startNewChallenge();
      setHasFinished(true);
      setIsActive(false);
    }
  }, [isActive, time]);



  return (
    <CountdownContext.Provider
    value={{
      isActive,
      minutes,
      seconds,
      hasFinished,
      resetCountdown,
      startCountdown,
    }}
    >
      {children}
    </CountdownContext.Provider>
  );
}

function useChallenges(): { startNewChallenge: any } {
  throw new Error("Function not implemented.");
}

