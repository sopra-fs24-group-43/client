import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname || "/");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const updateCurrentPath = (path) => {
    setCurrentPath(path);
  };

  return (
    <LocationContext.Provider value={{ currentPath, updateCurrentPath }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useCurrentPath = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useCurrentPath must be used within a LocationProvider');
  }
  return context;
};