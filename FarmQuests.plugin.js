/**
 * @name FarmQuests
 * @description A plugin that farms you multiple discord quests in background simultaneously.
 * @version 1.6.1
 * @author Sophan-Developer
 * @authorLink https://github.com/Sophan-Developer
 * @website https://github.com/Sophan-Developer/FarmQuests
 * @source https://raw.githubusercontent.com/Sophan-Developer/FarmQuests/main/FarmQuests.plugin.js
 * @invite guNEKzhk4n
 */

// Porting of https://gist.github.com/aamiaa/204cd9d42013ded9faf646fae7f89fbb for betterdiscord

const config = {
    info: {
        name: 'FarmQuests',
        version: '1.6.1',
        github_raw: 'https://raw.githubusercontent.com/Sophan-Developer/FarmQuests/main/FarmQuests.plugin.js'
    },
    changelog: [
        { title: "Bug Fixes (Jan 2026)", type: "fixed", items: [
            "Fixed syntax error in API module resolution (line 87)",
            "Fixed version comparison logic in update checker",
            "Fixed memory leaks - intervals and Flux subscriptions now properly cleaned up",
            "Added null-safety guards in webpack module finder"
        ]},
        { title: "New Features", type: "added", items: [
            "Added 'Copy Debug Info' feature for easier troubleshooting",
            "Added user-friendly error notices with debug option",
            "Added cleanup registry to track all intervals/timeouts/subscriptions"
        ]},
        { title: "Improvements", type: "improved", items: [
            "Better error handling when Discord modules are missing",
            "Improved stop() cleanup to prevent resource leaks",
            "More robust store resolution with better fallback patterns"
        ]}
    ],
    settings: [
        // ═══════════════════════════════════════════════════════════════
        // PAGE 1: Automation Settings
        // ═══════════════════════════════════════════════════════════════
        { type: "header", text: "⚙️ Quest Automation", page: 1 },
        { type: "switch", id: "acceptQuestsAutomatically", name: "Auto Accept Quests", note: "Automatically accept new available quests when they appear", value: true, page: 1 },
        { type: "switch", id: "autoCompleteAllQuests", name: "Auto Complete Quests", note: "Automatically complete all quest types (video, play, stream)", value: true, page: 1 },
        { type: "switch", id: "autoClaimRewards", name: "Auto Claim Rewards", note: "Claim quest rewards automatically after completion", value: true, page: 1 },
        { type: "switch", id: "autoStartVideoQuests", name: "Auto Start Video Quests", note: "Click 'Start Video Quest' button automatically", value: true, page: 1 },
        { type: "divider", page: 1 },
        
        { type: "header", text: "🔄 Retry & Recovery", page: 1 },
        { type: "switch", id: "retryFailedQuests", name: "Retry Failed Quests", note: "Automatically retry quests that fail to complete", value: true, page: 1 },
        { type: "switch", id: "verifyQuestCompletion", name: "Verify Quest Completion", note: "Double-check that quests are properly completed and claimed", value: true, page: 1 },
        { type: "number", id: "claimRetryAttempts", name: "Claim Retry Attempts", note: "Number of times to retry claiming rewards if it fails", value: 3, min: 1, max: 10, step: 1, page: 1 },
        { type: "divider", page: 1 },
        
        { type: "header", text: "🔔 Notifications & UI", page: 1 },
        { type: "switch", id: "questNotifications", name: "Quest Notifications", note: "Show desktop notifications for quest progress and completion", value: true, page: 1 },
        { type: "switch", id: "suppressQuestProgressPill", name: "Hide Progress Pill", note: "Hide the quest progress notification pill in Discord UI", value: false, page: 1 },
        
        // ═══════════════════════════════════════════════════════════════
        // PAGE 2: Performance & Advanced Settings
        // ═══════════════════════════════════════════════════════════════
        { type: "header", text: "⚡ Performance Settings", page: 2 },
        { type: "number", id: "concurrentFarms", name: "Max Concurrent Farms", note: "Maximum number of quests to farm simultaneously (higher = faster but more resource usage)", value: 3, min: 1, max: 10, step: 1, page: 2 },
        { type: "number", id: "delayBetweenFarms", name: "Delay Between Farms", note: "Delay in seconds between starting each quest (prevents rate limiting)", value: 2, min: 0, max: 30, step: 1, page: 2 },
        { type: "number", id: "checkForNewQuests", name: "Quest Check Interval", note: "How often to check for new quests (in minutes)", value: 5, min: 1, max: 60, step: 1, page: 2 },
        { type: "divider", page: 2 },
        
        { type: "header", text: "🔧 Advanced Technical Settings", page: 2 },
        { type: "number", id: "maxFallbackAttempts", name: "Max Heartbeat Attempts", note: "Maximum heartbeat attempts before forcing completion (technical)", value: 30, min: 5, max: 100, step: 5, page: 2 },
        { type: "switch", id: "enableVerboseLogging", name: "Verbose Logging", note: "Enable detailed debug logs in console (for troubleshooting issues)", value: false, page: 2 },
        { type: "divider", page: 2 },
        
        { type: "header", text: "ℹ️ Information", page: 2 },
        { type: "info", text: "⚠️ Changing advanced settings may affect plugin stability. Default values are recommended for most users.", page: 2 }
    ]
};

function getSetting(key) {
    return config.settings.reduce((found, setting) => found ? found : (setting.id === key ? setting : setting.settings?.find(s => s.id === key)), undefined)
}

const { Webpack, Data, UI, Patcher, Utils } = BdApi;
const Logger = { info: console.log, warn: console.warn, error: console.error, debug: console.debug };

const Filters = Webpack.Filters ?? {
	byProps: (...props) => (m) => props.every(p => m && (p in m)),
	byStoreName: (name) => (m) => !!(m && typeof m === "object" && (m[name] !== undefined || Object.keys(m || {}).some(k => typeof k === "string" && k.toLowerCase().includes(name.toLowerCase())))),
	bySource: () => () => false
};

// Use Webpack.Stores directly like AutoQuestComplete for better reliability
let ApplicationStreamingStore = Webpack.Stores?.ApplicationStreamingStore ?? null;
let RunningGameStore = Webpack.Stores?.RunningGameStore ?? null;
let QuestsStore = Webpack.Stores?.QuestStore ?? null;
let ChannelStore = Webpack.Stores?.ChannelStore ?? null;
let GuildChannelStore = Webpack.Stores?.GuildChannelStore ?? null;
let FluxDispatcher = Webpack.getByKeys?.('dispatch', 'subscribe', 'register') ?? null;

let apiModule = null;
try {
	if (typeof Webpack.getBySource === "function") {
		apiModule = Webpack.getBySource('bind(null,"get")');
	}
	if (!apiModule && typeof Webpack.getModule === "function") {
		apiModule = Webpack.getModule(m => m?.tn?.get);
	}
} catch (e) { /* ignore */ }
const api = apiModule?.tn ?? null;

let _cachedQuestsStore = null;
function getQuestsStore() {
    if (_cachedQuestsStore) return _cachedQuestsStore;

    // Priority 1: Use Webpack.Stores like AutoQuestComplete
    if (Webpack.Stores?.QuestStore) {
        _cachedQuestsStore = Webpack.Stores.QuestStore;
        return _cachedQuestsStore;
    }

    // Priority 2: Use already resolved store
    if (typeof QuestsStore !== "undefined" && QuestsStore) {
        _cachedQuestsStore = QuestsStore;
        return _cachedQuestsStore;
    }

    const chunk = resolveStoresFromChunk();
    if (chunk?.QuestsStore) {
        _cachedQuestsStore = chunk.QuestsStore;
        if (!api && chunk.api) {
            try { Object.defineProperty(window, "chunkApi", { value: chunk.api, configurable: true }) } catch(e){/*ignore*/}
        }
        return _cachedQuestsStore;
    }

    const safeCheck = (m) => {
        try {
            if (!m) return false;
            const t = typeof m;
            if (t !== "object" && t !== "function") return false;
            if (m.quests) return true;
            if (typeof m.getAll === "function" || typeof m.getQuests === "function") return true;
            const keys = Object.keys(m || {});
            return keys.some(k => /quest/i.test(k));
        } catch (e) {
            return false;
        }
    };

    try {
        const byProps = Webpack.getModule?.(safeCheck);
        if (byProps) {
            _cachedQuestsStore = byProps;
            return _cachedQuestsStore;
        }

        const maybe = Webpack.getBulk(
            { filter: Filters.byStoreName("QuestsStore") },
            { filter: Filters.byStoreName("QuestStore") },
            { filter: Filters.byStoreName("Quests") }
        );
        const chosen = Array.isArray(maybe) ? maybe.find(Boolean) : maybe;
        if (chosen) {
            _cachedQuestsStore = chosen;
            return _cachedQuestsStore;
        }
    } catch (err) {
        console.warn("FarmQuests: error while searching for QuestsStore", err);
    }

    _cachedQuestsStore = null;
    return null;
}

