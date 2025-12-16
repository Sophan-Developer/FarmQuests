/**
 * @name FarmQuests
 * @description A plugin that farms you multiple discord quests in background simultaneously.
 * @version 1.0.5
 * @author Sophan-Developer
 * @authorLink https://github.com/Sophan-Developer
 * @website https://github.com/Sophan-Developer/FarmQuests
 * @source https://raw.githubusercontent.com/Sophan-Developer/FarmQuests/main/FarmQuests.plugin.js
 * @invite guNEKzhk4n
 */

// Porting of https://gist.github.com/aamiaa/204cd9d42013ded9faf646fae7f89fbb for betterdiscord

const config = {
    changelog: [
        //{ title: "New Features", type: "added", items: ["Added changelog"] },
        //{ title: "Bug Fix", type: "fixed", items: [""] },
        //{ title: "Improvements", type: "improved", items: [""] },
        //{ title: "On-going", type: "progress", items: [""] }
    ],
    settings: [
		{ type: "number", id: "checkForNewQuests", name: "Interval to check for new quests(min)", note: "The time (in minutes) to check for new quests", value: 5, min: 1, step: 1 },
		{ type: "switch", id: "autoStartVideoQuests", name: "Auto-start video quests", note: "Automatically click 'Start Video Quest' when available", value: true, min: 1, step: 1 },
		{ type: "switch", id: "suppressQuestProgressPill", name: "Hide quest progress pill", note: "Hide the small 'Quest progress' UI element shown while farming", value: true, min: 1, step: 1 },
		{ type: "number", id: "maxFallbackAttempts", name: "Max fallback attempts", note: "How many fallback heartbeat attempts before forcing completion", value: 30, min: 1, step: 1 },
		{ type: "number", id: "concurrentFarms", name: "Concurrent farms", note: "Maximum number of quests to farm at the same time", value: 3, min: 1, step: 1 },
		{ type: "switch", id: "enableVerboseLogging", name: "Verbose logging", note: "Enable verbose debug logs for troubleshooting", value: false },
        { type: "switch", id: "acceptQuestsAutomatically", name: "Accept Quests Automatically", note: "Whether to accept available quests automatically.", value: true },
        { type: "switch", id: "showQuestsButtonTitleBar", name: "Show Quests Title Bar", note: "Whether to show the quests button in the title bar.", value: true },
        { type: "switch", id: "showQuestsButtonSettingsBar", name: "Show Quests Settings Bar", note: "Whether to show the quests button in the settings bar.", value: true },
        { type: "switch", id: "showQuestsButtonBadges", name: "Show Quests Badges", note: "Whether to show badges on the quests button.", value: true }
    ]
};

function getSetting(key) {
    return config.settings.reduce((found, setting) => found ? found : (setting.id === key ? setting : setting.settings?.find(s => s.id === key)), undefined)
}

const Webpack = (BdApi && BdApi.Webpack) ? BdApi.Webpack : {};
const Data = (BdApi && BdApi.Data) ? BdApi.Data : { load: () => undefined, save: () => {} };
const UI = (BdApi && BdApi.UI) ? BdApi.UI : { buildSettingsPanel: () => null, showChangelogModal: () => {} };
const Patcher = (BdApi && BdApi.Patcher) ? BdApi.Patcher : { instead: () => {}, unpatchAll: () => {}, after: () => {}, before: () => {} };

const Filters = Webpack.Filters ?? {
	byProps: (...props) => (m) => props.every(p => m && (p in m)),
	byStoreName: (name) => (m) => !!(m && typeof m === "object" && (m[name] !== undefined || Object.keys(m || {}).some(k => typeof k === "string" && k.toLowerCase().includes(name.toLowerCase())))),
	bySource: () => () => false
};

