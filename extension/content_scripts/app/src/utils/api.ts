import {
  API_ENDPOINTS,
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  SubmitRequest,
  DeleteRequest,
  VoteRequest,
  ReportRequest,
  FeedbackRequest,
  RegisterResponse,
  LoginResponse,
  CountRequest,
  VoteResponse,
  SubmitResponse,
  ReportResponse,
  FeedbackResponse,
  UpdateUserDetailsRequest,
  CountResponse,
  FileUploadRequest,
  FileUploadResponse,
  FolderCreateRequest,
  FolderCreateResponse,
  FileDeleteRequest,
  FileDeleteResponse,
  FileRenameRequest,
  FileRenameResponse,
  HTTPMethod,
  HTTPMIMEType,
  FileDownloadRequest,
  FileDownloadResponse,
  CollectionCreateRequest,
  CollectionDeleteRequest,
  CollectionCreateResponse,
  CollectionDeleteResponse,
  CollectionGetRequest,
  CollectionGetResponse,
  CollectionRenameRequest,
  CollectionRenameResponse,
  GetEntryByUrlRequest,
  GetEntryByUrlResponse,
  GetEntryByIdRequest,
  GetEntryByIdResponse,
  GetEntriesByEntryRequest,
  GetEntriesByUserRequest,
  GetEntriesByEntryResponse,
  GetEntriesByUserResponse,
  CollectionHasEntryRequest,
  CollectionHasEntryResponse,
  CollectionDeleteByEntryRequest,
  CollectionDeleteByEntryResponse,
  NotifsCountRequest,
  NotifsCountResponse,
  NotifsRequest,
  NotifsResponse,
  NotifsMarkAllRequest,
  NotifsMarkAllResponse,
  NotifsMarkOneRequest,
  NotifsMarkOneResponse,
  UpdateUserDetailsResponse,
  GetUserDetailsRequest,
  GetUserDetailsResponse,
  CollectionHasUserRequest,
  CollectionHasUserResponse,
  CollectionDeleteByUserRequest,
  CollectionDeleteByUserResponse,
  SubscriptionFollowEntryRequest,
  SubscriptionFollowEntryResponse,
  SubscriptionIsFollowingEntryRequest,
  SubscriptionIsFollowingEntryResponse,
  SubscriptionUnfollowEntryRequest,
  SubscriptionUnfollowEntryResponse,
  SubscriptionFollowUserRequest,
  SubscriptionFollowUserResponse,
  SubscriptionIsFollowingUserRequest,
  SubscriptionIsFollowingUserResponse,
  SubscriptionUnfollowUserRequest,
  SubscriptionUnfollowUserResponse,
} from 'unfold-api';
import { CONFIG } from 'unfold-core';
import { storage } from 'unfold-utils';

