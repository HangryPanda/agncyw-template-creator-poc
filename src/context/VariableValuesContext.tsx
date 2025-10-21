import React, { createContext, useContext } from 'react';

interface VariableValues {
  [key: string]: string;
}

interface VariableValuesContextType {
  values: VariableValues;
  mode: 'create' | 'use';
}

const VariableValuesContext = createContext<VariableValuesContextType>({
  values: {},
  mode: 'create',
});

export function useVariableValues() {
  return useContext(VariableValuesContext);
}

interface VariableValuesProviderProps {
  children: React.ReactNode;
  values: VariableValues;
  mode: 'create' | 'use';
}

export function VariableValuesProvider({ children, values, mode }: VariableValuesProviderProps) {
  return (
    <VariableValuesContext.Provider value={{ values, mode }}>
      {children}
    </VariableValuesContext.Provider>
  );
}
