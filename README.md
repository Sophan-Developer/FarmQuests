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

## Installation

1. Download `FarmQuests.plugin.js` and place it in:
   ```
   C:\Users\[YourUsername]\AppData\Roaming\BetterDiscord\plugins\
   ```

2. Enable the plugin in BetterDiscord's plugin settings

3. Reload Discord (`Ctrl+R`)

## Settings

### Core Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Interval to check for new quests (min)** | Number | 5 | How often (in minutes) the plugin checks for new quests |
| **Auto-start video quests** | Toggle | ON | Automatically click "Start Video Quest" when available |
| **Max fallback attempts** | Number | 30 | Maximum number of retry attempts before forcing quest completion |
| **Concurrent farms** | Number | 3 | Maximum number of quests to farm simultaneously |

### Advanced Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Delay between farms (sec)** | Number | 2 | Delay in seconds between completing quests |
| **Verbose logging** | Toggle | OFF | Enable detailed debug logs in the console |
| **Auto-complete all quests** | Toggle | OFF | Automatically complete all quests without watching videos |
| **Retry failed quests** | Toggle | ON | Automatically retry quests that fail to complete |

### UI Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Accept Quests Automatically** | Toggle | ON | Auto-accept available quests (when implemented) |
| **Show Quests Title Bar** | Toggle | ON | Display quests button in the title bar |
| **Show Quests Settings Bar** | Toggle | ON | Display quests button in settings bar |
| **Show Quests Badges** | Toggle | ON | Show badges on quest buttons || **Quest Notifications** | Toggle | ON | Show notifications when quests are completed |
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
