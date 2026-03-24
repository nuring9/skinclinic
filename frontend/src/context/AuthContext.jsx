import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "@/api/authApi";

const AuthContext = createContext(null);

function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const currentUser = await fetchCurrentUser();
        if (!active) {
          return;
        }
        startTransition(() => {
          setUser(currentUser);
        });
      } catch (error) {
        if (!active) {
          return;
        }
        if (!isUnauthorizedError(error)) {
          console.error(error);
        }
        startTransition(() => {
          setUser(null);
        });
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user?.authenticated),
    isLoading,
    async login(credentials) {
      const currentUser = await loginRequest(credentials);
      setUser(currentUser);
      return currentUser;
    },
    async logout() {
      await logoutRequest();
      setUser(null);
    },
    async refreshUser() {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        return currentUser;
      } catch (error) {
        if (isUnauthorizedError(error)) {
          setUser(null);
          return null;
        }
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
