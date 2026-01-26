# FarmQuests for BetterDiscord

A BetterDiscord plugin that automatically farms multiple Discord quests in the background simultaneously.

**Version:** 1.6.1  
**Author:** Sophan-Developer  
**Based on:** [aamiaa's original script](https://gist.github.com/aamiaa/204cd9d42013ded9faf646fae7f89fbb)

## Features

- 🚀 **Auto-farm multiple quests** – Farms eligible quests simultaneously
- 🎮 **Supports all quest types:**
  - `WATCH_VIDEO` / `WATCH_VIDEO_ON_MOBILE` – Automatically completes without watching
  - `PLAY_ON_DESKTOP` – Spoofs game presence
  - `STREAM_ON_DESKTOP` – Spoofs stream activity
  - `PLAY_ACTIVITY` – Farms activity quests in voice channels
- 🔄 **Smart quest detection** – Automatically detects and starts new quests
- ⚙️ **Highly configurable** – Fine-tune farming behavior with 13+ settings
- 📊 **Progress tracking** – Monitor quest completion progress
- 🛡️ **Fallback mechanisms** – Multiple layers of task completion to ensure success
- 🔇 **Verbose logging** – Optional debug output for troubleshooting
- 📋 **Copy Debug Info** – One-click copy of debug info for troubleshooting
- 🧹 **Memory safe** – Proper cleanup of intervals/subscriptions on stop

## Prerequisites

### Installing BetterDiscord

This plugin requires BetterDiscord to be installed. If you don't have it yet:

1. **Download BetterDiscord:**
   - Visit the official website: [https://betterdiscord.app](https://betterdiscord.app)
   - Click the "Download" button
   - Choose your operating system (Windows, macOS, or Linux)

2. **Install BetterDiscord:**
   - **Windows:** Run the downloaded `.exe` installer and follow the prompts
   - **macOS:** Open the `.dmg` file and drag BetterDiscord to Applications
   - **Linux:** Extract the `.AppImage` or follow distro-specific instructions

3. **Verify Installation:**
   - Open Discord (or restart if already open)
   - Go to User Settings (gear icon)
   - Look for "BetterDiscord" or "Plugins" in the sidebar
   - If you see these options, BetterDiscord is installed correctly!

> ⚠️ **Important:** BetterDiscord modifies the Discord client. While generally safe, use it at your own risk. Discord's Terms of Service technically prohibit client modifications.

## Plugin Installation

Once BetterDiscord is installed:

1. **Download the Plugin:**
   - Download `FarmQuests.plugin.js` from the [releases page](https://github.com/Sophan-Developer/FarmQuests/releases)
   - Or get it from the [source](https://raw.githubusercontent.com/Sophan-Developer/FarmQuests/main/FarmQuests.plugin.js)

2. **Install the Plugin:**
   - Place `FarmQuests.plugin.js` in your BetterDiscord plugins folder:
     - **Windows:** `C:\Users\[YourUsername]\AppData\Roaming\BetterDiscord\plugins\`
     - **macOS:** `~/Library/Application Support/BetterDiscord/plugins/`
     - **Linux:** `~/.config/BetterDiscord/plugins/`
   
   > 💡 **Quick Access:** In Discord, go to User Settings → Plugins → Open Plugins Folder

3. **Enable the Plugin:**
   - Go to User Settings → Plugins
   - Find "FarmQuests" in the list
   - Toggle it ON

4. **Reload Discord:**
   - Press `Ctrl+R` (Windows/Linux) or `Cmd+R` (macOS)
   - Or restart Discord completely

5. **Verify Installation:**
   - Open User Settings → Plugins
   - Click the settings icon (⚙️) next to FarmQuests
   - You should see the modern tabbed settings interface

## Settings

The plugin features a modern tabbed settings interface with two pages:

### ⚙️ Page 1: Automation Settings

#### Quest Automation
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Auto Accept Quests** | Toggle | ON | Automatically accept new available quests when they appear |
| **Auto Complete Quests** | Toggle | ON | Automatically complete all quest types (video, play, stream) |
| **Auto Claim Rewards** | Toggle | ON | Claim quest rewards automatically after completion |
| **Auto Start Video Quests** | Toggle | ON | Click 'Start Video Quest' button automatically |

#### Retry & Recovery
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Retry Failed Quests** | Toggle | ON | Automatically retry quests that fail to complete |
| **Verify Quest Completion** | Toggle | ON | Double-check that quests are properly completed and claimed |
| **Claim Retry Attempts** | Number | 3 | Number of times to retry claiming rewards if it fails (1-10) |

#### Notifications & UI
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Quest Notifications** | Toggle | ON | Show desktop notifications for quest progress and completion |
| **Hide Progress Pill** | Toggle | OFF | Hide the quest progress notification pill in Discord UI |

### 🔧 Page 2: Advanced Settings

#### Performance Settings
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Max Concurrent Farms** | Number | 3 | Maximum number of quests to farm simultaneously (1-10, higher = faster but more resource usage) |
| **Delay Between Farms** | Number | 2 | Delay in seconds between starting each quest (0-30, prevents rate limiting) |
| **Quest Check Interval** | Number | 5 | How often to check for new quests in minutes (1-60) |

#### Advanced Technical Settings
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Max Heartbeat Attempts** | Number | 30 | Maximum heartbeat attempts before forcing completion (5-100, technical) |
| **Verbose Logging** | Toggle | OFF | Enable detailed debug logs in console (for troubleshooting issues) |

> ⚠️ **Note:** Changing advanced settings may affect plugin stability. Default values are recommended for most users.
## How It Works

### Quest Detection
The plugin monitors your enrolled quests and identifies those that:
- Are actively enrolled (`enrolledAt` is set)
- Are not yet completed (`completedAt` is null)
- Have not expired

### Farming Process
Once a quest is detected, the plugin:
1. Identifies the quest type (WATCH_VIDEO, PLAY_ON_DESKTOP, etc.)
2. Determines required farming duration
3. Spools a fake game/stream/activity to Discord
4. Tracks progress via heartbeat events
5. Attempts multiple completion methods if progress stalls
6. Automatically marks the quest as complete

### Fallback Mechanism
If standard completion fails:
- Retries progress submission up to `maxFallbackAttempts` times
- Attempts direct API calls to complete quests
- Forces completion when 90% progress is reached or retries are exhausted

## Troubleshooting

### Plugin doesn't detect quests
- Ensure you have **enrolled** in at least one quest manually
- Check the console (`Ctrl+Shift+I`) for error messages with the `[FarmQuests]` prefix
- Enable **Verbose logging** to see detailed debug output
- Plugin initializes all settings on first load – check `FarmQuests.config.json` was created

### Quests not completing
- Check if Discord is in focus (some operations require focus)
- For `PLAY_ON_DESKTOP` quests, ensure you're using the desktop app
- For `STREAM_ON_DESKTOP` quests, you need at least 1 other person in the VC
- Verify the quest hasn't expired
- Check **Max fallback attempts** setting – increase if quests are timing out (default: 30)

### Settings not saving
- Verify `FarmQuests.config.json` exists in the plugins folder
- Check that settings are valid (e.g., numbers >= 1)
- The plugin has automatic setting initialization that runs on startup
- Try toggling a setting – if it updates `config.json`, the plugin is working
- Clear your browser cache and reload Discord (`Ctrl+R`)

### Console errors
- Look for messages starting with `[FarmQuests]` (new unified logging)
- Enable **Verbose logging** to see detailed operation traces
- For missing stores, run this in DevTools:
```javascript
Webpack.getModule(m=>Object.keys(m||{}).slice(0,10)).slice(0,20)
```
- If API module is missing, basic quest completion should still work via store methods

## API Support

The plugin attempts to use Discord's internal API via multiple pathways:
- Store-based completion methods
- Direct heartbeat endpoints
- Fallback mutation strategies

If one method fails, the plugin will automatically try alternatives.

## Performance Tips

- **Reduce check interval** – Lower the "Interval to check for new quests" for faster detection (uses more resources)
- **Adjust concurrent farms** – Set to 1-2 if experiencing lag; increase for faster farming
- **Disable verbose logging** – Turn off debug logs when not troubleshooting to reduce CPU usage

## Known Limitations

- ❌ Cannot click "Accept Quest" button (must enroll manually)
- ⚠️ PLAY_ACTIVITY quests require an active voice channel with at least 1 other member
- ⚠️ Some quest types may fail if Discord internals change
- ⚠️ The fake game/stream spoof may not work if Discord's anti-cheat detection evolves

## FAQ

**Q: Is this against Discord's ToS?**  
A: This plugin mimics legitimate user behavior but may violate Discord's Terms of Service. Use at your own risk.

**Q: Why do I need to accept quests manually?**  
A: The plugin currently doesn't have UI automation for the quest acceptance modal. This is a limitation of BetterDiscord's capabilities.

**Q: What if a quest fails to complete?**  
A: The plugin logs errors to the console. Enable **Verbose logging** and check for specific error messages. If issues persist, the quest config may have changed.

**Q: Can I farm multiple quest types at once?**  
A: Yes! Adjust the **Concurrent farms** setting. Default is 3, meaning up to 3 quests can farm simultaneously.

## Support & Contribution

- 🐛 **Bug Reports:** Check console output and enable verbose logging
- 💡 **Feature Requests:** Original author: [aamiaa](https://github.com/aamiaa)
- 🔧 **Source:** [BetterDiscord-Stuff Repository](https://github.com/Sophan-Developer/FarmQuests)

## Changelog

**v1.6.1** (Jan 2026)
- Fixed syntax error in API module resolution
- Fixed version comparison logic in update checker
- Fixed memory leaks - intervals and Flux subscriptions now properly cleaned up
- Added null-safety guards in webpack module finder
- Added 'Copy Debug Info' feature for easier troubleshooting
- Added user-friendly error notices with debug option
- Added cleanup registry to track all intervals/timeouts/subscriptions
- Better error handling when Discord modules are missing
- Improved stop() cleanup to prevent resource leaks

**v1.6.0** (Jan 2026)
- Updated webpack module selectors for Discord's January 2026 update
- Fixed 'Cannot read properties of undefined (reading exports)' error
- Updated ApplicationStreamingStore, RunningGameStore, QuestsStore selectors
- More robust store resolution with multiple fallback patterns

**v1.0.5**
- Added maxFallbackAttempts setting
- Added concurrentFarms setting for parallel quest farming
- Added enableVerboseLogging for detailed debug output
- Added UI button visibility settings
- Improved fallback completion logic
- Enhanced quest detection robustness

---

**⚠️ Disclaimer:** This plugin automates Discord quest farming. Use responsibly and at your own risk. Discord may update their systems to detect or block this functionality at any time.
