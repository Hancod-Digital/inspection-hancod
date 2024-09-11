import { createContext, useContext, useState } from "react";

// Create the LoadingContext
const LoadingContext = createContext({
    isLoadingOne: false,
    setLoading: (state: boolean) => {},
});

// Custom hook to use the LoadingContext
export const useLoading = () => useContext(LoadingContext);

// LoadingProvider component to wrap your layout
export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoadingOne, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoadingOne, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
