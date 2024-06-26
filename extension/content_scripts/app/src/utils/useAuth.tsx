import { useContext, createContext, useState, ReactNode, useEffect } from 'react';
import api from './api';
import { jwtDecode } from 'jwt-decode';
import { extStorage } from 'unfold-utils';
import analytics from './analytics';
import { JWTPayload } from 'unfold-api';

type Auth = {
  user:
    | (Pick<JWTPayload, 'id' | 'createdAt' | 'displayName'> & {
        showOnboarding: boolean;
        accessToken: string;
      })
    | null;
  register: (data: { displayName: string; email: string; password: string }) => Promise<
    | {
        isVerified: boolean;
        id: string;
      }
    | undefined
  >;
  login: (data: { emailOrDisplayName: string; password: string }, showOnboarding?: boolean) => Promise<void>;
  logout: () => void;
  setShowOnboarding: (show: boolean) => void;
};

const AuthContext = createContext<Auth | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('AuthCtx is null');
  }
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Auth['user']>(null);

  useEffect(() => {
    const getUser = async () => {
      const accessToken = await extStorage.get('auth::access_token', '');

      if (!accessToken) {
        setUser(null);
        return;
      }

      const jwtPayload = jwtDecode<JWTPayload>(accessToken);
      setUser({
        displayName: jwtPayload.displayName,
        id: jwtPayload.id,
        createdAt: new Date(jwtPayload.createdAt),
        showOnboarding: false,
        accessToken: accessToken,
      });
      analytics.people.identify(jwtPayload.id);
    };

    getUser();
  }, []);

  const register = async (data: { displayName: string; email: string; password: string }) => {
    const regResult = await api.user.register({
      displayName: data.displayName,
      email: data.email,
      password: data.password,
    });

    if (regResult) {
      analytics.people.identify(regResult.id);
      analytics.people.props.set({
        $email: data.email,
        displayName: data.displayName,
        $name: data.displayName,
        emailVerified: false,
      });
      analytics.events.track('user.registration');
    }

    return regResult;
  };

  const login: Auth['login'] = async ({ emailOrDisplayName, password }, showOnboarding = false) => {
    const loginRes = await api.user.login({
      emailOrDisplayName,
      password,
    });

    if (!loginRes) {
      return;
    }

    analytics.people.identify(loginRes.id);
    analytics.events.track('user.login');
    analytics.people.props.set({
      emailVerified: true,
    });

    await extStorage.set('auth::access_token', loginRes.access_token);

    const jwtPayload = jwtDecode<JWTPayload>(loginRes.access_token);

    setUser({
      displayName: jwtPayload.displayName,
      id: jwtPayload.id,
      createdAt: new Date(jwtPayload.createdAt),
      showOnboarding,
      accessToken: loginRes.access_token,
    });
  };

  const logout: Auth['logout'] = async () => {
    setUser(null);
    await extStorage.remove('auth::access_token');
    analytics.events.track('user.logout');
    analytics.people.reset();
  };

  const setShowOnboarding: Auth['setShowOnboarding'] = (show: boolean) => {
    setUser(
      user === null
        ? null
        : {
            ...user,
            showOnboarding: show,
          },
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        setShowOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
