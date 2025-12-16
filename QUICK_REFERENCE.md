# FarmQuests - Quick Reference Card

## ⚡ Quick Start
1. **Reload Discord:** `Ctrl+R`
2. **Open Settings:** BetterDiscord → FarmQuests plugin
3. **Verify:** All 10 settings should display
4. **Enroll:** Manually start at least one quest
5. **Wait:** Plugin automatically detects and farms

## ⚙️ 10 Settings at a Glance

| # | Setting | Type | Default | Purpose |
|---|---------|------|---------|---------|
| 1 | Interval to check for new quests (min) | Number | 5 | How often to look for new quests |
| 2 | Auto-start video quests | Toggle | OFF | Automatically click "Start Video Quest" |
| 3 | Max fallback attempts | Number | 30 | Retry attempts before forced completion |
| 4 | Concurrent farms | Number | 3 | Max quests farming at once |
| 5 | Delay between farms (sec) | Number | 2 | Delay between quest completions |
| 6 | Verbose logging | Toggle | OFF | Enable detailed debug output |
| 7 | Accept quests automatically | Toggle | ON | Auto-accept quests |
| 8 | Show quests title bar | Toggle | ON | Display button in title bar |
| 9 | Show quests settings bar | Toggle | ON | Display button in settings |
| 10 | Show quests badges | Toggle | ON | Show badge icons |
| 11 | Auto-complete all quests | Toggle | OFF | Complete quests without watching |
| 12 | Retry failed quests | Toggle | ON | Retry failed quest completions |
| 13 | Quest notifications | Toggle | ON | Show completion notifications |

## 🔧 Recommended Settings

### For Stability (Default)
```
checkForNewQuests: 5
autoStartVideoQuests: OFF
maxFallbackAttempts: 30
concurrentFarms: 3
delayBetweenFarms: 2
enableVerboseLogging: OFF
autoCompleteAllQuests: OFF
retryFailedQuests: ON
```

### For Fast Farming
```
checkForNewQuests: 2 (check every 2 min)
concurrentFarms: 5 (farm 5 quests at once)
maxFallbackAttempts: 20 (fail fast)
```

### For Debugging
```
enableVerboseLogging: ON (see all operations)
checkForNewQuests: 5
concurrentFarms: 1 (easier to follow)
```

## 🖥️ Console Commands

### Check Plugin Status
```javascript
// View current settings
console.log(BdApi.Plugins.get('FarmQuests'))
```

### Enable Debugging
```javascript
// Set verbose logging on (without UI)
localStorage.setItem('BetterDiscord_Plugins_FarmQuests_enableVerboseLogging', true)
```

### Check Config File
```javascript
// Windows: Navigate to %APPDATA%\BetterDiscord\plugins\FarmQuests.config.json
// Linux: ~/.config/BetterDiscord/plugins/FarmQuests.config.json
// Mac: ~/Library/Application Support/BetterDiscord/plugins/FarmQuests.config.json
```

## 📋 Troubleshooting Checklist

- [ ] Plugin file exists: `FarmQuests.plugin.js`
- [ ] Config file exists: `FarmQuests.config.json`
- [ ] Discord reloaded: `Ctrl+R`
- [ ] At least 1 quest enrolled manually
- [ ] Settings panel loads without errors
- [ ] Console shows `[FarmQuests]` prefix messages
- [ ] `enableVerboseLogging` is ON for debugging

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| Settings don't show | Reload Discord (`Ctrl+R`) |
| Numeric setting rejected | Value must be >= 1 |
| Changes not saved | Check `FarmQuests.config.json` exists |
| Quests not detected | Enroll in at least 1 quest manually |
| Quests don't complete | Check "Max fallback attempts" >= 20 |
| Console shows errors | Enable "Verbose logging" and check logs |
| Plugin crashes | Check console for `[FarmQuests]` error messages |

## 📊 What Each Quest Type Needs

| Type | Requirement | Time | Notes |
|------|-------------|------|-------|
| WATCH_VIDEO | None | 1-3 min | Auto-complete |
| PLAY_ON_DESKTOP | Game installed | 5-60 min | Fake game spoofed |
| STREAM_ON_DESKTOP | 1+ person in VC | 5-60 min | Fake stream spoofed |
| PLAY_ACTIVITY | Active voice channel | 5-60 min | Activity instance created |
| WATCH_VIDEO_ON_MOBILE | None | 1-3 min | Mobile only (may not work) |

## 🔍 Console Output Meanings

```
[FarmQuests] Found 5 quests...
→ Successfully detected quests

[FarmQuests] Calling QuestsStore.enroll
→ Attempting quest enrollment

[FarmQuests] Marked quest as completed
→ Quest completed successfully

[FarmQuests] API module not available
⚠️ Some features may fail but farming will still work

[FarmQuests] error saving setting
🔴 Settings not saving - check file permissions
```

## 📱 File Locations

### Windows
```
%APPDATA%\BetterDiscord\plugins\
├── FarmQuests.plugin.js
└── FarmQuests.config.json
```

### Linux
```
~/.config/BetterDiscord/plugins/
├── FarmQuests.plugin.js
└── FarmQuests.config.json
```

### macOS
```
~/Library/Application Support/BetterDiscord/plugins/
├── FarmQuests.plugin.js
└── FarmQuests.config.json
```

## 💡 Pro Tips

1. **Lower check interval** to find quests faster (uses more resources)
2. **Increase concurrent farms** for faster farming (may cause lag)
3. **Enable verbose logging** only when troubleshooting (spams console)
4. **Keep max fallback attempts >= 20** to ensure completion
5. **Monitor quest expiration** in Discord - plugin stops if they expire
6. **Use concurrent farms = 1** while testing settings changes

## ⌨️ Keyboard Shortcuts

| Action | Keys |
|--------|------|
| Reload Discord | `Ctrl+R` |
| Open DevTools Console | `Ctrl+Shift+I` |
| Search console | `Ctrl+F` (while in DevTools) |
| Clear console | Type `clear()` and press `Enter` |

## 📞 Need Help?

1. Check `UPDATE_SUMMARY.md` for detailed setup
2. Read `FarmQuests/README.md` for complete docs
3. Enable "Verbose logging" to see all operations
4. Check console for `[FarmQuests]` error messages
5. Review `IMPROVEMENTS.md` for technical details

---

**Version:** 1.0.5 | **Last Updated:** 2024 | **Status:** Production Ready ✅