let DiscordModules = null, ApplicationStreamingStore = null, RunningGameStore = null, QuestsStore = null, ChannelStore = null, GuildChannelStore = null;
try {
	if (typeof Webpack.getBulk === "function") {
		[ DiscordModules, ApplicationStreamingStore, RunningGameStore, QuestsStore, ChannelStore, GuildChannelStore ] =
			Webpack.getBulk(
				{ filter: Filters.byProps ? Filters.byProps("dispatch", "subscribe") : () => false },
				{ filter: Filters.byStoreName ? Filters.byStoreName("ApplicationStreamingStore") : () => false },
				{ filter: Filters.byStoreName ? Filters.byStoreName("RunningGameStore") : () => false },
				{ filter: Filters.byStoreName ? Filters.byStoreName("QuestsStore") : () => false },
				{ filter: Filters.byStoreName ? Filters.byStoreName("ChannelStore") : () => false },
				{ filter: Filters.byStoreName ? Filters.byStoreName("GuildChannelStore") : () => false }
			);
	}
} catch (e) {
	console.warn("FarmQuests: Webpack.getBulk failed", e);
}

let apiModule = null;
try {
	if (typeof Webpack.getBySource === "function") apiModule = Webpack.getBySource('bind(null,"get")');
} catch (e) { /* ignore */ }
const api = apiModule?.tn ?? null;

