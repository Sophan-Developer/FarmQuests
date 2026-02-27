# FarmQuests - Quick Reference Card

## ⚡ Quick Start
1. **Reload Discord:** `Ctrl+R`
2. **Open Settings:** BetterDiscord → FarmQuests plugin
3. **Choose Language:** Select English, Khmer, or Chinese at the top
4. **Verify:** All settings should display in your chosen language
5. **Enroll:** Manually start at least one quest
6. **Wait:** Plugin automatically detects and farms

## ⚙️ Settings at a Glance

| # | Setting | Type | Default | Purpose |
|---|---------|------|---------|---------|
| 0 | Language | Dropdown | English | UI language (English / ខ្មែរ / 中文) |
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
| 14 | **Stuck Detection** | Toggle | ON | Auto-detect and recover stuck quests |
| 15 | **Stuck Timeout (min)** | Number | 3 | Time before quest is considered stuck |

## 🔧 Recommended Settings

### For Stability (Default)
```
Language: English (or Khmer / Chinese)

Page 1 - Automation:
  ✓ Auto Accept Quests
  ✓ Auto Complete Quests
  ✓ Auto Claim Rewards
  ✓ Auto Start Video Quests
  ✓ Retry Failed Quests
  ✓ Verify Quest Completion
  Claim Retry Attempts: 3
  ✓ Quest Notifications
  ✗ Hide Progress Pill

Page 2 - Advanced:
  Max Concurrent Farms: 3
  Delay Between Farms: 2
  Quest Check Interval: 5
  Max Heartbeat Attempts: 30
  ✓ Stuck Detection (auto-recovery)
  Stuck Timeout: 3 minutes
  ✗ Verbose Logging
```

### For Fast Farming
```
Page 2 - Performance:
  Quest Check Interval: 2 (check every 2 min)
  Max Concurrent Farms: 5 (farm 5 at once)
  Max Heartbeat Attempts: 20 (fail fast)
  Delay Between Farms: 1 (minimal delay)
```

### For Debugging

```
Page 2 - Advanced:
  ✓ Verbose Logging (ON for debugging)
  Quest Check Interval: 1 (check every minute)
  Max Concurrent Farms: 1 (easier to follow)
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

## 🎨 v1.7.0 - Enhanced Settings Panel

### Status Dashboard
- **Farming** - Number of quests currently being farmed
- **Available** - Quests ready to farm
- **Completed** - Successfully finished quests
- **Failed** - Quests that failed to complete
- **Stuck** - Quests detected as stuck (no progress)

### Quick Action Buttons
| Button | Action |
|--------|--------|
| **Check Now** | Immediately scan for new quests |
| **Stop All** | Stop all active farming |
| **Claim All** | Claim all completed quest rewards |
| **Refresh Stores** | Reload Discord quest stores |

### Stepper Number Inputs
- Use **+** / **−** buttons for easy adjustment
- Or type values directly in the input field

### Reset Defaults
- Footer button to restore all settings to defaults
- Confirmation prompt before reset

## 🔄 New in v1.8.0 - Stuck Detection

### Auto-Detection
- Monitors quest progress every **30 seconds**
- Detects quests with no progress for **3 minutes** (configurable)
- Tracks all quest types: PLAY_ON_DESKTOP, STREAM_ON_DESKTOP, PLAY_ACTIVITY

### Auto-Recovery
When a stuck quest is detected:
1. Stops the stuck quest
2. Cleans up trackers
3. Refreshes Discord quest stores
4. Restarts the quest automatically

### Settings
| Setting | Default | Description |
|---------|---------|-------------|
| **Stuck Detection** | ON | Enable/disable stuck detection |
| **Stuck Timeout** | 3 min | Time with no progress before recovery |

---

**Version:** 1.8.0 | **Last Updated:** February 2026 | **Status:** Production Ready ✅