const { protocol, domain, port } = CONFIG[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'];
const urlBase = `${protocol}://${domain}${port ? `:${port}` : ''}/`;

type HandlerOptions = {
  'method': HTTPMethod;
  'Content-Type': HTTPMIMEType;
  'Accept': HTTPMIMEType;
};

const DEFAULT_HANDLER_OPTIONS = {
  'method': 'POST',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

const apiHandler = function <Req, Res = void>(endpoint: string, options?: Partial<HandlerOptions>) {
  return async (
    data: Req,
    queryParams?: Record<string, string | number | boolean> | null | ((data: Req) => string),
  ): Promise<Res | undefined> => {
    const handlerOptions: HandlerOptions = {
      ...DEFAULT_HANDLER_OPTIONS,
      ...options,
    };

    try {
      const query = queryParams
        ? typeof queryParams === 'function'
          ? '/' + queryParams(data)
          : '?' +
            Object.keys(queryParams)
              .map((key) => `${encodeURI(key)}=${encodeURIComponent(queryParams[key])}`)
              .join('&')
        : '';

      const accessToken = await storage.get('auth::access_token', '');
      const authHeader: { Authorization?: string } = accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {};

      const headers = {
        'Content-Type': handlerOptions['Content-Type'],
        'Accept': handlerOptions['Accept'],
        ...authHeader,
      };

      const url = `${urlBase}${endpoint}${query}`;

      const res = await fetch(url, {
        method: handlerOptions.method,
        headers,
        body: handlerOptions.method === 'GET' ? undefined : JSON.stringify(data),
      });

      if (res.ok) {
        if (!res.body) {
          return;
        }

        try {
          const parsedRes: Res = await res.json();
          return parsedRes;
        } catch {}
      }
    } catch (e) {
      console.error(e);
      throw Error(`Something went wrong during ${handlerOptions.method}:[${endpoint}].`);
    }
  };
};

const fileHandler =
  <Req extends Record<string, any>, Res>(endpoint: string) =>
  async (data: Req) => {
    const formData = new FormData();
    Object.entries(data).forEach(([fieldName, fieldData]) => {
      formData.append(fieldName, fieldData);
    });

    const accessToken = await storage.get('auth::access_token', '');
    const authHeaders: { Authorization?: string } = accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {};

    try {
      const url = `${urlBase}${endpoint}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...authHeaders,
        },
        body: formData,
      });

      if (res.ok) {
        if (!res.body) {
          return;
        }

        try {
          const parsedRes: Res = await res.json();
          return parsedRes;
        } catch {}
      }
    } catch (e) {
      console.error(e);
      throw Error(`Something went wrong during:[${endpoint}].`);
    }
  };

const api = {
  urlBase,
  user: {
    register: apiHandler<RegisterRequest, RegisterResponse>(API_ENDPOINTS.user.register),
    login: apiHandler<LoginRequest, LoginResponse>(API_ENDPOINTS.user.login),
    verifyEmail: apiHandler<VerifyEmailRequest>(API_ENDPOINTS.user.verifyEmail),
    get: apiHandler<GetUserDetailsRequest, GetUserDetailsResponse>(API_ENDPOINTS.user.get),
    update: apiHandler<UpdateUserDetailsRequest, UpdateUserDetailsResponse>(API_ENDPOINTS.user.update),
  },
  entry: {
    submit: apiHandler<SubmitRequest, SubmitResponse>(API_ENDPOINTS.entry.submit),
    delete: apiHandler<DeleteRequest>(API_ENDPOINTS.entry.delete),
    getEntryByUrl: apiHandler<GetEntryByUrlRequest, GetEntryByUrlResponse>(API_ENDPOINTS.entry.getEntryByUrl),
    getEntryById: apiHandler<GetEntryByIdRequest, GetEntryByIdResponse>(API_ENDPOINTS.entry.getEntryById),
    getEntriesByEntry: apiHandler<GetEntriesByEntryRequest, GetEntriesByEntryResponse>(
      API_ENDPOINTS.entry.getEntriesByEntry,
    ),
    getEntriesByUser: apiHandler<GetEntriesByUserRequest, GetEntriesByUserResponse>(
      API_ENDPOINTS.entry.getEntriesByUser,
    ),
    countByFormat: apiHandler<CountRequest, CountResponse>(API_ENDPOINTS.entry.countByFormat),
  },
  vote: {
    vote: apiHandler<VoteRequest, VoteResponse>(API_ENDPOINTS.vote.vote),
  },
  report: {
    report: apiHandler<ReportRequest, ReportResponse>(API_ENDPOINTS.report.report),
  },
  feedback: {
    feedback: apiHandler<FeedbackRequest, FeedbackResponse>(API_ENDPOINTS.feedback.feedback),
  },
  file: {
    upload: fileHandler<FileUploadRequest, FileUploadResponse>(API_ENDPOINTS.file.upload),
    createFolder: apiHandler<FolderCreateRequest, FolderCreateResponse>(API_ENDPOINTS.file.createFolder),
    delete: apiHandler<FileDeleteRequest, FileDeleteResponse>(API_ENDPOINTS.file.delete),
    rename: apiHandler<FileRenameRequest, FileRenameResponse>(API_ENDPOINTS.file.rename),
    download: apiHandler<FileDownloadRequest, FileDownloadResponse>(API_ENDPOINTS.file.download),
  },
  collection: {
    get: apiHandler<CollectionGetRequest, CollectionGetResponse>(API_ENDPOINTS.collection.get),
    create: apiHandler<CollectionCreateRequest, CollectionCreateResponse>(API_ENDPOINTS.collection.create),
    rename: apiHandler<CollectionRenameRequest, CollectionRenameResponse>(API_ENDPOINTS.collection.rename),
    delete: apiHandler<CollectionDeleteRequest, CollectionDeleteResponse>(API_ENDPOINTS.collection.delete),
    hasEntry: apiHandler<CollectionHasEntryRequest, CollectionHasEntryResponse>(API_ENDPOINTS.collection.hasEntry),
    deleteByEntry: apiHandler<CollectionDeleteByEntryRequest, CollectionDeleteByEntryResponse>(
      API_ENDPOINTS.collection.deleteByEntry,
    ),
    hasUser: apiHandler<CollectionHasUserRequest, CollectionHasUserResponse>(API_ENDPOINTS.collection.hasUser),
    deleteByUser: apiHandler<CollectionDeleteByUserRequest, CollectionDeleteByUserResponse>(
      API_ENDPOINTS.collection.deleteByUser,
    ),
  },
  notification: {
    count: apiHandler<NotifsCountRequest, NotifsCountResponse>(API_ENDPOINTS.notification.count),
    get: apiHandler<NotifsRequest, NotifsResponse>(API_ENDPOINTS.notification.get),
    markAll: apiHandler<NotifsMarkAllRequest, NotifsMarkAllResponse>(API_ENDPOINTS.notification.markAllAsRead),
    markOne: apiHandler<NotifsMarkOneRequest, NotifsMarkOneResponse>(API_ENDPOINTS.notification.markOneAsRead),
  },
  subscription: {
    followEntry: apiHandler<SubscriptionFollowEntryRequest, SubscriptionFollowEntryResponse>(
      API_ENDPOINTS.subscription.followEntry,
    ),
    isFollowingEntry: apiHandler<SubscriptionIsFollowingEntryRequest, SubscriptionIsFollowingEntryResponse>(
      API_ENDPOINTS.subscription.isFollowingEntry,
    ),
    unfollowEntry: apiHandler<SubscriptionUnfollowEntryRequest, SubscriptionUnfollowEntryResponse>(
      API_ENDPOINTS.subscription.unfollowEntry,
    ),
    followUser: apiHandler<SubscriptionFollowUserRequest, SubscriptionFollowUserResponse>(
      API_ENDPOINTS.subscription.followUser,
    ),
    isFollowingUser: apiHandler<SubscriptionIsFollowingUserRequest, SubscriptionIsFollowingUserResponse>(
      API_ENDPOINTS.subscription.isFollowingUser,
    ),
    unfollowUser: apiHandler<SubscriptionUnfollowUserRequest, SubscriptionUnfollowUserResponse>(
      API_ENDPOINTS.subscription.unfollowUser,
    ),
  },
} as const;

export default api;