let _cachedQuestsStore = null;
function getQuestsStore() {
    if (_cachedQuestsStore) return _cachedQuestsStore;

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

		const findExports = test => {
			for (const m of modules) {
				try {
					if (!m || !m.exports) continue;
					if (test(m.exports)) return m.exports;
				} catch(e){ /* ignore */ }
			}
			return null;
		};

		const get = obj => obj?.Z ?? obj?.ZP ?? obj ?? null;

		_chunkStores = {
			ApplicationStreamingStore: get(findExports(e => !!e?.Z?.__proto__?.getStreamerActiveStreamMetadata)),
			RunningGameStore: get(findExports(e => !!e?.ZP?.getRunningGames) || findExports(e => !!e?.Z?.getRunningGames)),
			QuestsStore: get(findExports(e => !!e?.Z?.__proto__?.getQuest) || findExports(e => !!e?.Z?.quests)),
			ChannelStore: get(findExports(e => !!e?.Z?.__proto__?.getAllThreadsForParent)),
			GuildChannelStore: get(findExports(e => !!e?.ZP?.getSFWDefaultChannel) || findExports(e => !!e?.ZP?.getDefaultChannel)),
			FluxDispatcher: get(findExports(e => !!e?.Z?.__proto__?.flushWaitQueue) || findExports(e => !!e?.ZP?.flushWaitQueue)),
			api: (findExports(e => !!e?.tn?.get) ?? {}).tn ?? null
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
		this.suppressObserver = null;
		this.availableQuests = [];
		this.farmableQuests = [];
		this.farmingQuest = new Map();
		this.fakeGames = new Map();
		this.fakeApplications = new Map();
		this.RunningGameStore = RunningGameStore ?? null;
		this.ApplicationStreamingStore = ApplicationStreamingStore ?? null;
		this.QuestsStore = QuestsStore ?? null;
		this.ChannelStore = ChannelStore ?? null;
		this.GuildChannelStore = GuildChannelStore ?? null;
		this.DiscordModules = DiscordModules ?? null;
		this.api = api ?? null;
	}

	ensureStores() {
		try {
			const chunk = resolveStoresFromChunk() ?? {};
			this.RunningGameStore = this.RunningGameStore ?? chunk.RunningGameStore ?? RunningGameStore ?? null;
			this.ApplicationStreamingStore = this.ApplicationStreamingStore ?? chunk.ApplicationStreamingStore ?? ApplicationStreamingStore ?? null;
			this.QuestsStore = this.QuestsStore ?? chunk.QuestsStore ?? QuestsStore ?? null;
			this.ChannelStore = this.ChannelStore ?? chunk.ChannelStore ?? ChannelStore ?? null;
			this.GuildChannelStore = this.GuildChannelStore ?? chunk.GuildChannelStore ?? GuildChannelStore ?? null;
			this.DiscordModules = this.DiscordModules ?? chunk.FluxDispatcher ?? DiscordModules ?? null;
			this.api = this.api ?? chunk.api ?? api ?? null;
			const verbose = !!(this.settings.enableVerboseLogging ?? getSetting('enableVerboseLogging')?.value);
			if (verbose) console.debug("FarmQuests: resolved stores:", {
				RunningGameStore: !!this.RunningGameStore,
				ApplicationStreamingStore: !!this.ApplicationStreamingStore,
				QuestsStore: !!this.QuestsStore,
				ChannelStore: !!this.ChannelStore,
				GuildChannelStore: !!this.GuildChannelStore,
				DiscordModules: !!this.DiscordModules,
				api: !!this.api
			});
		} catch (e) {
			console.warn("FarmQuests: ensureStores failed", e);
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

	startSuppressProgressUI() {
		try {
			if (this.suppressObserver) return;

			const hideMatches = (root = document.body) => {
				if (!root) return;
				const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
				let n = walker.currentNode;
				while (n) {
					try {
						const txt = (n.innerText || n.textContent || '').trim();
						if (txt && /Quest progress/i.test(txt)) {
							if (n.style) n.style.display = 'none';
						}
					} catch (e) { /* ignore */ }
					n = walker.nextNode();
				}
			};

			hideMatches();

			this.suppressObserver = new MutationObserver(mutations => {
				for (const m of mutations) {
					for (const node of Array.from(m.addedNodes || [])) {
						try {
							if (node.nodeType === Node.ELEMENT_NODE) hideMatches(node);
						} catch (e) { /* ignore */ }
					}
				}
			});
			this.suppressObserver.observe(document.body, { childList: true, subtree: true });
			console.info('FarmQuests: suppressQuestProgressPill enabled');
		} catch (e) {
			console.warn('FarmQuests: startSuppressProgressUI failed', e);
		}
	}

	stopSuppressProgressUI() {
		try {
			if (this.suppressObserver) {
				this.suppressObserver.disconnect();
				this.suppressObserver = null;
				console.info('FarmQuests: suppressQuestProgressPill disabled');
			}
		} catch (e) { console.warn('FarmQuests: stopSuppressProgressUI failed', e); }
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
			const built = UI.buildSettingsPanel && UI.buildSettingsPanel({
				settings: config.settings,
				onChange: (...args) => {
					let id, value;
					if (args.length >= 3) {
						id = args[1];
						value = args[2];
					} else {
						[id, value] = args;
					}
					try { if (typeof id !== 'undefined') this.settings[id] = value; } catch (e) {}
					switch (id) {
						case "checkForNewQuests": this.startInterval(); break;
						case "autoStartVideoQuests": if (value) this.startAutoStart(); else this.stopAutoStart(); break;
						case "suppressQuestProgressPill": if (value) this.startSuppressProgressUI(); else this.stopSuppressProgressUI(); break;
					}
				}
			});
			if (built) return built;

			const container = document.createElement('div');
			container.style.color = '#fff';
			container.style.padding = '12px';
			for (const s of config.settings) {
				const row = document.createElement('div');
				row.style.marginBottom = '10px';
				const label = document.createElement('label');
				label.style.display = 'block';
				label.style.fontWeight = '600';
				label.innerText = s.name || s.id;
				row.appendChild(label);
				if (s.note) {
					const note = document.createElement('div');
					note.style.fontSize = '12px';
					note.style.opacity = '0.8';
					note.innerText = s.note;
					row.appendChild(note);
				}

				if (s.type === 'number') {
					const input = document.createElement('input');
					input.type = 'number';
					if (typeof s.min !== 'undefined') input.min = s.min;
					if (typeof s.step !== 'undefined') input.step = s.step;
					input.value = this.settings[s.id] ?? s.value ?? '';
					input.style.marginTop = '6px';
					input.onchange = () => {
						const val = Number(input.value);
						this.settings[s.id] = val;
						if (s.id === 'checkForNewQuests') this.startInterval();
					};
					row.appendChild(input);
				} else if (s.type === 'switch') {
					const input = document.createElement('input');
					input.type = 'checkbox';
					input.checked = !!(this.settings[s.id] ?? s.value);
					input.style.marginTop = '6px';
					input.onchange = () => {
						const val = !!input.checked;
						this.settings[s.id] = val;
						if (s.id === 'suppressQuestProgressPill') {
							if (val) this.startSuppressProgressUI(); else this.stopSuppressProgressUI();
						}
					};
					row.appendChild(input);
				} else {
					const input = document.createElement('input');
					input.type = 'text';
					input.value = this.settings[s.id] ?? s.value ?? '';
					input.style.marginTop = '6px';
					input.onchange = () => { this.settings[s.id] = input.value; };
					row.appendChild(input);
				}
				container.appendChild(row);
			}
			return container;
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
		const savedVersion = Data.load(this.meta.name, "version");
		if (savedVersion !== this.meta.version && config.changelog.length > 0) {
			UI.showChangelogModal({
				title: this.meta.name,
				subtitle: this.meta.version,
				changes: config.changelog
			});
			Data.save(this.meta.name, "version", this.meta.version);
		}
	}

	start() {
		this.showChangelog();
		this.ensureStores();

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

		this.updateQuests();
		this.startInterval();
		try {
			if (this.settings.autoStartVideoQuests ?? getSetting('autoStartVideoQuests')?.value) {
				this.startAutoStart();
			}
			if (this.settings.suppressQuestProgressPill ?? getSetting('suppressQuestProgressPill')?.value) {
				this.startSuppressProgressUI();
			}
		} catch (e) { /* ignore */ }
	}

	stop() {
		this.stopInterval();
		this.stopAutoStart();
		this.stopSuppressProgressUI();
		Patcher.unpatchAll(this.meta.name);
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
			console.log(`FarmQuests: found ${total} quests (userStatus: ${withUserStatus}, enrolled: ${withEnrolled}, completed: ${withCompleted}). Farmable: ${this.farmableQuests.length}`);
			const verbose = !!(this.settings.enableVerboseLogging ?? getSetting('enableVerboseLogging')?.value);
			if (this.farmableQuests.length === 0) {
				if (verbose) {
					console.debug("FarmQuests: sample available quest keys:", (this.availableQuests[0] && Object.keys(this.availableQuests[0]).slice(0,20)) || []);
					console.debug("FarmQuests: sample userStatus keys:", (this.availableQuests[0]?.userStatus && Object.keys(this.availableQuests[0].userStatus).slice(0,20)) || []);
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
		} catch (err) {
			console.error("FarmQuests: failed to update quests", err);
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

		// Attempt to complete video quests without actually watching the video
		async completeWithoutWatch(quest) {
			try {
				if (!quest || !quest.id) return;
				this.ensureStores();
				const store = this.QuestsStore ?? getQuestsStore();
				const tryCall = async (fnName, ...args) => {
					try {
						if (store && typeof store[fnName] === 'function') {
							console.info(`FarmQuests: calling QuestsStore.${fnName}`);
							return await store[fnName](...args);
						}
					} catch (e) { console.warn('FarmQuests: error calling store method', fnName, e); }
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
							console.info('FarmQuests: marked quest as completed in-store', quest.id);
							try {
								if (this.DiscordModules && typeof this.DiscordModules.dispatch === 'function') {
									this.DiscordModules.dispatch({ type: 'FARMQUESTS_QUEST_UPDATED', questId: quest.id });
								}
							} catch (e) { /* ignore */ }
						}
					}
				} catch (e) { console.warn('FarmQuests: fallback mutation failed', e); }

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
									console.info('FarmQuests: attempted api.post', p);
									break;
								}
								if (typeof this.api.fetch === 'function') {
									await this.api.fetch(p, { method: 'POST' });
									console.info('FarmQuests: attempted api.fetch', p);
									break;
								}
							} catch (e) { /* ignore individual path errors */ }
						}
					}
				} catch (e) { /* ignore */ }

				if (this.farmingQuest && this.farmingQuest.has(quest.id)) this.farmingQuest.delete(quest.id);
				console.log('FarmQuests: completeWithoutWatch finished for', quest.id);
			} catch (err) {
				console.error('FarmQuests: completeWithoutWatch failed', err);
			}
		}

	farmQuest(quest) {
		try {
			let isApp = typeof DiscordNative !== "undefined";
			if (!quest) {
				console.log("You don't have any uncompleted quests!");
				return;
			}

			if (!api) {
				console.warn("FarmQuests: API module not available — some operations may fail.");
			}

			const pid = Math.floor(Math.random() * 30000) + 1000;
			const applicationId = quest?.config?.application?.id;
			const applicationName = quest?.config?.application?.name ?? "Unknown";
			const questName = quest?.config?.messages?.questName ?? "Unknown Quest";
			const taskConfig = quest?.config?.taskConfig ?? quest?.config?.taskConfigV2;
			if (!taskConfig || !taskConfig.tasks) {
				console.error("FarmQuests: invalid taskConfig for quest", quest?.id, quest);
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

			console.log(`Farming quest ${questName} (${quest.id}) - ${taskName} for ${secondsNeeded} seconds.`);

			switch (taskName) {
				case "WATCH_VIDEO":
				case "WATCH_VIDEO_ON_MOBILE":
					this.completeWithoutWatch(quest);
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
							(this.DiscordModules ?? DiscordModules)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames });

							let playOnDesktop = (event) => {
								if (event.questId !== quest.id) return;
								let progress = quest.config.configVersion === 1 ? event.userStatus.streamProgressSeconds : Math.floor(event.userStatus.progress.PLAY_ON_DESKTOP.value);
								console.log(`Quest progress ${questName}: ${progress}/${secondsNeeded}`);

								if (!this.farmingQuest.get(quest.id) || progress >= secondsNeeded) {
									console.log("Stopping farming quest:", questName);

									this.fakeGames.delete(quest.id);
									const games = this.RunningGameStore?.getRunningGames ? this.RunningGameStore.getRunningGames() : [];
									const added = this.fakeGames.size == 0 ? games : [];
									(this.DiscordModules ?? DiscordModules)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: added, games: games });
									(this.DiscordModules ?? DiscordModules)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);

									if (progress >= secondsNeeded) {
										console.log("Quest completed!");
										this.farmingQuest.set(quest.id, false);
									}
								}
							}
							(this.DiscordModules ?? DiscordModules)?.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);

							let fallbackInterval = null;
							let fallbackAttempts = 0;
							const startFallback = () => {
								if (fallbackInterval) return;
								fallbackInterval = setInterval(async () => {
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
												clearInterval(fallbackInterval);
												fallbackInterval = null;
											}

											if (this.fakeGames.has(quest.id)) this.fakeGames.delete(quest.id);
											const games = this.RunningGameStore?.getRunningGames ? this.RunningGameStore.getRunningGames() : [];
											const added = this.fakeGames.size == 0 ? games : [];
											(this.DiscordModules ?? DiscordModules)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: added, games: games });
											(this.DiscordModules ?? DiscordModules)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);
											this.farmingQuest.set(quest.id, false);
											return;
										}
									} catch (e) { /* ignore */ }
								}, 20 * 1000);
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
								(this.DiscordModules ?? DiscordModules)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", streamOnDesktop);

								if (progress >= secondsNeeded) {
									console.log("Quest completed!");
									this.farmingQuest.set(quest.id, false);
								}
							}
						}
						(this.DiscordModules ?? DiscordModules)?.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", streamOnDesktop)

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
