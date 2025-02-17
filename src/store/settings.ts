import type { Group } from '~/models';
import { writable } from 'svelte/store';
import defaultTemplate from '~/assets/defaultTemplate.njk';
import type HypothesisPlugin from '~/main';

type SyncHistory = {
  totalArticles: number;
  totalHighlights: number;
};

type Settings = {
  token: string
  user: string
  highlightsFolder: string;
  lastSyncDate?: Date;
  lastSyncedAnnotation?: Date;
  isConnected: boolean;
  template: string;
  syncOnBoot: boolean;
  overwriteOnUpdate: boolean;
  enableContextualTags: boolean;
  history: SyncHistory;
  dateTimeFormat: string;
  autoSyncInterval: number;
  groups: Group[];
  useDomainFolders: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  token: '',
  user: '',
  highlightsFolder: '/',
  isConnected: false,
  template: defaultTemplate,
  syncOnBoot: false,
  overwriteOnUpdate: false,
  enableContextualTags: false,
  autoSyncInterval: 0,
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  history: {
    totalArticles: 0,
    totalHighlights: 0,
  },
  groups: [],
  useDomainFolders: false
};

const createSettingsStore = () => {
  const store = writable(DEFAULT_SETTINGS as Settings);

  let _plugin!: HypothesisPlugin;

  // Load settings data from disk into store
  const initialise = async (plugin: HypothesisPlugin): Promise<void> => {
    const data = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());

    const settings: Settings = {
      ...data,
      lastSyncDate: data.lastSyncDate ? new Date(data.lastSyncDate) : undefined,
      lastSyncedAnnotation: data.lastSyncedAnnotation ? new Date(data.lastSyncedAnnotation) : undefined,
    };

    store.set(settings);

    _plugin = plugin;
  };

  // Listen to any change to store, and write to disk
  store.subscribe(async (settings) => {
    if (_plugin) {
      // Transform settings fields for serialization
      const data = {
        ...settings,
        lastSyncDate: settings.lastSyncDate
          ? settings.lastSyncDate.toJSON()
          : undefined,
          lastSyncedAnnotation: settings.lastSyncedAnnotation
          ? settings.lastSyncedAnnotation.toJSON()
          : undefined,
      };

      await _plugin.saveData(data);
    }
  });

  const connect = async (token: string, userid: string) => {
    store.update((state) => {
      state.isConnected = true;
      state.token = token;
      state.user = userid;
      return state;
    });
  };

  const disconnect = () => {
    store.update((state) => {
      state.isConnected = false;
      state.user = undefined;
      state.token = undefined;
      state.groups = [];
      return state;
    });
  };

  const setHighlightsFolder = (value: string) => {
    store.update((state) => {
      state.highlightsFolder = value;
      return state;
    });
  };

  const resetSyncHistory = () => {
    store.update((state) => {
      state.history.totalArticles = 0;
      state.history.totalHighlights = 0;
      state.lastSyncDate = undefined;
      state.lastSyncedAnnotation = undefined;
      return state;
    });
  };

  const setSyncDateToNow = () => {
    store.update((state) => {
      state.lastSyncDate = new Date();
      return state;
    });
  };

  const setLastSyncedAnnotation = (value: Date) => {
    store.update((state) => {
      state.lastSyncedAnnotation = value;
      return state;
    });
  };

  const setTemplate = (value: string) => {
    store.update((state) => {
      state.template = value;
      return state;
    });
  };

  const setSyncOnBoot = (value: boolean) => {
    store.update((state) => {
      state.syncOnBoot = value;
      return state;
    });
  };

  const setOverwriteOnUpdate = (value: boolean) => {
    store.update((state) => {
      state.overwriteOnUpdate = value;
      return state;
    });
  };

  const setEnableContextualTags = (value: boolean) => {
    store.update((state) => {
      state.enableContextualTags = value;
      return state;
    });
  };

  const incrementHistory = (delta: SyncHistory) => {
    store.update((state) => {
      state.history.totalArticles += delta.totalArticles;
      state.history.totalHighlights += delta.totalHighlights;
      return state;
    });
  };

  const setDateTimeFormat = (value: string) => {
    store.update((state) => {
      state.dateTimeFormat = value;
      return state;
    });
  };

  const setAutoSyncInterval = (value: number) => {
    store.update((state) => {
      state.autoSyncInterval = value;
      return state;
    });
  };

  const setGroups = async (value: Group[]) => {
    store.update((state) => {
      state.groups = value;
      return state;
    });
  };

  const resetGroups = async () => {
    store.update((state) => {
      state.groups = [];
      return state;
    });
  };

  const setUseDomainFolder = (value: boolean) => {
    store.update((state) => {
      state.useDomainFolders = value;
      return state;
    });
  };

  return {
    subscribe: store.subscribe,
    initialise,
    actions: {
      setHighlightsFolder,
      resetSyncHistory,
      setSyncDateToNow,
      setLastSyncedAnnotation,
      connect,
      disconnect,
      setAutoSyncInterval,
      setTemplate,
      setSyncOnBoot,
      setOverwriteOnUpdate,
      setEnableContextualTags,
      incrementHistory,
      setDateTimeFormat,
      setGroups,
      resetGroups,
      setUseDomainFolder,
    },
  };
};

export const settingsStore = createSettingsStore();
