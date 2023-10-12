type Left<T> = {
  left: T;
  right?: never;
};

type Right<U> = {
  left?: never;
  right: U;
};

type Either<T, U> = NonNullable<Left<T> | Right<U>>;

export type UnwrapEither = <T, U>(e: Either<T, U>) => NonNullable<T | U>;

export const unwrapEither: UnwrapEither = <T, U>({ left, right }: Either<T, U>) => {
  if (right !== undefined && left !== undefined) {
    throw new Error(
      `Received both left and right values at runtime when opening an Either\nLeft: ${JSON.stringify(
        left,
      )}\nRight: ${JSON.stringify(right)}`,
    );
    /*
     We're throwing in this function because this can only occur at runtime if something 
     happens that the TypeScript compiler couldn't anticipate. That means the application
     is in an unexpected state and we should terminate immediately.
    */
  }
  if (left !== undefined) {
    return left as NonNullable<T>; // Typescript is getting confused and returning this type as `T | undefined` unless we add the type assertion
  }
  if (right !== undefined) {
    return right as NonNullable<U>;
  }
  throw new Error(`Received no left or right values at runtime when opening Either`);
};

export const isLeft = <T, U>(e: Either<T, U>): e is Left<T> => {
  return e.left !== undefined;
};

export const isRight = <T, U>(e: Either<T, U>): e is Right<U> => {
  return e.right !== undefined;
};

export const makeLeft = <T>(value: T): Left<T> => ({ left: value });

export const makeRight = <U>(value: U): Right<U> => ({ right: value });

/* 

type LoginError =
  | 'EMPTY_USERNAME'
  | 'EMPTY_PASSWORD'
  | 'INVALID_CREDENTIALS'
  | 'INACTIVE_USER';

export const handleLoginUser = async (username: string, password: string): Promise<Either<LoginError, User> => {
  if (username === '') {
    return makeLeft('EMPTY_USERNAME');
  }
  if (password === '') {
    return makeLeft('EMPTY_PASSWORD');
  }
  if (isCorrectUserPasswordCombo(username, password) === false) {
    return makeLeft('INVALID_CREDENTIALS');
  }
  const user = await getUserbyUsername(username);
  if (user.active === false) {
    return makeLeft('INACTIVE_USER');
  }
  return makeRight(user);
}



export const handleLoginError = async (loginError: LoginError): Promise<string> => {
  switch (error) {
    case 'EMPTY_USERNAME': {
      return 'You must supply a username to login';
    }
    case 'EMPTY_PASSWORD': {
      return 'You must supply a password to login';
    }
    case 'INVALID_CREDENTIALS': {
      const attemptsRemaining = await handleInvalidCredentialsAttempt(username);
      if (attemptsRemaining === 0) {
        return 'You have made too many attempts and been locked out.';
      }
      return `Invalid username and/or password, you have ${attemptsRemaining} attempts remaining`;
    }
    case 'INACTIVE_USER': {
      return 'Check your email for an activation link';
    }
    default: {
      isStrictNever(error);
    }
  }
}

*/
