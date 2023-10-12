import mixpanel, { Callback } from 'mixpanel-browser';
import { AnalyticsEvent } from 'unfold-analytics';
import { MIXPANEL_TOKEN } from 'unfold-core';
import { isDev } from 'unfold-utils';

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

// -- analytics ------------

// mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN as string);
if (!isDev()) {
  mixpanel.init(MIXPANEL_TOKEN.prod);
}

// -----------------------------------------------------------------------------

// https://developer.mixpanel.com/docs/javascript-full-api-reference#mixpaneltime_event
const timeEvent = (eventName: keyof AnalyticsEvent): void => mixpanel.time_event(eventName);

// https://developer.mixpanel.com/docs/javascript-full-api-reference#mixpaneltrack
const track = <EventName extends keyof AnalyticsEvent>(
  ...[eventName, properties]: AnalyticsEvent[EventName] extends null
    ? [EventName]
    : [EventName, NonNullable<AnalyticsEvent[EventName]>]
): void => {
  if (properties) {
    mixpanel.track(eventName, properties);
  } else {
    mixpanel.track(eventName);
  }
};

const identify = (userId: string) => mixpanel.identify(userId);
const reset = () => mixpanel.reset();

// "super properties" vs "people properties"
// https://community.mixpanel.com/strategy-and-planning-9/difference-between-register-and-people-set-43

type EventsPersistentProps = {
  userPoints: number;
};

const register = (dict: Partial<EventsPersistentProps>, days?: number) => mixpanel.register(dict, days);
// const registerOnce = mixpanel.register_once;
const unregister = (propKey: keyof EventsPersistentProps) => mixpanel.unregister(propKey);

type UserProps = {
  displayName: string;
  emailVerified: boolean;
  userId: string;
  // points: number;
  // bookmarksCount: number;
  // submissionsCount: number;
  // tags: string[];

  $email: string;
  $avatar: string;
  $name: string;
};

const set = (props: Partial<UserProps>, callback?: Callback) => mixpanel.people.set(props, callback);
const setOnce = (props: Partial<UserProps>, callback?: Callback) => mixpanel.people.set_once(props, callback);
const unset = (propKey: keyof UserProps, callback?: Callback) => mixpanel.people.unset(propKey, callback);

const increment = (propKey: KeysMatching<UserProps, number>, value = 1, callback?: Callback) =>
  mixpanel.people.increment(propKey, value, callback);

const append = (propKey: KeysMatching<UserProps, Array<any>>, value: any, callback?: Callback) =>
  mixpanel.people.append(propKey, value, callback);
const remove = (propKey: KeysMatching<UserProps, Array<any>>, value: any, callback?: Callback) =>
  mixpanel.people.remove(propKey, value, callback);

const noop = (...args: any) => {
  console.log(...args);
};

const analyticsImpl = {
  events: {
    time: timeEvent,
    track,
    persistentProps: {
      register,
      // registerOnce,
      unregister,
    },
  },
  people: {
    identify,
    reset,
    props: {
      set,
      setOnce,
      unset,
      increment,
      append,
      remove,
    },
  },
} as const;

const analytics = isDev()
  ? ({
      events: {
        time: noop,
        track: noop,
        persistentProps: {
          register: noop,
          // registerOnce: noop,
          unregister: noop,
        },
      },
      people: {
        identify: noop,
        reset: noop,
        props: {
          set: noop,
          setOnce: noop,
          unset: noop,
          increment: noop,
          append: noop,
          remove: noop,
        },
      },
    } as typeof analyticsImpl)
  : analyticsImpl;

export default analytics;
