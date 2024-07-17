import React, { useState, createContext } from "react";

type CurrentTrackContextType = {
  currentTrack: string | undefined;
  setCurrentTrack: (track: string) => void;
};

// Create a Context for the global string
export const CurrentTrackContext = createContext<CurrentTrackContextType>({
  currentTrack: undefined,
  setCurrentTrack: () => {},
});

export const CurrentTrackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentTrack, setCurrentTrack] = useState<string | undefined>(
    undefined
  );

  // The provider component will make the string and updater function available to any descendant component.
  return (
    <CurrentTrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </CurrentTrackContext.Provider>
  );
};