let _chunkStores = null;
function resolveStoresFromChunk() {
	try {
		if (typeof webpackChunkdiscord_app === "undefined") return null;
		if (_chunkStores) return _chunkStores;

		delete window.$;
		const wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
		webpackChunkdiscord_app.pop();
		const modules = Object.values(wpRequire.c || {});

		// Helper to find module exports matching a test function (with null safety)
		const findModule = test => {
			if (!modules || !Array.isArray(modules)) return null;
			for (const m of modules) {
				try {
					if (!m || typeof m !== 'object') continue;
					if (!m.exports || typeof m.exports !== 'object') continue;
					if (test(m.exports)) return m.exports;
					// Also check if test matches the module itself
					if (test(m)) return m;
				} catch(e){ /* ignore individual module errors */ }
			}
			return null;
		};

		// Updated selectors based on Discord's January 2026 update (from aamiaa's gist)
		// These use the new export patterns: exports.A.__proto__, exports.Ay, exports.h, exports.Bo
		_chunkStores = {
			// ApplicationStreamingStore - exports.A.__proto__.getStreamerActiveStreamMetadata
			ApplicationStreamingStore: findModule(x => x?.exports?.A?.__proto__?.getStreamerActiveStreamMetadata)?.exports?.A ?? 
				findModule(x => x?.A?.__proto__?.getStreamerActiveStreamMetadata)?.A ?? null,
			
			// RunningGameStore - exports.Ay.getRunningGames
			RunningGameStore: findModule(x => x?.exports?.Ay?.getRunningGames)?.exports?.Ay ?? 
				findModule(x => x?.Ay?.getRunningGames)?.Ay ?? null,
			
			// QuestsStore - exports.A.__proto__.getQuest
			QuestsStore: findModule(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A ?? 
				findModule(x => x?.A?.__proto__?.getQuest)?.A ?? null,
			
			// ChannelStore - exports.A.__proto__.getAllThreadsForParent
			ChannelStore: findModule(x => x?.exports?.A?.__proto__?.getAllThreadsForParent)?.exports?.A ?? 
				findModule(x => x?.A?.__proto__?.getAllThreadsForParent)?.A ?? null,
			
			// GuildChannelStore - exports.Ay.getSFWDefaultChannel
			GuildChannelStore: findModule(x => x?.exports?.Ay?.getSFWDefaultChannel)?.exports?.Ay ?? 
				findModule(x => x?.Ay?.getSFWDefaultChannel)?.Ay ?? null,
			
			// FluxDispatcher - exports.h.__proto__.flushWaitQueue
			FluxDispatcher: findModule(x => x?.exports?.h?.__proto__?.flushWaitQueue)?.exports?.h ?? 
				findModule(x => x?.h?.__proto__?.flushWaitQueue)?.h ?? null,
			
			// API module - exports.Bo.get
			api: findModule(x => x?.exports?.Bo?.get)?.exports?.Bo ?? 
				findModule(x => x?.Bo?.get)?.Bo ?? null
		};

		return _chunkStores;
	} catch (err) {
		console.warn("FarmQuests: chunk resolver failed", err);
		return null;
	}
}

module.exports = class BasePlugin {
	constructor(meta) {
		this.meta = meta;

		this.settings = new Proxy({}, {
			get: (_target, key) => {
				return Data.load(this.meta.name, key) ?? getSetting(key)?.value;
			},
			set: (_target, key, value) => {
				try {
					Data.save(this.meta.name, key, value);
					const s = getSetting(key);
					if (s && typeof s === 'object') s.value = value;
					return true;
				} catch (e) {
					console.warn('FarmQuests: error saving setting', key, e);
					return false;
				}
			}
		});
		this.updateInterval = null;
		this.autoStartObserver = null;
		this.availableQuests = [];
		this.farmableQuests = [];
		this.farmingQuest = new Map();
		this.fakeGames = new Map();
		this.fakeApplications = new Map();
		// Load previously failed quest IDs from storage (persist across reloads)
		const savedFailedQuests = BdApi.Data.load(this.meta.name, 'failedClaimQuests') || [];
		this.failedClaimQuests = new Set(savedFailedQuests); // Track quests that failed with 400 (manual claim required)
		if (savedFailedQuests.length > 0) {
			this.log('info', `Loaded ${savedFailedQuests.length} quest(s) that require manual claim from storage`);
		}
		
		// Cleanup registry for intervals, timeouts, and subscriptions
		this._cleanupRegistry = {
			intervals: new Set(),
			timeouts: new Set(),
			subscriptions: new Map() // eventName -> [handlers]
		};
		
		// Assign stores directly from Webpack.Stores like AutoQuestComplete does in constructor
		// This is the KEY - AutoQuestComplete does: this._questsStore = Webpack.Stores.QuestStore
		this.QuestsStore = Webpack.Stores?.QuestStore ?? null;
		this.RunningGameStore = Webpack.Stores?.RunningGameStore ?? null;
		this.ApplicationStreamingStore = Webpack.Stores?.ApplicationStreamingStore ?? null;
		this.ChannelStore = Webpack.Stores?.ChannelStore ?? null;
		this.GuildChannelStore = Webpack.Stores?.GuildChannelStore ?? null;
		this.FluxDispatcher = Webpack.getByKeys?.('dispatch', 'subscribe', 'register') ?? null;
		this.api = Webpack.getModule?.(m => m?.tn?.get)?.tn ?? null;
		
		this._boundHandleQuestChange = this.handleQuestChange.bind(this);
		this._boundHandleNewQuest = this.handleNewQuest.bind(this);
		this._activeQuestId = null;
		this._activeQuestName = null;
		
		console.log('[FarmQuests] Constructor - QuestsStore:', !!this.QuestsStore, 'quests:', !!this.QuestsStore?.quests);
		
		// Initialize version tracking
		this._initVersionTracking();
	}

	// ═══════════════════════════════════════════════════════════════
	// CLEANUP REGISTRY HELPERS - Prevents memory leaks
	// ═══════════════════════════════════════════════════════════════
	
	/** Register an interval for cleanup on stop() */
	_registerInterval(intervalId) {
		if (intervalId && this._cleanupRegistry?.intervals) {
			this._cleanupRegistry.intervals.add(intervalId);
		}
		return intervalId;
	}
	
	/** Register a timeout for cleanup on stop() */
	_registerTimeout(timeoutId) {
		if (timeoutId && this._cleanupRegistry?.timeouts) {
			this._cleanupRegistry.timeouts.add(timeoutId);
		}
		return timeoutId;
	}
	
	/** Register a Flux subscription for cleanup on stop() */
	_registerSubscription(eventName, handler) {
		if (!this._cleanupRegistry?.subscriptions) return;
		if (!this._cleanupRegistry.subscriptions.has(eventName)) {
			this._cleanupRegistry.subscriptions.set(eventName, []);
		}
		this._cleanupRegistry.subscriptions.get(eventName).push(handler);
	}
	
	/** Clear a specific interval and remove from registry */
	_clearInterval(intervalId) {
		if (intervalId) {
			clearInterval(intervalId);
			this._cleanupRegistry?.intervals?.delete(intervalId);
		}
	}
	
	/** Clear a specific timeout and remove from registry */
	_clearTimeout(timeoutId) {
		if (timeoutId) {
			clearTimeout(timeoutId);
			this._cleanupRegistry?.timeouts?.delete(timeoutId);
		}
	}

	_initVersionTracking() {
		// Version tracking like AutoQuestComplete
		try {
			let currentVersionInfo = Object.assign({}, { version: config.info.version, hasShownChangelog: false }, Data.load(this.meta.name, "currentVersionInfo") || {});
			if (config.info.version !== currentVersionInfo.version) currentVersionInfo.hasShownChangelog = false;
			currentVersionInfo.version = config.info.version;
			Data.save(this.meta.name, "currentVersionInfo", currentVersionInfo);
			this.currentVersionInfo = currentVersionInfo;
		} catch (err) {
			Logger.error('FarmQuests version tracking failed', err);
			this.currentVersionInfo = { version: config.info.version, hasShownChangelog: false };
		}
	}

	initializeSettings() {
		try {
			// Initialize all settings with defaults if missing
			const defaultSettings = {
				// Page 1: Main Quest Settings
				acceptQuestsAutomatically: true,
				autoCompleteAllQuests: true,
				autoClaimRewards: true,
				retryFailedQuests: true,
				questNotifications: true,
				autoStartVideoQuests: true,
				// Page 2: Advanced Settings
				checkForNewQuests: 5,
				concurrentFarms: 3,
				delayBetweenFarms: 2,
				maxFallbackAttempts: 30,
				claimRetryAttempts: 3,
				verifyQuestCompletion: true,
				suppressQuestProgressPill: false,
				enableVerboseLogging: false
			};
			
			for (const [key, defaultValue] of Object.entries(defaultSettings)) {
				try {
					const stored = Data.load(this.meta.name, key);
					if (typeof stored === 'undefined' || stored === null) {
						Data.save(this.meta.name, key, defaultValue);
						this.log('debug', `Initialized setting ${key} = ${defaultValue}`);
					}
				} catch (e) {
					this.log(`warn`, `Failed to initialize setting ${key}`, e);
				}
			}
		} catch (e) {
			console.warn('FarmQuests: initializeSettings failed', e);
		}
	}

	log(level = 'info', message, data = null) {
		const verbose = !!(this.settings.enableVerboseLogging ?? getSetting('enableVerboseLogging')?.value);
		const prefix = `[FarmQuests]`;
		
		if (level === 'debug' && !verbose) return;
		
		if (data !== null && typeof data === 'object') {
			console[level](`${prefix} ${message}`, data);
		} else if (data !== null) {
			console[level](`${prefix} ${message}:`, data);
		} else {
			console[level](`${prefix} ${message}`);
		}
	}

	/**
	 * Generate debug info string for troubleshooting
	 * @returns {string} Debug info in a copyable format
	 */
	getDebugInfo() {
		try {
			const info = {
				plugin: {
					name: this.meta?.name ?? 'FarmQuests',
					version: config.info.version,
				},
				stores: {
					QuestsStore: !!this.QuestsStore,
					'Webpack.Stores.QuestStore': !!Webpack.Stores?.QuestStore,
					RunningGameStore: !!this.RunningGameStore,
					ApplicationStreamingStore: !!this.ApplicationStreamingStore,
					ChannelStore: !!this.ChannelStore,
					GuildChannelStore: !!this.GuildChannelStore,
					FluxDispatcher: !!this.FluxDispatcher,
					api: !!this.api,
				},
				quests: {
					available: this.availableQuests?.length ?? 0,
					farmable: this.farmableQuests?.length ?? 0,
					farming: this.farmingQuest?.size ?? 0,
				},
				settings: {
					autoCompleteAllQuests: this.settings.autoCompleteAllQuests,
					autoClaimRewards: this.settings.autoClaimRewards,
					verboseLogging: this.settings.enableVerboseLogging,
				},
				discord: {
					isApp: typeof DiscordNative !== 'undefined',
					bdVersion: BdApi.version ?? 'unknown',
				},
				timestamp: new Date().toISOString(),
			};
			return '```json\n' + JSON.stringify(info, null, 2) + '\n```';
		} catch (e) {
			return `Debug info generation failed: ${e.message}`;
		}
	}

	/**
	 * Copy debug info to clipboard and show toast
	 */
	copyDebugInfo() {
		try {
			const debugInfo = this.getDebugInfo();
			if (typeof DiscordNative !== 'undefined' && DiscordNative.clipboard) {
				DiscordNative.clipboard.copy(debugInfo);
			} else {
				navigator.clipboard.writeText(debugInfo);
			}
			UI.showToast('Debug info copied to clipboard!', { type: 'success' });
		} catch (e) {
			UI.showToast('Failed to copy debug info', { type: 'error' });
			console.error('[FarmQuests] copyDebugInfo failed:', e);
		}
	}

	/**
	 * Show a user-friendly error notice with debug option
	 * @param {string} title Error title
	 * @param {string} message Error message
	 * @param {Error} [error] Optional error object
	 */
	showErrorNotice(title, message, error = null) {
		try {
			const fullMessage = error ? `${message}\n\nError: ${error.message}` : message;
			
			if (typeof UI.showNotification === 'function') {
				UI.showNotification({
					title: `⚠️ ${title}`,
					content: fullMessage,
					type: 'error',
					duration: 10000,
					actions: [
						{
							label: '📋 Copy Debug Info',
							onClick: () => this.copyDebugInfo()
						},
						{
							label: 'Dismiss',
							onClick: () => {}
						}
					]
				});
			} else {
				UI.showToast(`${title}: ${message}`, { type: 'error' });
			}
		} catch (e) {
			console.error('[FarmQuests] showErrorNotice failed:', e);
		}
	}

	ensureStores() {
		try {
			// Reset ALL cached stores to force fresh resolution (fixes enable/disable without restart)
			_chunkStores = null;
			_cachedQuestsStore = null;
			
			// Priority 1: Use Webpack.Stores directly like AutoQuestComplete (most reliable)
			this.QuestsStore = Webpack.Stores?.QuestStore ?? null;
			this.RunningGameStore = Webpack.Stores?.RunningGameStore ?? null;
			this.ApplicationStreamingStore = Webpack.Stores?.ApplicationStreamingStore ?? null;
			this.ChannelStore = Webpack.Stores?.ChannelStore ?? null;
			this.GuildChannelStore = Webpack.Stores?.GuildChannelStore ?? null;
			this.FluxDispatcher = Webpack.getByKeys?.('dispatch', 'subscribe', 'register') ?? null;
			this.api = Webpack.getModule?.(m => m?.tn?.get)?.tn ?? null;
			
			// Priority 2: Fallback to chunk resolution if Webpack.Stores doesn't work
			if (!this.QuestsStore || !this.FluxDispatcher || !this.api) {
				const chunk = resolveStoresFromChunk() ?? {};
				this.QuestsStore = this.QuestsStore ?? chunk.QuestsStore ?? null;
				this.RunningGameStore = this.RunningGameStore ?? chunk.RunningGameStore ?? null;
				this.ApplicationStreamingStore = this.ApplicationStreamingStore ?? chunk.ApplicationStreamingStore ?? null;
				this.ChannelStore = this.ChannelStore ?? chunk.ChannelStore ?? null;
				this.GuildChannelStore = this.GuildChannelStore ?? chunk.GuildChannelStore ?? null;
				this.FluxDispatcher = this.FluxDispatcher ?? chunk.FluxDispatcher ?? null;
				this.api = this.api ?? chunk.api ?? null;
			}
			
			// Show warning if critical modules are missing
			const missing = [];
			if (!this.QuestsStore) missing.push('QuestsStore');
			if (!this.FluxDispatcher) missing.push('FluxDispatcher');
			if (!this.api) missing.push('API');
			
			if (missing.length > 0) {
				this.showErrorNotice(
					'Missing Modules',
					`Some Discord modules could not be found: ${missing.join(', ')}. The plugin may not work correctly.`
				);
			}
			
			// Set DiscordModules as alias to FluxDispatcher for backward compatibility
			this.DiscordModules = this.FluxDispatcher;
			
			const verbose = !!(this.settings.enableVerboseLogging ?? getSetting('enableVerboseLogging')?.value);
			if (verbose) console.debug("FarmQuests: resolved stores:", {
				RunningGameStore: !!this.RunningGameStore,
				ApplicationStreamingStore: !!this.ApplicationStreamingStore,
				QuestsStore: !!this.QuestsStore,
				ChannelStore: !!this.ChannelStore,
				GuildChannelStore: !!this.GuildChannelStore,
				FluxDispatcher: !!this.FluxDispatcher,
				api: !!this.api
			});
		} catch (e) {
			console.warn("FarmQuests: ensureStores failed", e);
			this.showErrorNotice('Store Resolution Failed', 'Failed to find Discord modules.', e);
		}
	}

	startAutoStart() {
		try {
			if (this.autoStartObserver) return;

			const clickStartButtons = () => {
				const nodes = Array.from(document.querySelectorAll('button, a'));
				for (const n of nodes) {
					try {
						const text = (n.innerText || n.textContent || '').trim();
						if (!text) continue;
						if (text.includes('Start Video Quest')) {
							console.info('FarmQuests: auto-starting video quest button');
							n.click();
						}
					} catch (e) { /* ignore element read errors */ }
				}
			};

			clickStartButtons();

			this.autoStartObserver = new MutationObserver(() => {
				clickStartButtons();
			});
			this.autoStartObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
		} catch (e) {
			console.warn('FarmQuests: startAutoStart failed', e);
		}
	}

	stopAutoStart() {
		try {
			if (this.autoStartObserver) {
				this.autoStartObserver.disconnect();
				this.autoStartObserver = null;
			}
		} catch (e) {
			console.warn('FarmQuests: stopAutoStart failed', e);
		}
	}

	getSettingsPanel() {
		try {
			const self = this;
			let currentPage = 1;
			
			const createPagedPanel = () => {
				const container = document.createElement('div');
				container.style.cssText = 'padding: 16px; background: var(--background-secondary); border-radius: 8px; max-width: 800px;';
				
				// Page tabs
				const tabsContainer = document.createElement('div');
				tabsContainer.style.cssText = 'display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid var(--background-modifier-accent); padding-bottom: 12px;';
				
				const createTab = (label, page) => {
					const tab = document.createElement('button');
					tab.textContent = label;
					const isActive = currentPage === page;
					tab.style.cssText = `padding: 10px 20px; border: none; border-radius: 6px; background: ${isActive ? 'var(--brand-experiment)' : 'var(--background-tertiary)'}; color: ${isActive ? 'white' : 'var(--text-normal)'}; cursor: pointer; font-weight: ${isActive ? '600' : '400'}; transition: all 0.2s ease; font-size: 14px;`;
					tab.onmouseenter = () => { if (!isActive) tab.style.background = 'var(--background-modifier-hover)'; };
					tab.onmouseleave = () => { if (!isActive) tab.style.background = 'var(--background-tertiary)'; };
					tab.onclick = () => { currentPage = page; container.replaceWith(createPagedPanel()); };
					return tab;
				};
				
				tabsContainer.appendChild(createTab('⚙️ Automation', 1));
				tabsContainer.appendChild(createTab('🔧 Advanced', 2));
				container.appendChild(tabsContainer);
				
				// Settings container
				const settingsContainer = document.createElement('div');
				settingsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
				
				const pageSettings = config.settings.filter(s => s.page === currentPage);
				
				pageSettings.forEach(setting => {
					if (setting.type === 'header') {
						const header = document.createElement('h3');
						header.textContent = setting.text;
						header.style.cssText = 'margin: 20px 0 10px 0; font-size: 16px; font-weight: 600; color: var(--header-primary); border-left: 4px solid var(--brand-experiment); padding-left: 12px;';
						settingsContainer.appendChild(header);
						return;
					}
					
					if (setting.type === 'divider') {
						const divider = document.createElement('div');
						divider.style.cssText = 'height: 1px; background: var(--background-modifier-accent); margin: 12px 0;';
						settingsContainer.appendChild(divider);
						return;
					}
					
					if (setting.type === 'info') {
						const info = document.createElement('div');
						info.textContent = setting.text;
						info.style.cssText = 'padding: 12px 16px; background: var(--info-warning-background); border-left: 4px solid var(--info-warning-foreground); border-radius: 4px; color: var(--text-normal); font-size: 13px; line-height: 1.5;';
						settingsContainer.appendChild(info);
						return;
					}
					
					const settingRow = document.createElement('div');
					settingRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: var(--background-primary); border-radius: 6px; transition: background 0.15s ease;';
					settingRow.onmouseenter = () => settingRow.style.background = 'var(--background-modifier-hover)';
					settingRow.onmouseleave = () => settingRow.style.background = 'var(--background-primary)';
					
					const labelDiv = document.createElement('div');
					labelDiv.style.cssText = 'flex: 1;';
					
					const label = document.createElement('div');
					label.textContent = setting.name;
					label.style.cssText = 'font-weight: 500; color: var(--header-primary); font-size: 15px; margin-bottom: 4px;';
					
					const note = document.createElement('div');
					note.textContent = setting.note;
					note.style.cssText = 'font-size: 13px; color: var(--text-muted); line-height: 1.4;';
					
					labelDiv.appendChild(label);
					labelDiv.appendChild(note);
					settingRow.appendChild(labelDiv);
					
					if (setting.type === 'switch') {
						const switchContainer = document.createElement('div');
						switchContainer.style.cssText = 'position: relative; width: 48px; height: 26px; flex-shrink: 0;';
						
						const switchInput = document.createElement('input');
						switchInput.type = 'checkbox';
						switchInput.checked = self.settings[setting.id] ?? setting.value;
						switchInput.style.cssText = 'opacity: 0; width: 0; height: 0; position: absolute;';
						
						const slider = document.createElement('span');
						slider.style.cssText = `position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: ${switchInput.checked ? 'var(--brand-experiment)' : 'var(--background-modifier-accent)'}; border-radius: 34px; transition: 0.3s;`;
						
						const knob = document.createElement('span');
						knob.style.cssText = `position: absolute; content: ''; height: 20px; width: 20px; left: ${switchInput.checked ? '25px' : '3px'}; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);`;
						
						slider.appendChild(knob);
						switchContainer.appendChild(switchInput);
						switchContainer.appendChild(slider);
						
						switchInput.onchange = () => {
							self.settings[setting.id] = switchInput.checked;
							slider.style.background = switchInput.checked ? 'var(--brand-experiment)' : 'var(--background-modifier-accent)';
							knob.style.left = switchInput.checked ? '25px' : '3px';
							if (setting.id === 'autoStartVideoQuests') {
								if (switchInput.checked) self.startAutoStart(); else self.stopAutoStart();
							} else if (setting.id === 'checkForNewQuests') {
								self.startInterval();
							}
						};
						
						switchContainer.onclick = () => { switchInput.checked = !switchInput.checked; switchInput.onchange(); };
						settingRow.appendChild(switchContainer);
					} else if (setting.type === 'number') {
						const numberInput = document.createElement('input');
						numberInput.type = 'number';
						numberInput.value = self.settings[setting.id] ?? setting.value;
						numberInput.min = setting.min;
						numberInput.max = setting.max;
						numberInput.step = setting.step;
						numberInput.style.cssText = 'width: 80px; padding: 8px 12px; background: var(--input-background); border: 1px solid var(--background-tertiary); border-radius: 4px; color: var(--text-normal); font-size: 14px; text-align: center;';
						
						numberInput.oninput = () => {
							const val = Number(numberInput.value);
							if (!isNaN(val)) {
								self.settings[setting.id] = val;
								if (setting.id === 'checkForNewQuests') self.startInterval();
							}
						};
						
						settingRow.appendChild(numberInput);
					}
					
					settingsContainer.appendChild(settingRow);
				});
				
				container.appendChild(settingsContainer);
				
				// Footer
				const footer = document.createElement('div');
				footer.style.cssText = 'margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--background-modifier-accent); display: flex; justify-content: space-between; align-items: center;';
				
				const version = document.createElement('span');
				version.textContent = `FarmQuests v${config.info.version}`;
				version.style.cssText = 'font-size: 12px; color: var(--text-muted);';
				
				const debugBtn = document.createElement('button');
				debugBtn.textContent = '📋 Copy Debug Info';
				debugBtn.style.cssText = 'padding: 8px 16px; background: var(--button-secondary-background); color: var(--text-normal); border: none; border-radius: 4px; cursor: pointer; font-size: 13px; transition: background 0.15s;';
				debugBtn.onmouseenter = () => debugBtn.style.background = 'var(--button-secondary-background-hover)';
				debugBtn.onmouseleave = () => debugBtn.style.background = 'var(--button-secondary-background)';
				debugBtn.onclick = () => self.copyDebugInfo();
				
				footer.appendChild(version);
				footer.appendChild(debugBtn);
				container.appendChild(footer);
				
				return container;
			};
			
			return createPagedPanel();
		} catch (e) {
			console.error('FarmQuests: buildSettingsPanel failed', e);
			try {
				const fallback = document.createElement('div');
				fallback.style.color = '#fff';
				fallback.style.padding = '12px';
				fallback.style.whiteSpace = 'pre-wrap';
				fallback.innerText = 'FarmQuests: failed to open settings. Error:\n' + (e && e.toString ? e.toString() : String(e));
				return fallback;
			} catch (e2) {
				return null;
			}
		}
	}

	showChangelog() {
		if (!this.currentVersionInfo.hasShownChangelog && config.changelog.length > 0) {
			UI.showChangelogModal({
				title: this.meta.name,
				subtitle: this.meta.version,
				changes: config.changelog
			});
			this.currentVersionInfo.hasShownChangelog = true;
			Data.save(this.meta.name, "currentVersionInfo", this.currentVersionInfo);
		}
	}

	async checkForUpdate() {
		try {
			const response = await fetch(config.info.github_raw, { headers: { "User-Agent": "BetterDiscord" } });
			if (!response.ok) return;
			const fileContent = await response.text();
			const remoteMeta = this.parseMeta(fileContent);
			// Check if remote version is newer (compareVersions returns < 0 if v1 < v2)
			if (remoteMeta.version && this.compareVersions(config.info.version, remoteMeta.version) < 0) {
				this.showUpdateNotification(remoteMeta, fileContent);
			}
		} catch (err) {
			this.log('warn', 'Failed to check for updates', err.message);
		}
	}

	parseMeta(fileContent) {
		const meta = {};
		const regex = /@([a-zA-Z]+)\s+(.+)/g;
		let match;
		while ((match = regex.exec(fileContent)) !== null) {
			meta[match[1]] = match[2].trim();
		}
		return meta;
	}

	compareVersions(v1, v2) {
		// Use BdApi Utils.semverCompare like AutoQuestComplete for better reliability
		if (Utils && typeof Utils.semverCompare === 'function') {
			return Utils.semverCompare(v1, v2);
		}
		// Fallback to manual comparison
		const parts1 = v1.split('.').map(Number);
		const parts2 = v2.split('.').map(Number);
		for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
			const p1 = parts1[i] || 0;
			const p2 = parts2[i] || 0;
			if (p1 < p2) return -1;
			if (p1 > p2) return 1;
		}
		return 0;
	}

	showUpdateNotification(remoteMeta, remoteFile) {
		this.log('info', `Update available: ${remoteMeta.version}`);
		try {
			if (typeof UI.showNotification === 'function') {
				UI.showNotification({
					title: `${this.meta.name} Update Available!`,
					content: `Version ${remoteMeta.version} is now available!`,
					type: 'info',
					duration: 1/0,
					actions: [
						{
							label: 'Update Now',
							onClick: async () => {
								if (remoteFile) {
									try {
										const fs = require('fs');
										const path = require('path');
										await new Promise(r => fs.writeFile(path.join(BdApi.Plugins.folder, `${config.info.name}.plugin.js`), remoteFile, r));
										// Reset changelog flag like AutoQuestComplete
										let currentVersionInfo = Data.load(this.meta.name, "currentVersionInfo") || {};
										currentVersionInfo.hasShownChangelog = false;
										Data.save(this.meta.name, "currentVersionInfo", currentVersionInfo);
										UI.showToast('Update downloaded! Please reload Discord.', { type: 'success' });
									} catch (err) {
										this.log('error', 'Failed to download update', err.message);
										UI.showToast('Failed to download update', { type: 'error' });
									}
								}
							}
						},
						{ label: 'Update Later', onClick: () => {} }
					]
				});
			} else {
				UI.showToast(`Update ${remoteMeta.version} available for ${this.meta.name}!`, { type: 'info' });
			}
		} catch (e) {
			this.log('warn', 'Failed to show update notification', e.message);
		}
	}

	showQuestNotification(quest, completed = false) {
		if (!this.settings.questNotifications) return;
		try {
			const questName = quest?.config?.messages?.questName ?? quest?.config?.application?.name ?? 'Quest';
			if (typeof UI.showNotification === 'function') {
				UI.showNotification({
					title: completed ? 'Quest Completed!' : 'Quest Started',
					content: completed ? `Successfully completed ${questName}!` : `Farming ${questName}...`,
					type: completed ? 'success' : 'info',
					duration: 5000
				});
			} else {
				UI.showToast(completed ? `Quest completed: ${questName}` : `Farming: ${questName}`, { 
					type: completed ? 'success' : 'info' 
				});
			}
		} catch (e) {
			this.log('debug', 'Failed to show quest notification', e.message);
		}
	}

	start() {
		console.log('[FarmQuests] Starting plugin...');
		this.showChangelog();
		this.initializeSettings();
		this.ensureStores();
		this.checkForUpdate().catch(() => {});

		// Debug: Log store availability
		console.log('[FarmQuests] Stores after ensureStores:', {
			QuestsStore: !!this.QuestsStore,
			'Webpack.Stores.QuestStore': !!Webpack.Stores?.QuestStore,
			RunningGameStore: !!this.RunningGameStore,
			FluxDispatcher: !!this.FluxDispatcher,
			api: !!this.api
		});

		// Add quest change listeners like AutoQuestComplete
		try {
			// Use FRESH store from Webpack.Stores like AutoQuestComplete
			const questStore = Webpack.Stores?.QuestStore ?? this.QuestsStore;
			if (questStore && typeof questStore.addChangeListener === 'function') {
				questStore.addChangeListener(this._boundHandleQuestChange);
				questStore.addChangeListener(this._boundHandleNewQuest);
				console.log('[FarmQuests] Added change listeners to QuestStore');
			} else {
				console.warn('[FarmQuests] Could not add change listeners - questStore:', !!questStore);
			}
		} catch (e) {
			this.log('warn', 'Failed to add quest change listeners', e.message);
		}

		// Setup patchers for running games and streaming
		if (this.RunningGameStore) {
			Patcher.instead(this.meta.name, this.RunningGameStore, "getRunningGames", (thisObject, args, originalFunction) => {
				if (this.fakeGames.size > 0) {
					return Array.from(this.fakeGames.values());
				}
				return originalFunction?.apply(thisObject, args);
			});
			Patcher.instead(this.meta.name, this.RunningGameStore, "getGameForPID", (thisObject, args, originalFunction) => {
				if (this.fakeGames.size > 0) {
					return Array.from(this.fakeGames.values()).find(game => game.pid === args?.[0]);
				}
				return originalFunction?.apply(thisObject, args);
			});
		}

		if (this.ApplicationStreamingStore) {
			Patcher.instead(this.meta.name, this.ApplicationStreamingStore, "getStreamerActiveStreamMetadata", (thisObject, args, originalFunction) => {
				if (this.fakeApplications.size > 0) {
					const arr = Array.from(this.fakeApplications.values());
					return arr.length ? arr[0] : null;
				}
				return originalFunction?.apply(thisObject, args);
			});
		}

		// IMMEDIATELY check and run quests like AutoQuestComplete (don't wait for interval)
		this.runImmediateQuestCheck();
		
		this.startInterval();
		try {
			if (this.settings.autoStartVideoQuests ?? getSetting('autoStartVideoQuests')?.value) {
				this.startAutoStart();
			}
		} catch (e) { /* ignore */ }

		// Claim any completed quests on startup
		if (this.settings.autoClaimRewards) {
			setTimeout(() => this.claimAllCompletedQuests(), 5000); // Wait 5s for Discord to fully load
		}
		
		this.log('info', 'Plugin started successfully!');
		UI.showToast('FarmQuests started!', { type: 'success' });
	}

	stop() {
		this.stopInterval();
		this.stopAutoStart();
		
		// Clear all farming states
		this.farmingQuest.clear();
		this.fakeGames.clear();
		this.fakeApplications.clear();
		this.failedClaimQuests.clear();
		
		// Cleanup all registered intervals
		if (this._cleanupRegistry?.intervals) {
			for (const intervalId of this._cleanupRegistry.intervals) {
				try { clearInterval(intervalId); } catch(e) {}
			}
			this._cleanupRegistry.intervals.clear();
		}
		
		// Cleanup all registered timeouts
		if (this._cleanupRegistry?.timeouts) {
			for (const timeoutId of this._cleanupRegistry.timeouts) {
				try { clearTimeout(timeoutId); } catch(e) {}
			}
			this._cleanupRegistry.timeouts.clear();
		}
		
		// Cleanup all Flux subscriptions
		if (this._cleanupRegistry?.subscriptions && this.FluxDispatcher) {
			for (const [eventName, handlers] of this._cleanupRegistry.subscriptions) {
				for (const handler of handlers) {
					try { this.FluxDispatcher.unsubscribe(eventName, handler); } catch(e) {}
				}
			}
			this._cleanupRegistry.subscriptions.clear();
		}
		
		// Remove quest change listeners like AutoQuestComplete
		try {
			const questStore = Webpack.Stores?.QuestStore ?? this.QuestsStore;
			if (questStore && typeof questStore.removeChangeListener === 'function') {
				questStore.removeChangeListener(this._boundHandleQuestChange);
				questStore.removeChangeListener(this._boundHandleNewQuest);
			}
		} catch (e) {
			this.log('warn', 'Failed to remove quest change listeners', e.message);
		}
		
		Patcher.unpatchAll(this.meta.name);
		this.log('info', 'Plugin stopped');
	}

	// NEW: Immediately check and run quests on startup (like AutoQuestComplete)
	runImmediateQuestCheck() {
		try {
			// Get FRESH QuestsStore directly like AutoQuestComplete
			const questStore = Webpack.Stores?.QuestStore ?? this.QuestsStore;
			
			console.log('[FarmQuests] runImmediateQuestCheck - QuestStore:', !!questStore, 'quests:', !!questStore?.quests);
			
			if (!questStore || !questStore.quests) {
				this.log('warn', 'QuestsStore not available for immediate check');
				this.updateQuests(); // Fallback to regular update
				return;
			}

			// Log all quests for debugging
			const allQuests = [...questStore.quests.values()];
			console.log('[FarmQuests] All quests count:', allQuests.length);
			allQuests.forEach(q => {
				console.log('[FarmQuests] Quest:', q.id, 'enrolled:', !!q.userStatus?.enrolledAt, 'completed:', !!q.userStatus?.completedAt, 'expires:', q.config?.expiresAt);
			});

			// Find enrolled but not completed quests (same logic as AutoQuestComplete)
			const quest = allQuests.find(x =>
				x.id !== "1248385850622869556" &&
				x.userStatus?.enrolledAt &&
				!x.userStatus?.completedAt &&
				new Date(x.config.expiresAt).getTime() > Date.now()
			);

			if (quest) {
				this._activeQuestId = quest.config.application.id;
				this._activeQuestName = quest.config.application.name;
				console.log('[FarmQuests] Found active quest:', this._activeQuestName, 'ID:', quest.id);
				UI.showToast(`Found quest: ${this._activeQuestName}`, { type: 'info' });
				this.farmQuest(quest);
			} else {
				console.log('[FarmQuests] No active enrolled quests found');
			}

			// Also run regular updateQuests for full quest list
			this.updateQuests();
		} catch (e) {
			console.error('[FarmQuests] runImmediateQuestCheck failed:', e);
			this.updateQuests(); // Fallback
		}
	}

	startInterval() {
		this.stopInterval();
		const raw = this.settings.checkForNewQuests ?? getSetting("checkForNewQuests")?.value ?? 5;
		const minutes = Math.max(1, Number(raw) || 5);
		this.updateInterval = setInterval(() => {
			this.updateQuests();
		}, minutes * 60 * 1000);
	}

	stopInterval() {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}
	}

	// Automatically claim all completed quests
	async claimAllCompletedQuests() {
		try {
			if (!this.settings.autoClaimRewards) {
				this.log('debug', 'Auto-claim is disabled, skipping claim all');
				return;
			}

			const store = this.QuestsStore ?? getQuestsStore();
			if (!store) {
				this.log('warn', 'QuestsStore not available for claiming');
				return;
			}

			let questsList = [];
			if (typeof store.quests !== "undefined") {
				if (typeof store.quests.values === "function") questsList = [...store.quests.values()];
				else if (Array.isArray(store.quests)) questsList = store.quests;
				else questsList = Object.values(store.quests || {});
			} else if (typeof store.getAll === "function") {
				const res = store.getAll();
				questsList = Array.isArray(res) ? res : Object.values(res || {});
			}

			const completedQuests = questsList.filter(q => {
				if (!q || !q.userStatus) return false;
				const completed = !!(q.userStatus.completedAt || q.userStatus.completed_at || q.userStatus.completed);
				const claimed = !!(q.userStatus.claimedAt || q.userStatus.claimed_at || q.userStatus.claimed);
				return completed && !claimed;
			});

			if (completedQuests.length === 0) {
				this.log('debug', 'No completed unclaimed quests found');
				return;
			}

			this.log('info', `Found ${completedQuests.length} completed quests ready to claim`);
			UI.showToast(`Found ${completedQuests.length} quest(s) to claim...`, { type: 'info' });

			let claimedCount = 0;
			for (const quest of completedQuests) {
				try {
					// Skip quests that previously failed with 400 (manual claim required)
					if (this.failedClaimQuests && this.failedClaimQuests.has(quest.id)) {
						this.log('debug', `Skipping quest ${quest.id} - requires manual claim (API deprecated)`);
						continue;
					}
					
					this.log('info', `Claiming quest: ${quest.config?.messages?.questName || quest.id}`);
					const success = await this.claimQuestRewards(quest);
					if (success) {
						claimedCount++;
						await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between claims
					}
				} catch (e) {
					this.log('warn', `Failed to claim quest ${quest.id}:`, e.message);
				}
			}

			if (claimedCount > 0) {
				this.log('info', `Successfully claimed ${claimedCount} quest(s)`);
				UI.showToast(`Successfully claimed ${claimedCount} quest reward(s)!`, { type: 'success' });
			} else {
				UI.showToast('Failed to claim quest rewards. Try manually.', { type: 'warning' });
			}
		} catch (err) {
			this.log('error', 'claimAllCompletedQuests failed', err.message);
		}
	}

	updateQuests() {
		try {
			const store = this.QuestsStore ?? getQuestsStore();
			if (!store) {
				console.error("FarmQuests: QuestsStore not found. If you see this repeatedly, run in console: Webpack.getModule(m=>Object.keys(m||{}).slice(0,10)).slice(0,20) and paste output.");
				this.availableQuests = [];
				this.farmableQuests = [];
				return;
			}

			let questsList = [];
			if (typeof store.quests !== "undefined") {
				if (typeof store.quests.values === "function") questsList = [...store.quests.values()];
				else if (Array.isArray(store.quests)) questsList = store.quests;
				else questsList = Object.values(store.quests || {});
			} else if (typeof store.getAll === "function") {
				const res = store.getAll();
				questsList = Array.isArray(res) ? res : Object.values(res || {});
			} else if (typeof store.getQuests === "function") {
				const res = store.getQuests();
				questsList = Array.isArray(res) ? res : Object.values(res || {});
			} else {
				questsList = Object.values(store || {});
			}

			this.availableQuests = questsList || [];

			const isEnrolled = (u) => {
				if (!u) return false;
				return !!(u.enrolledAt || u.enrolled_at || u.enrolled || u.enrolledAt === 0);
			};
			const isCompleted = (u) => {
				if (!u) return false;
				return !!(u.completedAt || u.completed_at || u.completed || u.completedAt === 0);
			};

			this.farmableQuests = (this.availableQuests || []).filter(x => {
				try {
					if (!x) return false;
					if (x.id === "1248385850622869556") return false;
					const enrolled = isEnrolled(x.userStatus);
					const completed = isCompleted(x.userStatus);
					const expires = x?.config?.expiresAt ? new Date(x.config.expiresAt).getTime() : Infinity;
					return enrolled && !completed && expires > Date.now();
				} catch (e) {
					return false;
				}
			});

			const total = this.availableQuests.length;
			const withUserStatus = this.availableQuests.filter(q => !!q.userStatus).length;
			const withEnrolled = this.availableQuests.filter(q => isEnrolled(q.userStatus)).length;
			const withCompleted = this.availableQuests.filter(q => isCompleted(q.userStatus)).length;
			this.log('info', `Found ${total} quests (userStatus: ${withUserStatus}, enrolled: ${withEnrolled}, completed: ${withCompleted}). Farmable: ${this.farmableQuests.length}`);
			const verbose = !!(this.settings.enableVerboseLogging ?? getSetting('enableVerboseLogging')?.value);
			if (this.farmableQuests.length === 0) {
				if (verbose) {
					this.log('debug', "Sample available quest keys:", (this.availableQuests[0] && Object.keys(this.availableQuests[0]).slice(0,20)) || []);
					this.log('debug', "Sample userStatus keys:", (this.availableQuests[0]?.userStatus && Object.keys(this.availableQuests[0].userStatus).slice(0,20)) || []);
				}
			}

			const concurrentLimit = Math.max(1, Number(this.settings.concurrentFarms ?? getSetting('concurrentFarms')?.value ?? 3));

			for (const quest of this.farmableQuests) {
				if (this.farmingQuest.has(quest.id)) {
					if (this.farmingQuest.get(quest.id) === false) {
						this.farmingQuest.delete(quest.id);
					}
				} else {
					const activeCount = Array.from(this.farmingQuest.values()).filter(v => v === true).length;
					if (activeCount >= concurrentLimit) {
						if (verbose) console.info(`FarmQuests: concurrent limit reached (${activeCount}/${concurrentLimit}), deferring quest ${quest.id}`);
						continue;
					}
					this.farmQuest(quest);
				}
			}
			if (verbose) console.log("Farmable quests updated:", this.farmableQuests);

			// Automatically claim any completed quests
			if (this.settings.autoClaimRewards) {
				const completedUnclaimed = (this.availableQuests || []).filter(q => {
					if (!q || !q.userStatus) return false;
					const completed = !!(q.userStatus.completedAt || q.userStatus.completed_at || q.userStatus.completed);
					const claimed = !!(q.userStatus.claimedAt || q.userStatus.claimed_at || q.userStatus.claimed);
					return completed && !claimed;
				});

				if (completedUnclaimed.length > 0) {
					this.log('info', `Detected ${completedUnclaimed.length} completed unclaimed quest(s), claiming...`);
					// Claim in background without blocking
					setTimeout(() => this.claimAllCompletedQuests(), 2000);
				}
			}
		} catch (err) {
			console.error("FarmQuests: failed to update quests", err);
		}
	}

	// Quest change handler like AutoQuestComplete
	handleQuestChange() {
		try {
			const store = this.QuestsStore ?? getQuestsStore();
			if (!store) return;
			
			const quest = [...(store.quests?.values?.() || [])].find(x =>
				x.id !== "1248385850622869556" &&
				x.userStatus?.enrolledAt &&
				!x.userStatus?.completedAt &&
				new Date(x.config.expiresAt).getTime() > Date.now()
			);

			if (quest && quest.config.application.id !== this._activeQuestId) {
				this._activeQuestId = quest.config.application.id;
				this._activeQuestName = quest.config.application.name;
				this.log('info', `New quest detected: ${this._activeQuestName}`);
				UI.showToast(`New quest found: ${this._activeQuestName}`, {type:"info"});
				// Trigger quest update
				this.updateQuests();
			}
		} catch (e) {
			this.log('debug', 'handleQuestChange error', e.message);
		}
	}

	// New quest detection like AutoQuestComplete
	handleNewQuest() {
		try {
			const store = this.QuestsStore ?? getQuestsStore();
			if (!store) return;

			const new_quest = [...(store.quests?.values?.() || [])].find(x =>
				x.id !== "1248385850622869556" &&
				!x.userStatus?.enrolledAt &&
				!x.userStatus?.completedAt &&
				new Date(x.config.expiresAt).getTime() > Date.now()
			);

			if (new_quest && this.settings.questNotifications) {
				this.showNewQuestNotification(new_quest);
			}
		} catch (e) {
			this.log('debug', 'handleNewQuest error', e.message);
		}
	}

	// New quest notification like AutoQuestComplete
	showNewQuestNotification(quest) {
		try {
			const questName = quest?.config?.application?.name ?? 'Unknown Quest';
			if (typeof UI.showNotification === 'function') {
				UI.showNotification({
					title: 'New Quest Available!',
					content: `Please accept the quest "${questName}" to start auto farming.`,
					type: 'info',
					duration: 5 * 60 * 1000,
					actions: [
						{
							label: 'Go to Quests',
							onClick: () => {
								try {
									open(`/quests/${quest.id}`);
								} catch (e) {
									this.log('warn', 'Failed to open quest', e.message);
								}
							}
						},
						{
							label: 'Remind Me Later',
							onClick: () => {
								setTimeout(() => {
									this.showNewQuestNotification(quest);
								}, 60 * 60 * 1000);
							}
						}
					]
				});
			} else {
				UI.showToast(`New quest available: ${questName}`, { type: 'info' });
			}
		} catch (e) {
			this.log('debug', 'Failed to show new quest notification', e.message);
		}
	}

	// Complete video quest without watching - proven method from AutoQuestComplete
	async completeVideoQuest(quest, secondsNeeded, secondsDone) {
		try {
			if (!quest || !quest.id) {
				this.log('warn', 'Invalid quest for video completion');
				return;
			}

			// Get FRESH references like AutoQuestComplete does inside runQuest()
			const apiInstance = Webpack.getModule?.(m => m?.tn?.get)?.tn ?? this.api ?? api;
			if (!apiInstance) {
				this.log('error', 'API not available for video quest completion');
				return;
			}

			this.log('info', `Completing video quest ${quest.id} (${quest.config?.messages?.questName || 'Unknown'})`);
			
			const maxPreview = 10; // Max seconds ahead of actual time
			const speed = 7; // Seconds to progress per interval
			const intervalTime = 1; // Seconds between updates
			const enrolledAt = new Date(quest.userStatus?.enrolledAt || Date.now()).getTime();
			let isFinished = false;

			// Fast video completion loop
			while (true) {
				try {
					// Calculate how much we can progress based on enrollment time
					const maxAllowedTime = Math.floor((Date.now() - enrolledAt) / 1000) + maxPreview;
					const diff = maxAllowedTime - secondsDone;
					const timestamp = secondsDone + speed;

					// Progress if we're within allowed time
					if (diff >= speed) {
						const response = await apiInstance.post({
							url: `/quests/${quest.id}/video-progress`,
							body: { timestamp: Math.min(secondsNeeded, timestamp + Math.random()) }
						});
						
						// Check if quest is marked as completed
						isFinished = response?.body?.completed_at != null;
						secondsDone = Math.min(secondsNeeded, timestamp);
						
						this.log('debug', `Video progress: ${secondsDone}/${secondsNeeded}`, isFinished ? '(completed)' : '');
					}

					// Break if we've reached the target
					if (timestamp >= secondsNeeded) {
						break;
					}

					// Wait before next update
					await new Promise(resolve => setTimeout(resolve, intervalTime * 1000));
				} catch (e) {
					this.log('warn', 'Video progress update error', e.message);
					// Continue trying even if one update fails
					await new Promise(resolve => setTimeout(resolve, intervalTime * 1000));
				}
			}

			// Final completion call if not already marked finished
			if (!isFinished) {
				try {
					await apiInstance.post({
						url: `/quests/${quest.id}/video-progress`,
						body: { timestamp: secondsNeeded }
					});
					this.log('info', 'Sent final video completion');
				} catch (e) {
					this.log('warn', 'Final video completion failed', e.message);
				}
			}

			// Auto-claim rewards if enabled
			if (this.settings.autoClaimRewards) {
                this.log('info', 'Auto-claim is enabled, waiting for server to process completion...');
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for server to process
                const claimed = await this.claimQuestRewards(quest);
                if (!claimed) {
                    this.log('warn', 'Auto-claim failed, you may need to claim manually');
                    UI.showToast('Quest completed but auto-claim failed. Please claim manually.', { type: 'warning', duration: 5000 });
                }
            }

			// Verify completion if enabled
			if (this.settings.verifyQuestCompletion) {
				await new Promise(resolve => setTimeout(resolve, 500));
				const verification = await this.verifyQuestCompleted(quest.id);
				if (verification) {
					const status = verification.completed && verification.claimed ? 'completed and claimed' : 
								  verification.completed ? 'completed but not claimed' : 'incomplete';
					this.log('info', `Video quest ${quest.id} status: ${status}`);
				}
			}


			// Clean up
			if (this.farmingQuest.has(quest.id)) {
				this.farmingQuest.delete(quest.id);
			}

			this.showQuestNotification(quest, true);
			this.log('info', 'Video quest completed successfully', quest.id);
			UI.showToast(`Quest completed: ${quest.config?.messages?.questName || quest.config?.application?.name}!`, { type: 'success' });

		} catch (err) {
			this.log('error', 'completeVideoQuest failed', err.message);
			if (this.farmingQuest.has(quest.id)) {
				this.farmingQuest.set(quest.id, false);
			}
		}
	}

	stopFarmingAll() {
		for (const quest of this.farmableQuests) {
			if (this.farmingQuest.has(quest.id)) {
				this.farmingQuest.set(quest.id, false);
			}
		}
		console.log("Stopped farming all quests.");
	}

    // Verify quest completion status
    async verifyQuestCompleted(questId) {
        try {
            const store = this.QuestsStore ?? getQuestsStore();
            if (!store) return false;

            let quest = null;
            if (store.quests && typeof store.quests.get === 'function') {
                quest = store.quests.get(questId);
            } else if (typeof store.getQuest === 'function') {
                quest = store.getQuest(questId);
            } else if (typeof store.getAll === 'function') {
                const all = store.getAll();
                quest = Array.isArray(all) ? all.find(q => q && q.id === questId) : (all || {})[questId];
            }

            if (!quest) return false;

            // Check if completed
            const completed = !!(quest.userStatus?.completedAt || quest.userStatus?.completed_at || quest.userStatus?.completed);
            // Check if claimed
            const claimed = !!(quest.userStatus?.claimedAt || quest.userStatus?.claimed_at || quest.userStatus?.claimed);
            
            this.log('debug', `Quest ${questId} verification: completed=${completed}, claimed=${claimed}`);
            return { completed, claimed, quest };
        } catch (e) {
            this.log('warn', 'verifyQuestCompleted failed', e.message);
            return false;
        }
    }

    // Claim quest rewards with retry logic
    async claimQuestRewards(quest, retryCount = 0) {
        const maxRetries = Math.max(1, Number(this.settings.claimRetryAttempts ?? 3));
        
        try {
            if (!quest || !quest.id) {
                this.log('warn', 'Invalid quest for claiming');
                return false;
            }

            this.log('info', `Attempting to claim rewards for quest ${quest.id}`, retryCount > 0 ? `(retry ${retryCount}/${maxRetries})` : '');

            // Check if already claimed before attempting
            const initialCheck = await this.verifyQuestCompleted(quest.id);
            if (initialCheck && initialCheck.claimed) {
                this.log('info', `Quest ${quest.id} is already claimed`);
                return true;
            }

            let claimAttempted = false;
            let apiError = null;

            // Method 1: Use FluxDispatcher action (most reliable for modern Discord)
            if (this.FluxDispatcher) {
                try {
                    this.log('debug', 'Attempting claim via FluxDispatcher QUEST_CLAIM_REWARD');
                    this.FluxDispatcher.dispatch({
                        type: 'QUEST_CLAIM_REWARD',
                        questId: quest.id
                    });
                    claimAttempted = true;
                    
                    // Wait for action to process
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    const verification = await this.verifyQuestCompleted(quest.id);
                    if (verification && verification.claimed) {
                        this.log('info', `Quest ${quest.id} claimed successfully via Flux`);
                        UI.showToast(`Quest rewards claimed: ${quest.config?.messages?.questName || quest.id}`, { type: 'success' });
                        return true;
                    }
                } catch (e) {
                    this.log('debug', 'FluxDispatcher claim failed', e.message);
                }
            }

            // Method 2: Use store methods
            const store = this.QuestsStore ?? getQuestsStore();
            if (store && typeof store.claimReward === 'function') {
                try {
                    this.log('debug', 'Attempting claim via store.claimReward');
                    await store.claimReward(quest.id);
                    claimAttempted = true;
                    
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const verification = await this.verifyQuestCompleted(quest.id);
                    if (verification && verification.claimed) {
                        this.log('info', `Quest ${quest.id} claimed successfully via store`);
                        UI.showToast(`Quest rewards claimed: ${quest.config?.messages?.questName || quest.id}`, { type: 'success' });
                        return true;
                    }
                } catch (e) {
                    this.log('debug', 'store.claimReward failed', e.message);
                }
            }

            // Method 3: Direct API call (likely broken in current Discord version - avoid if possible)
            if (this.api ?? api) {
                const apiInstance = this.api ?? api;
                try {
                    this.log('debug', 'Attempting claim via direct API call (may be deprecated)');
                    const response = await apiInstance.post({
                        url: `/quests/${quest.id}/claim-reward`,
                        body: {}
                    });
                    claimAttempted = true;
                    
                    if (response && (response.ok || response.status === 200)) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        const verification = await this.verifyQuestCompleted(quest.id);
                        if (verification && verification.claimed) {
                            this.log('info', `Quest ${quest.id} claimed successfully via API`);
                            UI.showToast(`Quest rewards claimed: ${quest.config?.messages?.questName || quest.id}`, { type: 'success' });
                            return true;
                        }
                    }
                } catch (e) {
                    apiError = e;
                    // 400 Bad Request means endpoint is invalid/deprecated - don't retry
                    if (e.status === 400) {
                        this.log('warn', `Quest ${quest.id}: API endpoint returned 400 - Discord may have changed the claiming system. Manual claim required.`);
                        // Remember this quest requires manual claim to avoid future attempts
                        if (this.failedClaimQuests) {
                            this.failedClaimQuests.add(quest.id);
                            // Persist to storage so it survives plugin reloads
                            BdApi.Data.save(this.meta.name, 'failedClaimQuests', Array.from(this.failedClaimQuests));
                        }
                        UI.showToast(`Quest "${quest.config?.messages?.questName || 'Quest'}" completed but requires manual claim`, { type: 'warning', timeout: 5000 });
                        return false; // Don't retry on 400 errors
                    } else if (e.status === 429) {
                        this.log('warn', 'Rate limited by Discord API, backing off...');
                        // Wait longer on rate limit
                        await new Promise(resolve => setTimeout(resolve, 10000));
                    } else {
                        this.log('debug', `API claim failed with status ${e.status}:`, e.message);
                    }
                }
            }

            // Final verification
            await new Promise(resolve => setTimeout(resolve, 2000));
            const finalCheck = await this.verifyQuestCompleted(quest.id);
            
            if (finalCheck && finalCheck.claimed) {
                this.log('info', `Quest ${quest.id} is now claimed`);
                return true;
            }

            // If quest is completed but not claimed and we've tried methods
            if (finalCheck && finalCheck.completed && !finalCheck.claimed) {
                // If we got a 400 error from API, don't retry - it's a structural issue
                if (apiError && apiError.status === 400) {
                    this.log('info', `Quest ${quest.id} requires manual claim (API deprecated)`);
                    return false;
                }
                
                // Only retry if we haven't hit max retries and haven't been rate limited too much
                if (retryCount < maxRetries) {
                    const backoffDelay = Math.min(5000 * Math.pow(2, retryCount), 30000);
                    this.log('info', `Quest ${quest.id} completed but not claimed - retrying in ${backoffDelay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, backoffDelay));
                    return await this.claimQuestRewards(quest, retryCount + 1);
                } else {
                    this.log('warn', `Quest ${quest.id}: Max retries reached. Manual claim may be required.`);
                    UI.showToast(`Quest "${quest.config?.messages?.questName || 'Quest'}" may require manual claim`, { type: 'warning', timeout: 5000 });
                }
            }

            return false;
        } catch (err) {
            this.log('error', 'claimQuestRewards error', err.message);
            
            // Don't retry on unexpected errors if we've already retried
            if (retryCount < maxRetries) {
                const backoffDelay = Math.min(5000 * Math.pow(2, retryCount), 30000);
                await new Promise(resolve => setTimeout(resolve, backoffDelay));
                return await this.claimQuestRewards(quest, retryCount + 1);
            }
            
            return false;
        }
    }

    // Attempt to complete video quests without actually watching the video
    async completeWithoutWatch(quest) {
        try {
            if (!quest || !quest.id) {
                this.log('warn', "Invalid quest passed to completeWithoutWatch");
                return;
            }
            this.ensureStores();
            const store = this.QuestsStore ?? getQuestsStore();
			const tryCall = async (fnName, ...args) => {
				try {
					if (store && typeof store[fnName] === 'function') {
						this.log('debug', `Calling QuestsStore.${fnName}`);
						return await store[fnName](...args);
					}
				} catch (e) { 
					this.log('debug', `Error calling store method ${fnName}`, e.message);
				}
				return null;
			};

			await tryCall('enroll', quest.id);
			await tryCall('submitQuestProgress', quest.id, { progress: 1 });
			await tryCall('markCompleted', quest.id);
			await tryCall('claimReward', quest.id);

			try {
				let target = null;
				if (store) {
					if (store.quests && typeof store.quests.get === 'function') {
						target = store.quests.get(quest.id) || Array.from(store.quests.values()).find(q => q && q.id === quest.id);
					} else if (typeof store.getAll === 'function') {
						const all = store.getAll();
						target = Array.isArray(all) ? all.find(q => q && q.id === quest.id) : null;
					} else if (Array.isArray(store)) {
						target = store.find(q => q && q.id === quest.id);
					}
					if (target) {
						target.userStatus = target.userStatus || {};
						target.userStatus.completedAt = Date.now();
						if (!target.userStatus.progress) target.userStatus.progress = {};
						for (const k of Object.keys(target.userStatus.progress || {})) {
							try { target.userStatus.progress[k].value = target.config?.taskConfig?.tasks?.[k]?.target ?? target.userStatus.progress[k].value ?? 0; } catch(e){}
						}
						this.log('info', `Marked quest as completed in-store`, quest.id);
						try {
							if (this.FluxDispatcher && typeof this.FluxDispatcher.dispatch === 'function') {
								this.FluxDispatcher.dispatch({ type: 'FARMQUESTS_QUEST_UPDATED', questId: quest.id });
							}
						} catch (e) { /* ignore */ }
					}
				}
			} catch (e) { 
				this.log('warn', 'Fallback mutation failed', e.message);
			}

			try {
				if (this.api) {
					const paths = [
						`/quests/${quest.id}/complete`,
						`/rewards/quests/${quest.id}/claim`,
						`/quests/${quest.id}/claim`
					];
					for (const p of paths) {
						try {
							if (typeof this.api.post === 'function') {
								await this.api.post(p, {});
								this.log('debug', 'API POST successful', p);
								break;
							}
							if (typeof this.api.fetch === 'function') {
								await this.api.fetch(p, { method: 'POST' });
								this.log('debug', 'API fetch successful', p);
								break;
							}
						} catch (e) { /* ignore individual path errors */ }
					}
				}
			} catch (e) { /* ignore */ }

			// Auto-claim rewards if enabled
			if (this.settings.autoClaimRewards) {
				this.log('info', 'Starting auto-claim process for', quest.id);
				await this.claimQuestRewards(quest);
			}

			// Verify completion if enabled
			if (this.settings.verifyQuestCompletion) {
				const verification = await this.verifyQuestCompleted(quest.id);
				if (verification) {
					const status = verification.completed && verification.claimed ? 'completed and claimed' : 
								  verification.completed ? 'completed but not claimed' : 'incomplete';
					this.log('info', `Quest ${quest.id} status: ${status}`);
				}
			}

			if (this.farmingQuest && this.farmingQuest.has(quest.id)) this.farmingQuest.delete(quest.id);
			this.showQuestNotification(quest, true);
			this.log('info', 'completeWithoutWatch finished', quest.id);
		} catch (err) {
			this.log('error', 'completeWithoutWatch failed', err.message);
		}
	}

	farmQuest(quest) {
		try {
			// Get FRESH references inside farmQuest() like AutoQuestComplete does in runQuest()
			// This is the KEY fix - AutoQuestComplete gets these fresh every time, not from cached this.* values
			const ApplicationStreamingStore = Webpack.Stores?.ApplicationStreamingStore ?? this.ApplicationStreamingStore;
			const RunningGameStore = Webpack.Stores?.RunningGameStore ?? this.RunningGameStore;
			const FluxDispatcher = Webpack.getByKeys?.('dispatch', 'subscribe', 'register') ?? this.FluxDispatcher;
			const api = Webpack.getModule?.(m => m?.tn?.get)?.tn ?? this.api;
			
			let isApp = typeof DiscordNative !== "undefined";
			if (!quest) {
				this.log('warn', "No uncompleted quests available");
				return;
			}

			if (!api) {
				this.log('warn', "API module not available — some operations may fail");
			}

			const pid = Math.floor(Math.random() * 30000) + 1000;
			const applicationId = quest?.config?.application?.id;
			const applicationName = quest?.config?.application?.name ?? "Unknown";
			const questName = quest?.config?.messages?.questName ?? "Unknown Quest";
			const taskConfig = quest?.config?.taskConfig ?? quest?.config?.taskConfigV2;
			if (!taskConfig || !taskConfig.tasks) {
				this.log('error', "Invalid taskConfig for quest", { questId: quest?.id });
				this.farmingQuest.set(quest.id, false);
				return;
			}
			const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"].find(x => taskConfig.tasks[x] != null);
			if (!taskName) {
				console.error("FarmQuests: could not determine task type for quest", quest?.id);
				this.farmingQuest.set(quest.id, false);
				return;
			}

			const secondsNeeded = taskConfig.tasks[taskName].target;
			let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;

			if (!isApp && taskName !== "WATCH_VIDEO" && taskName !== "WATCH_VIDEO_ON_MOBILE") {
				console.log("This no longer works in browser for non-video quests. Use the discord desktop app to complete the", questName, "quest!");
				return;
			}

			this.farmingQuest.set(quest.id, true);
			this.showQuestNotification(quest, false);

			console.log(`Farming quest ${questName} (${quest.id}) - ${taskName} for ${secondsNeeded} seconds.`);

			switch (taskName) {
				case "WATCH_VIDEO":
				case "WATCH_VIDEO_ON_MOBILE":
					// Use proven video completion method from AutoQuestComplete
					this.completeVideoQuest(quest, secondsNeeded, secondsDone);
					break;

				case "PLAY_ON_DESKTOP":
					if (!api) { console.error("FarmQuests: missing API for PLAY_ON_DESKTOP"); break; }
					api.get({ url: `/applications/public?application_ids=${applicationId}` }).then(res => {
							const appData = res.body[0];
							const exeEntry = (appData.executables || []).find(x => x.os === "win32") || (appData.executables || [])[0];
							const exeName = (exeEntry?.name ?? "app.exe").replace(">", "");

							const fakeGame = {
								cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
								exeName,
								exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
								hidden: false,
								isLauncher: false,
								id: applicationId,
								name: appData.name,
								pid: pid,
								pidPath: [pid],
								processName: appData.name,
								start: Date.now(),
							};
							const realGames = this.fakeGames.size == 0 && this.RunningGameStore?.getRunningGames ? this.RunningGameStore.getRunningGames() : [];
							this.fakeGames.set(quest.id, fakeGame);
							const fakeGames = Array.from(this.fakeGames.values());
							(this.FluxDispatcher ?? FluxDispatcher)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames });

							let playOnDesktop = (event) => {
								if (event.questId !== quest.id) return;
								let progress = quest.config.configVersion === 1 ? event.userStatus.streamProgressSeconds : Math.floor(event.userStatus.progress.PLAY_ON_DESKTOP.value);
								console.log(`Quest progress ${questName}: ${progress}/${secondsNeeded}`);

								if (!this.farmingQuest.get(quest.id) || progress >= secondsNeeded) {
									console.log("Stopping farming quest:", questName);

									this.fakeGames.delete(quest.id);
									const games = this.RunningGameStore?.getRunningGames ? this.RunningGameStore.getRunningGames() : [];
									const added = this.fakeGames.size == 0 ? games : [];
									(this.FluxDispatcher ?? FluxDispatcher)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: added, games: games });
									(this.FluxDispatcher ?? FluxDispatcher)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);

									if (progress >= secondsNeeded) {
										console.log("Quest completed!");
										this.showQuestNotification(quest, true);
										this.farmingQuest.set(quest.id, false);
									}
								}
							}
							(this.FluxDispatcher ?? FluxDispatcher)?.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);
							this._registerSubscription("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);

							let fallbackInterval = null;
							let fallbackAttempts = 0;
							const startFallback = () => {
								if (fallbackInterval) return;
								fallbackInterval = this._registerInterval(setInterval(async () => {
									try {
										if (!this.farmingQuest.get(quest.id)) return;
										this.ensureStores();
										const qs = this.QuestsStore ?? getQuestsStore();
										if (qs && typeof qs.submitQuestProgress === 'function') {
											await qs.submitQuestProgress(quest.id, { progress: 1 });
										} else if (qs && typeof qs.enroll === 'function') {
											await qs.enroll(quest.id).catch(()=>{});
										} else if (this.api ?? api) {
											try {
												await (this.api ?? api).post({ url: `/quests/${quest.id}/heartbeat`, body: {} });
											} catch(e){ /* ignore */ }
										}

										let current = quest.userStatus?.progress?.PLAY_ON_DESKTOP?.value ?? quest.userStatus?.streamProgressSeconds ?? 0;
										if (qs) {
											try {
												let target = null;
												if (qs.quests && typeof qs.quests.get === 'function') target = qs.quests.get(quest.id);
												else if (typeof qs.getAll === 'function') {
													const all = qs.getAll();
													target = Array.isArray(all) ? all.find(q=>q&&q.id===quest.id) : (all || {})[quest.id];
												}
												if (target) current = target.userStatus?.progress?.PLAY_ON_DESKTOP?.value ?? target.userStatus?.streamProgressSeconds ?? current;
											} catch(e){}
										}

										fallbackAttempts++;

										const nearComplete = current >= Math.floor(secondsNeeded * 0.9);
										const maxFallback = Math.max(1, Number(this.settings.maxFallbackAttempts ?? getSetting('maxFallbackAttempts')?.value ?? 30));
										const exhausted = fallbackAttempts >= maxFallback;

										if (current >= secondsNeeded || nearComplete || exhausted) {
											if (!(current >= secondsNeeded)) {
												console.log('Attempting forced completion via store/api for', quest.id);
												try { await this.completeWithoutWatch(quest); } catch(e) { /* ignore */ }
											}

											if (fallbackInterval) {
												this._clearInterval(fallbackInterval);
												fallbackInterval = null;
											}

											if (this.fakeGames.has(quest.id)) this.fakeGames.delete(quest.id);
											const games = this.RunningGameStore?.getRunningGames ? this.RunningGameStore.getRunningGames() : [];
											const added = this.fakeGames.size == 0 ? games : [];
											(this.FluxDispatcher ?? FluxDispatcher)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: added, games: games });
											(this.FluxDispatcher ?? FluxDispatcher)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);
											this.farmingQuest.set(quest.id, false);
											return;
										}
									} catch (e) { /* ignore */ }
								}, 20 * 1000));
							};

							startFallback();

							console.log(`Spoofed your game to ${applicationName}. Wait for ${Math.ceil((secondsNeeded - secondsDone) / 60)} more minutes.`);
					})
					break;

				case "STREAM_ON_DESKTOP":
					const fakeApp = {
						id: applicationId,
						name: `FakeApp ${applicationName} (FarmQuests)`,
						pid: pid,
						sourceName: null,
					};
					this.fakeApplications.set(quest.id, fakeApp);

					let streamOnDesktop = (event) => {
						if (event.questId !== quest.id) return;
						let progress = quest.config.configVersion === 1 ? event.userStatus.streamProgressSeconds : Math.floor(event.userStatus.progress.STREAM_ON_DESKTOP.value);
						console.log(`Quest progress ${questName}: ${progress}/${secondsNeeded}`);

						if (!this.farmingQuest.get(quest.id) || progress >= secondsNeeded) {
							console.log("Stopping farming quest:", questName);

							this.fakeApplications.delete(quest.id);
							(this.FluxDispatcher ?? FluxDispatcher)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", streamOnDesktop);

							if (progress >= secondsNeeded) {
								console.log("Quest completed!");
								this.showQuestNotification(quest, true);
								this.farmingQuest.set(quest.id, false);
							}
						}
					}
					(this.FluxDispatcher ?? FluxDispatcher)?.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", streamOnDesktop);
					this._registerSubscription("QUESTS_SEND_HEARTBEAT_SUCCESS", streamOnDesktop);

					console.log(`Spoofed your stream to ${applicationName}. Stream any window in vc for ${Math.ceil((secondsNeeded - secondsDone) / 60)} more minutes.`);
					console.log("Remember that you need at least 1 other person to be in the vc!");
					break;

				case "PLAY_ACTIVITY":
					let channelId = null;
					try {
						const privateChannels = (this.ChannelStore?.getSortedPrivateChannels?.() ?? this.ChannelStore?.getSortedPrivateChannels ?? ChannelStore?.getSortedPrivateChannels?.() ?? ChannelStore?.getSortedPrivateChannels) ?? [];
						channelId = privateChannels?.[0]?.id ?? null;
					} catch(e) { /* ignore */ }

					if (!channelId) {
						const guildsObj = (typeof (this.GuildChannelStore?.getAllGuilds) === "function") ? this.GuildChannelStore.getAllGuilds() : (typeof (GuildChannelStore?.getAllGuilds) === "function" ? GuildChannelStore.getAllGuilds() : (this.GuildChannelStore ?? GuildChannelStore) ?? {});
						const guilds = guildsObj ?? {};

						for (const g of Object.values(guilds || {})) {
							const vocals = g?.VOCAL ?? g?.voiceChannels ?? [];
							if (vocals?.length > 0 && vocals[0]?.channel?.id) {
								channelId = vocals[0].channel.id;
								break;
							}
						}
					}

					if (!channelId) {
						console.error("FarmQuests: no suitable channel found for PLAY_ACTIVITY quest. Aborting this quest.");
						this.farmingQuest.set(quest.id, false);
						return;
					}
					const streamKey = `call:${channelId}:1`;

					let playActivity = async () => {
						console.log("Completing quest", questName, "-", quest.config.messages.questName);

						while (true) {
							const res = await (this.api ?? api)?.post({ url: `/quests/${quest.id}/heartbeat`, body: { stream_key: streamKey, terminal: false } });
							const progress = res.body.progress.PLAY_ACTIVITY.value;
							console.log(`Quest progress ${questName}: ${progress}/${secondsNeeded}`);

							await new Promise(resolve => setTimeout(resolve, 20 * 1000));

							if (!this.farmingQuest.get(quest.id) || progress >= secondsNeeded) {
								console.log("Stopping farming quest:", questName);

								if (progress >= secondsNeeded) {
									await (this.api ?? api)?.post({ url: `/quests/${quest.id}/heartbeat`, body: { stream_key: streamKey, terminal: true } });
									console.log("Quest completed!")
									this.showQuestNotification(quest, true);
									this.farmingQuest.set(quest.id, false);
								}
								break;
							}
						}
					}
					playActivity();
					break;

				default:
					console.error("Unknown task type:", taskName);
					this.farmingQuest.set(quest.id, false);
					break;
			}
		} catch (err) {
			console.error("FarmQuests: error inside farmQuest", err);
			if (quest?.id) this.farmingQuest.set(quest.id, false);
		}
	}
}
