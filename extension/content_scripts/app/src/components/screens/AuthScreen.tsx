import { useEffect, useState } from 'react';
import { Button, AnchorButton, Input, BirdLogo } from 'unfold-ui';
import { trimUnsafeDisplayName } from 'unfold-utils';
import api from '../../utils/api';
import { CONTACT } from '../../utils/constants';
import { useAuth } from '../../utils/useAuth';
import { useNavigation } from '../../utils/useNavigation';
import { usePartialState } from '../../utils/usePartialState';

const TokenScreen = ({ onSubmit }: { onSubmit: (token: string) => Promise<void> }): JSX.Element => {
  const [token, setToken] = useState('');

  return (
    <div className="h-full p-3 text-gray-700">
      <p>An email verification token has been sent to your email address.</p>
      <div className="flex flex-row gap-2">
        <Input
          maxLength={6}
          pattern="\d{6}"
          spellCheck={false}
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>
      <p>Please write this down in the box as a confirmation that you understand </p>
      <Button className="w-full" onClick={() => onSubmit(token)}>
        Verify &amp; go to app →
      </Button>
    </div>
  );
};

export const AuthScreen = (): JSX.Element => {
  const { register, login, user } = useAuth();
  const { goToBrowse } = useNavigation();

  const [step, setStep] = useState<'main' | 'token-pledge'>('main');

  const [loginInfo, setLoginInfo] = usePartialState({
    emailOrDisplayName: '',
    password: '',
  });

  const [regInfo, setRegInfo] = usePartialState({
    email: '',
    displayName: '',
    password: '',
  });

  useEffect(() => {
    if (!!user) {
      goToBrowse();
    }
  }, [user]);

  const handleVerificationAndLogin = async (token: string) => {
    try {
      await api.user.verifyEmail({
        email: regInfo.email,
        token: token,
      });

      // TODO if invalid token, then retry

      await login({
        emailOrDisplayName: regInfo.email,
        password: regInfo.password,
      });
    } catch {}
  };

  // useEffect(() => {
  //   if (user && !user.isEmailVerified) {
  //     setStep('token-pledge');
  //   }
  // }, [user]);

  if (step === 'token-pledge') {
    return <TokenScreen onSubmit={handleVerificationAndLogin} />;
  }

  const regDisabled =
    !regInfo.email || !regInfo.password || !regInfo.displayName; /* || regInfo.password !== regInfo.confirmPassword */
  const loginDisabled = !loginInfo.emailOrDisplayName || !loginInfo.password;

  const handleLogin = () => {
    login({
      emailOrDisplayName: loginInfo.emailOrDisplayName,
      password: loginInfo.password,
    });
  };

  // TODO temp thing
  // useEffect(() => {
  //   handleLogin();
  // }, []);

  const handleRegister = async () => {
    try {
      const regResult = await register({
        displayName: regInfo.displayName,
        email: regInfo.email,
        password: regInfo.password,
      });

      if (regResult && regResult.isVerified) {
        login(
          {
            emailOrDisplayName: regInfo.email,
            password: regInfo.password,
          },
          true,
        );
      } else {
        setStep('token-pledge');
      }
    } catch {
      console.error('Registration failed.');
    }
  };

  return (
    <div className="grid h-full grid-rows-m1 overflow-auto p-3">
      <div className="flex items-center justify-between">
        <a className="flex gap-1 p-0" href={CONTACT.web} rel="noopener noreferrer">
          <div
            className="mx-auto"
            style={{
              minWidth: '14px',
              minHeight: '14px',
              width: '14px',
              height: '14px',
            }}
          >
            <BirdLogo />
          </div>
          <span className="lowercase text-gray-600">
            Unfold<span className="ml-0.5 font-bold">Research</span>
          </span>
        </a>
        <AnchorButton href={CONTACT.mail} newTab title="Email us" icon="email" minimal />
      </div>
      <div className="mb-32 grid grid-flow-row place-items-center">
        <div className="flex flex-col items-start gap-1">
          <h2 className="mb-1 font-semibold text-gray-700">Register a new account</h2>
          <Input
            className="w-full"
            type="email"
            value={regInfo.email}
            onChange={(e) => setRegInfo({ email: e.target.value })}
            placeholder="Email"
            spellCheck={false}
            maxLength={128}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRegister();
              }
            }}
          />
          <Input
            className="w-full"
            value={regInfo.displayName}
            onChange={(e) => setRegInfo({ displayName: trimUnsafeDisplayName(e.target.value) })}
            placeholder="Username"
            spellCheck={false}
            maxLength={16}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRegister();
              }
            }}
          />
          <Input
            className="w-full"
            type="password"
            value={regInfo.password}
            onChange={(e) => setRegInfo({ password: e.target.value })}
            placeholder="Password"
            spellCheck={false}
            maxLength={64}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRegister();
              }
            }}
          />
          <Button disabled={regDisabled} onClick={handleRegister} className="w-full justify-center" icon="user-plus">
            Sign Up
          </Button>
        </div>

        <div className="flex flex-col items-start gap-1">
          <h2 className="mb-1 font-semibold text-gray-700">Log In</h2>
          <Input
            className="w-full"
            value={loginInfo.emailOrDisplayName}
            onChange={(e) => setLoginInfo({ emailOrDisplayName: e.target.value })}
            placeholder="Email or username"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
          <Input
            className="w-full"
            type="password"
            value={loginInfo.password}
            onChange={(e) => setLoginInfo({ password: e.target.value })}
            placeholder="Password"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
          <Button disabled={loginDisabled} onClick={handleLogin} className="w-full justify-center" icon="log-in-2">
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};
