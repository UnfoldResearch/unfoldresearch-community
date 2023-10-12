import { isDev } from './isDev';

type StorageLocation =
  | 'auth::access_token'
  | 'options::options'
  | 'submit::title'
  | 'submit::content'
  | 'submit::tags'
  | 'submit::format';

const get = async <T>(name: StorageLocation, defaultValue: T): Promise<T> => {
  if (isDev()) {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : defaultValue;
  }

  const storedValues = await chrome.storage.local.get(name);
  const value = storedValues[name];
  return value !== undefined ? value : defaultValue;
};
const set = async (name: StorageLocation, value: any): Promise<void> => {
  if (isDev()) {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    await chrome.storage.local.set({
      [name]: value,
    });
  }
};
const remove = async (name: StorageLocation): Promise<void> => {
  if (isDev()) {
    localStorage.removeItem(name);
  } else {
    await chrome.storage.local.remove(name);
  }
};

export const extStorage = {
  get,
  set,
  remove,
};
