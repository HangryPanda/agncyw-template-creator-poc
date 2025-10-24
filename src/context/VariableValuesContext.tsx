import React, { createContext, useContext } from 'react';

interface VariableValues {
  [key: string]: string;
}

interface VariableValuesContextType {
  values: VariableValues;
  mode: 'create' | 'use';
  setValue: (variableName: string, value: string) => void;
  isVariableFilled: (variableName: string) => boolean;
  getUnfilledVariables: () => string[];
  getFirstUnfilledVariable: () => string | null;
}

const VariableValuesContext = createContext<VariableValuesContextType>({
  values: {},
  mode: 'create',
  setValue: () => {},
  isVariableFilled: () => false,
  getUnfilledVariables: () => [],
  getFirstUnfilledVariable: () => null,
});

export function useVariableValues() {
  return useContext(VariableValuesContext);
}

interface VariableValuesProviderProps {
  children: React.ReactNode;
  values: VariableValues;
  mode: 'create' | 'use';
  setValue: (variableName: string, value: string) => void;
  allVariableNames?: string[]; // All variables used in the template
}

export function VariableValuesProvider({
  children,
  values,
  mode,
  setValue,
  allVariableNames = []
}: VariableValuesProviderProps) {
  const isVariableFilled = (variableName: string): boolean => {
    return Boolean(values[variableName] && values[variableName].trim().length > 0);
  };

  const getUnfilledVariables = (): string[] => {
    return allVariableNames.filter(name => !isVariableFilled(name));
  };

  const getFirstUnfilledVariable = (): string | null => {
    const unfilled = getUnfilledVariables();
    return unfilled.length > 0 ? unfilled[0] : null;
  };

  return (
    <VariableValuesContext.Provider value={{
      values,
      mode,
      setValue,
      isVariableFilled,
      getUnfilledVariables,
      getFirstUnfilledVariable
    }}>
      {children}
    </VariableValuesContext.Provider>
  );
}
