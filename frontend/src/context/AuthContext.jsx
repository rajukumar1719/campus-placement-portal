import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

// Context Create
export const Context = createContext({
    isAuthorized: false,
});

// Context Provider
export const ContextProvider = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    // ✅ Page load pe check karo ki user logged in hai ya nahi
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // ✅ CHANGED: localStorage se user lo (token nahi)
                const savedUser = localStorage.getItem("user");

                if (!savedUser) {
                    setLoading(false);
                    setIsAuthorized(false);
                    return;
                }

                // ✅ Backend se verify karo (cookie automatically jayegi)
                const response = await API.get("/auth/me");

                if (response.data.success) {
                    setUser(response.data.user);
                    setIsAuthorized(true);
                    // Update localStorage with fresh data
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                } else {
                    // Invalid session
                    localStorage.removeItem("user");
                    setIsAuthorized(false);
                }
            } catch (error) {
                // Error (401, 403, etc.)
                localStorage.removeItem("user");
                setIsAuthorized(false);
                setUser({});
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // ✅ Loading state
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f0f0f0',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }}></div>
                <p>Loading...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <Context.Provider
            value={{
                isAuthorized,
                setIsAuthorized,
                user,
                setUser,
                loading,
            }}
        >
            {children}
        </Context.Provider>
    );
};