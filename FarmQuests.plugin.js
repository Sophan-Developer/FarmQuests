/**
 * @name FarmQuests
 * @description A plugin that farms you multiple discord quests in background simultaneously.
 * @version 1.9.0
 * @author Sophan-Developer
 * @authorLink https://github.com/Sophan-Developer
 * @website https://github.com/Sophan-Developer/FarmQuests
 * @source https://raw.githubusercontent.com/Sophan-Developer/FarmQuests/main/FarmQuests.plugin.js
 * @invite guNEKzhk4n
 */

// Porting of https://gist.github.com/aamiaa/204cd9d42013ded9faf646fae7f89fbb for betterdiscord

// ═══════════════════════════════════════════════════════════════
// TRANSLATIONS / LOCALIZATION
// ═══════════════════════════════════════════════════════════════
const translations = {
    en: {
        // Tabs
        tabAutomation: "⚙️ Automation",
        tabAdvanced: "🔧 Advanced",
        // Page 1 Headers
        headerQuestAutomation: "⚙️ Quest Automation",
        headerRetryRecovery: "🔄 Retry & Recovery",
        headerNotificationsUI: "🔔 Notifications & UI",
        // Page 2 Headers
        headerPerformance: "⚡ Performance Settings",
        headerAdvancedTech: "🔧 Advanced Technical Settings",
        headerInfo: "ℹ️ Information",
        // Settings Names
        acceptQuestsAutomatically: "Auto Accept Quests",
        autoCompleteAllQuests: "Auto Complete Quests",
        autoClaimRewards: "Auto Claim Rewards",
        autoStartVideoQuests: "Auto Start Video Quests",
        retryFailedQuests: "Retry Failed Quests",
        verifyQuestCompletion: "Verify Quest Completion",
        claimRetryAttempts: "Claim Retry Attempts",
        questNotifications: "Quest Notifications",
        suppressQuestProgressPill: "Hide Progress Pill",
        concurrentFarms: "Max Concurrent Farms",
        delayBetweenFarms: "Delay Between Farms",
        checkForNewQuests: "Quest Check Interval",
        maxFallbackAttempts: "Max Heartbeat Attempts",
        enableVerboseLogging: "Verbose Logging",
        // Settings Notes
        acceptQuestsAutomaticallyNote: "Automatically accept new available quests when they appear",
        autoCompleteAllQuestsNote: "Automatically complete all quest types (video, play, stream)",
        autoClaimRewardsNote: "Claim quest rewards automatically after completion",
        autoStartVideoQuestsNote: "Click 'Start Video Quest' button automatically",
        retryFailedQuestsNote: "Automatically retry quests that fail to complete",
        verifyQuestCompletionNote: "Double-check that quests are properly completed and claimed",
        claimRetryAttemptsNote: "Number of times to retry claiming rewards if it fails",
        questNotificationsNote: "Show desktop notifications for quest progress and completion",
        suppressQuestProgressPillNote: "Hide the quest progress notification pill in Discord UI",
        concurrentFarmsNote: "Maximum number of quests to farm simultaneously (higher = faster but more resource usage)",
        delayBetweenFarmsNote: "Delay in seconds between starting each quest (prevents rate limiting)",
        checkForNewQuestsNote: "How often to check for new quests (in minutes)",
        maxFallbackAttemptsNote: "Maximum heartbeat attempts before forcing completion (technical)",
        enableVerboseLoggingNote: "Enable detailed debug logs in console (for troubleshooting issues)",
        infoWarning: "⚠️ Changing advanced settings may affect plugin stability. Default values are recommended for most users.",
        // Footer
        copyDebugInfo: "📋 Copy Debug Info",
        // Language setting
        language: "Language",
        languageNote: "Select the display language for the plugin settings",
        // Notifications
        updateAvailableTitle: "Update Available!",
        updateAvailableContent: "Version {version} is now available!",
        updateNow: "Update Now",
        updateLater: "Update Later",
        updateDownloaded: "Update downloaded! Please reload Discord.",
        updateFailed: "Failed to download update",
        questCompletedTitle: "Quest Completed!",
        questStartedTitle: "Quest Started",
        questCompletedContent: "Successfully completed {name}!",
        questStartedContent: "Farming {name}...",
        questCompletedToast: "Quest completed: {name}",
        questStartedToast: "Farming: {name}",
        newQuestTitle: "New Quest Available!",
        newQuestContent: 'Please accept the quest "{name}" to start auto farming.',
        newQuestToast: "New quest available: {name}",
        goToQuests: "Go to Quests",
        remindMeLater: "Remind Me Later",
        errorCopyDebug: "📋 Copy Debug Info",
        errorDismiss: "Dismiss",
        debugCopied: "Debug info copied to clipboard!",
        debugCopyFailed: "Failed to copy debug info",
        // Unsupported quest
        unsupportedQuestTitle: "Unsupported Quest Task",
        unsupportedQuestContent: 'The quest "{name}" has an unsupported task type: {taskType}.',
        unsupportedQuestNote: "This quest requires manual completion as it's a server-side quest.",
        goToQuest: "Go to Quest",
        // Status dashboard
        statusTitle: "📊 Status Dashboard",
        statusFarming: "Farming",
        statusAvailable: "Available",
        statusCompleted: "Completed",
        statusFailed: "Failed Claims",
        statusIdle: "Idle",
        statusActive: "Active",
        // Quick actions
        quickActions: "⚡ Quick Actions",
        checkNow: "🔍 Check Now",
        stopAll: "⏹️ Stop All",
        claimAll: "🎁 Claim All",
        refreshStores: "🔄 Refresh",
        // Settings
        resetDefaults: "Reset to Defaults",
        resetConfirm: "Are you sure you want to reset all settings to defaults?",
        settingsReset: "Settings reset to defaults!",
        // Stuck Detection
        stuckDetection: "Stuck Detection",
        stuckDetectionNote: "Automatically detect and recover quests that stop progressing",
        stuckTimeout: "Stuck Timeout (minutes)",
        stuckTimeoutNote: "Consider quest stuck if no progress for this many minutes",
        statusStuck: "Stuck",
        stuckDetectedTitle: "Quest Stuck Detected",
        stuckDetectedContent: "Quest \"{name}\" appears stuck. Attempting recovery...",
        stuckRecoveredTitle: "Quest Recovered",
        stuckRecoveredContent: "Quest \"{name}\" has been restarted.",
        stuckRecoveryFailed: "Recovery failed for \"{name}\". Try manually.",
    },
    km: {
        // Tabs
        tabAutomation: "⚙️ ស្វ័យប្រវត្តិកម្ម",
        tabAdvanced: "🔧 កម្រិតខ្ពស់",
        // Page 1 Headers
        headerQuestAutomation: "⚙️ ស្វ័យប្រវត្តិកម្មបេសកកម្ម",
        headerRetryRecovery: "🔄 ព្យាយាមឡើងវិញ និងស្ដារ",
        headerNotificationsUI: "🔔 ការជូនដំណឹង និង UI",
        // Page 2 Headers
        headerPerformance: "⚡ ការកំណត់ប្រតិបត្តិការ",
        headerAdvancedTech: "🔧 ការកំណត់បច្ចេកទេសកម្រិតខ្ពស់",
        headerInfo: "ℹ️ ព័ត៌មាន",
        // Settings Names
        acceptQuestsAutomatically: "ទទួលបេសកកម្មដោយស្វ័យប្រវត្តិ",
        autoCompleteAllQuests: "បំពេញបេសកកម្មដោយស្វ័យប្រវត្តិ",
        autoClaimRewards: "ទាមទារรង្វាន់ដោយស្វ័យប្រវត្តិ",
        autoStartVideoQuests: "ចាប់ផ្ដើមបេសកកម្មវីដេអូស្វ័យប្រវត្តិ",
        retryFailedQuests: "ព្យាយាមបេសកកម្មដែលបរាជ័យឡើងវិញ",
        verifyQuestCompletion: "ផ្ទៀងផ្ទាត់ការបំពេញបេសកកម្ម",
        claimRetryAttempts: "ចំនួនដងព្យាយាមទាមទារ",
        questNotifications: "ការជូនដំណឹងបេសកកម្ម",
        suppressQuestProgressPill: "លាក់គ្រាប់វឌ្ឍនភាព",
        concurrentFarms: "ចំនួនបេសកកម្មព្រមគ្នា",
        delayBetweenFarms: "ពេលវេលារវាងបេសកកម្ម",
        checkForNewQuests: "ចន្លោះពេលត្រួតពិនិត្យ",
        maxFallbackAttempts: "ចំនួន Heartbeat អតិបរមា",
        enableVerboseLogging: "កំណត់ត្រាលម្អិត",
        // Settings Notes
        acceptQuestsAutomaticallyNote: "ទទួលយកបេសកកម្មថ្មីដែលមានដោយស្វ័យប្រវត្តិនៅពេលវាលេចឡើង",
        autoCompleteAllQuestsNote: "បំពេញប្រភេទបេសកកម្មទាំងអស់ដោយស្វ័យប្រវត្តិ (វីដេអូ ការលេង ការផ្សាយ)",
        autoClaimRewardsNote: "ទាមទាររង្វាន់បេសកកម្មដោយស្វ័យប្រវត្តិបន្ទាប់ពីបំពេញ",
        autoStartVideoQuestsNote: "ចុចប៊ូតុង 'ចាប់ផ្ដើមបេសកកម្មវីដេអូ' ដោយស្វ័យប្រវត្តិ",
        retryFailedQuestsNote: "ព្យាយាមបេសកកម្មដែលបរាជ័យម្ដងទៀតដោយស្វ័យប្រវត្តិ",
        verifyQuestCompletionNote: "ពិនិត្យឡើងវិញថាបេសកកម្មត្រូវបានបំពេញ និងទាមទារត្រឹមត្រូវ",
        claimRetryAttemptsNote: "ចំនួនដងដែលត្រូវព្យាយាមទាមទាររង្វាន់ឡើងវិញប្រសិនបើវាបរាជ័យ",
        questNotificationsNote: "បង្ហាញការជូនដំណឹងលើផ្ទៃតុសម្រាប់វឌ្ឍនភាព និងការបញ្ចប់បេសកកម្ម",
        suppressQuestProgressPillNote: "លាក់គ្រាប់ការជូនដំណឹងវឌ្ឍនភាពបេសកកម្មនៅក្នុង Discord UI",
        concurrentFarmsNote: "ចំនួនអតិបរមានៃបេសកកម្មដែលត្រូវដាំព្រមគ្នា (ខ្ពស់ = លឿនជាង ប៉ុន្តែប្រើធនធានច្រើន)",
        delayBetweenFarmsNote: "ពេលវេលា​ពន្យឺត​ជា​វិនាទី​រវាង​ការ​ចាប់ផ្ដើម​បេសកកម្ម​នីមួយៗ (ការពារ rate limiting)",
        checkForNewQuestsNote: "រាល់​ពេល​ណា​ត្រូវ​ពិនិត្យ​រក​បេសកកម្ម​ថ្មី (គិតជានាទី)",
        maxFallbackAttemptsNote: "ចំនួន heartbeat អតិបរមាមុនពេលបង្ខំឱ្យបញ្ចប់ (បច្ចេកទេស)",
        enableVerboseLoggingNote: "បើកកំណត់ត្រាបំបាត់កំហុសលម្អិតនៅក្នុង console (សម្រាប់ដោះស្រាយបញ្ហា)",
        infoWarning: "⚠️ ការផ្លាស់ប្ដូរការកំណត់កម្រិតខ្ពស់អាចប៉ះពាល់ដល់ស្ថេរភាពកម្មវិធី។ តម្លៃលំនាំដើមត្រូវបានណែនាំសម្រាប់អ្នកប្រើប្រាស់ភាគច្រើន។",
        // Footer
        copyDebugInfo: "📋 ចម្លងព័ត៌មានបំបាត់កំហុស",
        // Language setting
        language: "ភាសា",
        languageNote: "ជ្រើសរើសភាសាបង្ហាញសម្រាប់ការកំណត់កម្មវិធី",
        // Notifications
        updateAvailableTitle: "មានកំណែថ្មី!",
        updateAvailableContent: "កំណែ {version} ឥឡូវមានហើយ!",
        updateNow: "ធ្វើបច្ចុប្បន្នភាពឥឡូវ",
        updateLater: "ពេលក្រោយ",
        updateDownloaded: "បានទាញយកបច្ចុប្បន្នភាព! សូមផ្ទុក Discord ឡើងវិញ។",
        updateFailed: "បរាជ័យក្នុងការទាញយកបច្ចុប្បន្នភាព",
        questCompletedTitle: "បេសកកម្មបានបញ្ចប់!",
        questStartedTitle: "បេសកកម្មបានចាប់ផ្ដើម",
        questCompletedContent: "បានបញ្ចប់ {name} ដោយជោគជ័យ!",
        questStartedContent: "កំពុងដាំ {name}...",
        questCompletedToast: "បេសកកម្មបានបញ្ចប់: {name}",
        questStartedToast: "កំពុងដាំ: {name}",
        newQuestTitle: "មានបេសកកម្មថ្មី!",
        newQuestContent: 'សូមទទួលយកបេសកកម្ម "{name}" ដើម្បីចាប់ផ្ដើមដាំស្វ័យប្រវត្តិ។',
        newQuestToast: "មានបេសកកម្មថ្មី: {name}",
        goToQuests: "ទៅកាន់បេសកកម្ម",
        remindMeLater: "រំលឹកខ្ញុំពេលក្រោយ",
        errorCopyDebug: "📋 ចម្លងព័ត៌មានបំបាត់កំហុស",
        errorDismiss: "បដិសេធ",
        debugCopied: "បានចម្លងព័ត៌មានបំបាត់កំហុសទៅ clipboard!",
        debugCopyFailed: "បរាជ័យក្នុងការចម្លងព័ត៌មានបំបាត់កំហុស",
        // Unsupported quest
        unsupportedQuestTitle: "បេសកកម្មដែលមិនគាំទ្រ",
        unsupportedQuestContent: 'បេសកកម្ម "{name}" មានប្រភេទកិច្ចការដែលមិនគាំទ្រ: {taskType}។',
        unsupportedQuestNote: "បេសកកម្មនេះត្រូវការបំពេញដោយដៃព្រោះវាជាបេសកកម្មផ្នែកម៉ាស៊ីនមេ។",
        goToQuest: "ទៅកាន់បេសកកម្ម",
        // Status dashboard
        statusTitle: "📊 ផ្ទាំងស្ថានភាព",
        statusFarming: "កំពុងដាំ",
        statusAvailable: "មាន",
        statusCompleted: "បានបញ្ចប់",
        statusFailed: "ទាមទារបរាជ័យ",
        statusIdle: "ឈប់សម្រាក",
        statusActive: "សកម្ម",
        // Quick actions
        quickActions: "⚡ សកម្មភាពរហ័ស",
        checkNow: "🔍 ពិនិត្យឥឡូវ",
        stopAll: "⏹️ ឈប់ទាំងអស់",
        claimAll: "🎁 ទាមទារទាំងអស់",
        refreshStores: "🔄 ផ្ទុកឡើងវិញ",
        // Settings
        resetDefaults: "កំណត់ទៅលំនាំដើម",
        resetConfirm: "តើអ្នកប្រាកដថាចង់កំណត់ការកំណត់ទាំងអស់ទៅលំនាំដើមទេ?",
        settingsReset: "ការកំណត់ត្រូវបានកំណត់ទៅលំនាំដើម!",
        // Stuck Detection
        stuckDetection: "ការរកឃើញជាប់គាំង",
        stuckDetectionNote: "រកឃើញ និងស្ដារបេសកកម្មដែលឈប់ដំណើរការដោយស្វ័យប្រវត្តិ",
        stuckTimeout: "ពេលវេលាជាប់គាំង (នាទី)",
        stuckTimeoutNote: "ចាត់ទុកថាបេសកកម្មជាប់គាំង បើគ្មានវឌ្ឍនភាពក្នុងរយៈពេលប៉ុន្មាននាទីនេះ",
        statusStuck: "ជាប់គាំង",
        stuckDetectedTitle: "រកឃើញបេសកកម្មជាប់គាំង",
        stuckDetectedContent: "បេសកកម្ម \"{name}\" ហាក់ដូចជាជាប់គាំង។ កំពុងព្យាយាមស្ដារ...",
        stuckRecoveredTitle: "បេសកកម្មត្រូវបានស្ដារ",
        stuckRecoveredContent: "បេសកកម្ម \"{name}\" ត្រូវបានចាប់ផ្ដើមឡើងវិញ។",
        stuckRecoveryFailed: "ការស្ដារបរាជ័យសម្រាប់ \"{name}\"។ សូមព្យាយាមដោយដៃ។",
    },
    zh: {
        // Tabs
        tabAutomation: "⚙️ 自动化",
        tabAdvanced: "🔧 高级",
        // Page 1 Headers
        headerQuestAutomation: "⚙️ 任务自动化",
        headerRetryRecovery: "🔄 重试与恢复",
        headerNotificationsUI: "🔔 通知与界面",
        // Page 2 Headers
        headerPerformance: "⚡ 性能设置",
        headerAdvancedTech: "🔧 高级技术设置",
        headerInfo: "ℹ️ 信息",
        // Settings Names
        acceptQuestsAutomatically: "自动接受任务",
        autoCompleteAllQuests: "自动完成任务",
        autoClaimRewards: "自动领取奖励",
        autoStartVideoQuests: "自动开始视频任务",
        retryFailedQuests: "重试失败的任务",
        verifyQuestCompletion: "验证任务完成",
        claimRetryAttempts: "领取重试次数",
        questNotifications: "任务通知",
        suppressQuestProgressPill: "隐藏进度标签",
        concurrentFarms: "最大并发任务数",
        delayBetweenFarms: "任务间延迟",
        checkForNewQuests: "任务检查间隔",
        maxFallbackAttempts: "最大心跳尝试次数",
        enableVerboseLogging: "详细日志",
        // Settings Notes
        acceptQuestsAutomaticallyNote: "当新任务出现时自动接受",
        autoCompleteAllQuestsNote: "自动完成所有类型的任务（视频、游玩、直播）",
        autoClaimRewardsNote: "完成后自动领取任务奖励",
        autoStartVideoQuestsNote: "自动点击'开始视频任务'按钮",
        retryFailedQuestsNote: "自动重试未能完成的任务",
        verifyQuestCompletionNote: "双重检查任务是否已正确完成和领取",
        claimRetryAttemptsNote: "领取奖励失败时的重试次数",
        questNotificationsNote: "显示任务进度和完成的桌面通知",
        suppressQuestProgressPillNote: "隐藏Discord界面中的任务进度通知标签",
        concurrentFarmsNote: "同时执行的最大任务数（越高越快，但资源消耗越多）",
        delayBetweenFarmsNote: "开始每个任务之间的延迟秒数（防止速率限制）",
        checkForNewQuestsNote: "检查新任务的频率（分钟）",
        maxFallbackAttemptsNote: "强制完成前的最大心跳尝试次数（技术参数）",
        enableVerboseLoggingNote: "在控制台中启用详细调试日志（用于故障排除）",
        infoWarning: "⚠️ 更改高级设置可能会影响插件稳定性。建议大多数用户使用默认值。",
        // Footer
        copyDebugInfo: "📋 复制调试信息",
        // Language setting
        language: "语言",
        languageNote: "选择插件设置的显示语言",
        // Notifications
        updateAvailableTitle: "有新版本可用！",
        updateAvailableContent: "版本 {version} 现已可用！",
        updateNow: "立即更新",
        updateLater: "稍后更新",
        updateDownloaded: "更新已下载！请重新加载Discord。",
        updateFailed: "下载更新失败",
        questCompletedTitle: "任务已完成！",
        questStartedTitle: "任务已开始",
        questCompletedContent: "成功完成 {name}！",
        questStartedContent: "正在执行 {name}...",
        questCompletedToast: "任务已完成：{name}",
        questStartedToast: "正在执行：{name}",
        newQuestTitle: "新任务可用！",
        newQuestContent: '请接受任务 "{name}" 以开始自动执行。',
        newQuestToast: "新任务可用：{name}",
        goToQuests: "前往任务",
        remindMeLater: "稍后提醒我",
        errorCopyDebug: "📋 复制调试信息",
        errorDismiss: "关闭",
        debugCopied: "调试信息已复制到剪贴板！",
        debugCopyFailed: "复制调试信息失败",
        // Unsupported quest
        unsupportedQuestTitle: "不支持的任务类型",
        unsupportedQuestContent: '任务 "{name}" 有不支持的任务类型：{taskType}。',
        unsupportedQuestNote: "此任务需要手动完成，因为它是服务器端任务。",
        goToQuest: "前往任务",
        // Status dashboard
        statusTitle: "📊 状态仪表板",
        statusFarming: "正在执行",
        statusAvailable: "可用",
        statusCompleted: "已完成",
        statusFailed: "领取失败",
        statusIdle: "空闲",
        statusActive: "活跃",
        // Quick actions
        quickActions: "⚡ 快速操作",
        checkNow: "🔍 立即检查",
        stopAll: "⏹️ 停止所有",
        claimAll: "🎁 领取所有",
        refreshStores: "🔄 刷新",
        // Settings
        resetDefaults: "恢复默认设置",
        resetConfirm: "您确定要将所有设置恢复为默认值吗？",
        settingsReset: "设置已恢复为默认值！",
        // Stuck Detection
        stuckDetection: "卡住检测",
        stuckDetectionNote: "自动检测并恢复停止进展的任务",
        stuckTimeout: "卡住超时（分钟）",
        stuckTimeoutNote: "如果多少分钟内没有进展，则认为任务卡住",
        statusStuck: "卡住",
        stuckDetectedTitle: "检测到任务卡住",
        stuckDetectedContent: "任务 \"{name}\" 似乎卡住了。正在尝试恢复...",
        stuckRecoveredTitle: "任务已恢复",
        stuckRecoveredContent: "任务 \"{name}\" 已重新启动。",
        stuckRecoveryFailed: "恢复 \"{name}\" 失败。请手动尝试。",
    }
};

/** Get translated string. Usage: t('key') or t('key', { name: 'value' }) */
function t(key, params = {}) {
    const langSetting = BdApi.Data.load('FarmQuests', 'language') || 'en';
    const lang = translations[langSetting] || translations.en;
    let str = lang[key] ?? translations.en[key] ?? key;
    for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, v);
    }
    return str;
}

const config = {
    info: {
        name: 'FarmQuests',
        version: '1.9.0',
        github_raw: 'https://raw.githubusercontent.com/Sophan-Developer/FarmQuests/main/FarmQuests.plugin.js'
    },
    changelog: [
        { title: "AutoQuestComplete v0.6.0 Port (Mar 2026)", type: "fixed", items: [
            "Prefer taskConfigV2 over taskConfig to match Discord's latest quest API",
            "Added error reporting modal with pre-filled GitHub issue for quest failures",
            "Improved stop() cleanup - now clears active quest state variables",
            "Ported fixes from AutoQuestComplete v0.6.0"
        ]},
        { title: "Stuck Detection & Auto-Recovery (Feb 2026)", type: "added", items: [
            "Added automatic stuck quest detection - monitors progress every 30 seconds",
            "Auto-recovery for stuck quests - refreshes stores and restarts farming",
            "Configurable stuck timeout (default: 3 minutes)",
            "New status indicator showing stuck quests count",
            "Full localization for stuck detection (EN/KM/ZH)"
        ]},
        { title: "Unsupported Quest Handling (Feb 2026)", type: "added", items: [
            "Added ACHIEVEMENT_IN_ACTIVITY quest type detection",
            "New user-friendly modal for unsupported server-side quests",
            "Tracks unsupported quests to avoid repeated alerts",
            "Full localization for unsupported quest messages (EN/KM/ZH)"
        ]},
        { title: "Discord API Updates (Feb 2026)", type: "fixed", items: [
            "Fixed API module resolution - updated from .tn to .Bo export pattern",
            "Fixed FluxDispatcher lookup with searchExports option",
            "Fixed exe name extraction for PLAY_ON_DESKTOP quests",
            "Ported fixes from AutoQuestComplete v0.5.6"
        ]},
        { title: "Multi-Language Support (Feb 2026)", type: "added", items: [
            "Added full localization: English, Khmer, and Chinese",
            "Language dropdown selector at the top of the settings panel",
            "All settings labels, notes, headers, tabs, notifications and toasts are translated",
            "Language preference persists across reloads"
        ]},
        { title: "Bug Fixes (Jan 2026)", type: "fixed", items: [
            "Fixed syntax error in API module resolution (line 87)",
            "Fixed version comparison logic in update checker",
            "Fixed memory leaks - intervals and Flux subscriptions now properly cleaned up",
            "Added null-safety guards in webpack module finder"
        ]},
        { title: "Previous Improvements", type: "improved", items: [
            "Better error handling when Discord modules are missing",
            "Improved stop() cleanup to prevent resource leaks",
            "More robust store resolution with better fallback patterns",
            "Copy Debug Info feature for easier troubleshooting"
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
        { type: "switch", id: "stuckDetection", name: "Stuck Detection", note: "Automatically detect and recover quests that stop progressing", value: true, page: 1 },
        { type: "number", id: "stuckTimeout", name: "Stuck Timeout (minutes)", note: "Consider quest stuck if no progress for this many minutes", value: 3, min: 1, max: 10, step: 1, page: 1 },
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
let FluxDispatcher = Webpack.getByKeys?.('dispatch', 'subscribe', 'register', {searchExports: true}) ?? null;

let apiModule = null;
try {
	if (typeof Webpack.getBySource === "function") {
		apiModule = Webpack.getBySource('bind(null,"get")');
	}
	if (!apiModule && typeof Webpack.getModule === "function") {
		apiModule = Webpack.getModule(m => m?.Bo?.get);
	}
} catch (e) { /* ignore */ }
const api = apiModule?.Bo ?? null;

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
		this._unsupportedQuests = new Set(); // Track quests with unsupported task types (like ACHIEVEMENT_IN_ACTIVITY)
		this._questProgressTracker = new Map(); // Track { questId -> { lastProgress, lastUpdateTime, startTime } }
		this._stuckQuests = new Set(); // Track quests detected as stuck
		this._stuckCheckInterval = null; // Interval for stuck detection
		this._questErrorTracker = new Map(); // Track { questId -> { consecutiveErrors, lastErrorTime, totalErrors } }
		this._questRecoveryAttempts = new Map(); // Track { questId -> recoveryCount } to limit retries
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
		this.FluxDispatcher = Webpack.getByKeys?.('dispatch', 'subscribe', 'register', {searchExports: true}) ?? null;
		this.api = Webpack.getModule?.(m => m?.Bo?.get)?.Bo ?? null;
		
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
				stuckDetection: true,
				stuckTimeout: 3,
				// Page 2: Advanced Settings
				checkForNewQuests: 5,
				concurrentFarms: 3,
				delayBetweenFarms: 2,
				maxFallbackAttempts: 30,
				claimRetryAttempts: 3,
				verifyQuestCompletion: true,
				suppressQuestProgressPill: false,
				enableVerboseLogging: false,
				// Language
				language: 'en'
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
					unsupported: this._unsupportedQuests?.size ?? 0,
					failedClaims: this.failedClaimQuests?.size ?? 0,
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
			UI.showToast(t('debugCopied'), { type: 'success' });
		} catch (e) {
			UI.showToast(t('debugCopyFailed'), { type: 'error' });
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
							label: t('errorCopyDebug'),
							onClick: () => this.copyDebugInfo()
						},
						{
							label: t('errorDismiss'),
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
			this.FluxDispatcher = Webpack.getByKeys?.('dispatch', 'subscribe', 'register', {searchExports: true}) ?? null;
			this.api = Webpack.getModule?.(m => m?.Bo?.get)?.Bo ?? null;
			
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
			
			// Map setting header text to translation keys
			const headerTranslationMap = {
				"⚙️ Quest Automation": "headerQuestAutomation",
				"🔄 Retry & Recovery": "headerRetryRecovery",
				"🔔 Notifications & UI": "headerNotificationsUI",
				"⚡ Performance Settings": "headerPerformance",
				"🔧 Advanced Technical Settings": "headerAdvancedTech",
				"ℹ️ Information": "headerInfo"
			};
			
			// Helper to create styled button
			const createButton = (text, onClick, style = 'secondary') => {
				const btn = document.createElement('button');
				btn.textContent = text;
				const styles = {
					primary: 'background: var(--brand-experiment); color: white;',
					secondary: 'background: var(--button-secondary-background); color: var(--text-normal);',
					danger: 'background: var(--button-danger-background); color: white;',
					success: 'background: var(--status-positive-background); color: white;'
				};
				btn.style.cssText = `padding: 8px 14px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s ease; ${styles[style] || styles.secondary}`;
				btn.onmouseenter = () => { btn.style.filter = 'brightness(1.1)'; btn.style.transform = 'translateY(-1px)'; };
				btn.onmouseleave = () => { btn.style.filter = 'brightness(1)'; btn.style.transform = 'translateY(0)'; };
				btn.onclick = onClick;
				return btn;
			};
			
			const createPagedPanel = () => {
				const container = document.createElement('div');
				container.style.cssText = 'padding: 16px; background: var(--background-secondary); border-radius: 8px; max-width: 800px;';
				
				// ═══════════════════════════════════════════════════════════════
				// STATUS DASHBOARD
				// ═══════════════════════════════════════════════════════════════
				const statusSection = document.createElement('div');
				statusSection.style.cssText = 'margin-bottom: 16px; padding: 16px; background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary-alt) 100%); border-radius: 8px; border: 1px solid var(--background-modifier-accent);';
				
				const statusHeader = document.createElement('div');
				statusHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;';
				
				const statusTitle = document.createElement('h3');
				statusTitle.textContent = t('statusTitle');
				statusTitle.style.cssText = 'margin: 0; font-size: 14px; font-weight: 600; color: var(--header-primary);';
				
				const statusIndicator = document.createElement('div');
				const isActive = (self.farmingQuest?.size ?? 0) > 0;
				statusIndicator.style.cssText = `display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; background: ${isActive ? 'var(--status-positive-background)' : 'var(--background-modifier-accent)'}; color: ${isActive ? 'white' : 'var(--text-muted)'};`;
				statusIndicator.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${isActive ? '#3ba55c' : 'var(--text-muted)'}; ${isActive ? 'animation: pulse 2s infinite;' : ''}"></span> ${isActive ? t('statusActive') : t('statusIdle')}`;
				
				statusHeader.appendChild(statusTitle);
				statusHeader.appendChild(statusIndicator);
				statusSection.appendChild(statusHeader);
				
				// Status cards
				const statusCards = document.createElement('div');
				statusCards.style.cssText = 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;';
				
				const createStatusCard = (label, value, color = 'var(--text-normal)') => {
					const card = document.createElement('div');
					card.style.cssText = 'text-align: center; padding: 10px 8px; background: var(--background-secondary); border-radius: 6px;';
					card.innerHTML = `
						<div style="font-size: 20px; font-weight: 700; color: ${color}; margin-bottom: 2px;">${value}</div>
						<div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${label}</div>
					`;
					return card;
				};
				
				const farmingCount = self.farmingQuest?.size ?? 0;
				const availableCount = self.farmableQuests?.length ?? 0;
				const completedCount = (self.availableQuests ?? []).filter(q => q?.userStatus?.completedAt).length;
				const failedCount = self.failedClaimQuests?.size ?? 0;
				const stuckCount = self._stuckQuests?.size ?? 0;
				
				statusCards.appendChild(createStatusCard(t('statusFarming'), farmingCount, farmingCount > 0 ? 'var(--status-positive)' : 'var(--text-normal)'));
				statusCards.appendChild(createStatusCard(t('statusAvailable'), availableCount, availableCount > 0 ? 'var(--brand-experiment)' : 'var(--text-normal)'));
				statusCards.appendChild(createStatusCard(t('statusCompleted'), completedCount, 'var(--status-positive)'));
				statusCards.appendChild(createStatusCard(t('statusFailed'), failedCount, failedCount > 0 ? 'var(--status-danger)' : 'var(--text-muted)'));
				statusCards.appendChild(createStatusCard(t('statusStuck'), stuckCount, stuckCount > 0 ? 'var(--status-warning, #faa61a)' : 'var(--text-muted)'));
				
				statusSection.appendChild(statusCards);
				container.appendChild(statusSection);
				
				// ═══════════════════════════════════════════════════════════════
				// QUICK ACTIONS
				// ═══════════════════════════════════════════════════════════════
				const actionsSection = document.createElement('div');
				actionsSection.style.cssText = 'margin-bottom: 16px; padding: 12px 16px; background: var(--background-primary); border-radius: 8px;';
				
				const actionsHeader = document.createElement('div');
				actionsHeader.textContent = t('quickActions');
				actionsHeader.style.cssText = 'font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;';
				actionsSection.appendChild(actionsHeader);
				
				const actionsRow = document.createElement('div');
				actionsRow.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px;';
				
				actionsRow.appendChild(createButton(t('checkNow'), () => {
					self.updateQuests();
					UI.showToast('Checking for quests...', { type: 'info' });
					setTimeout(() => container.replaceWith(createPagedPanel()), 1000);
				}, 'primary'));
				
				actionsRow.appendChild(createButton(t('stopAll'), () => {
					self.stopFarmingAll();
					UI.showToast('Stopped all farming', { type: 'warning' });
					setTimeout(() => container.replaceWith(createPagedPanel()), 500);
				}, 'danger'));
				
				actionsRow.appendChild(createButton(t('claimAll'), async () => {
					await self.claimAllCompletedQuests();
					setTimeout(() => container.replaceWith(createPagedPanel()), 1000);
				}, 'success'));
				
				actionsRow.appendChild(createButton(t('refreshStores'), () => {
					self.ensureStores();
					UI.showToast('Stores refreshed', { type: 'success' });
				}, 'secondary'));
				
				actionsSection.appendChild(actionsRow);
				container.appendChild(actionsSection);
				
				// ═══════════════════════════════════════════════════════════════
				// LANGUAGE SELECTOR
				// ═══════════════════════════════════════════════════════════════
				const langRow = document.createElement('div');
				langRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--background-primary); border-radius: 6px; margin-bottom: 16px;';
				
				const langLabelDiv = document.createElement('div');
				langLabelDiv.style.cssText = 'flex: 1;';
				const langLabel = document.createElement('div');
				langLabel.textContent = t('language');
				langLabel.style.cssText = 'font-weight: 500; color: var(--header-primary); font-size: 15px; margin-bottom: 4px;';
				const langNote = document.createElement('div');
				langNote.textContent = t('languageNote');
				langNote.style.cssText = 'font-size: 13px; color: var(--text-muted); line-height: 1.4;';
				langLabelDiv.appendChild(langLabel);
				langLabelDiv.appendChild(langNote);
				langRow.appendChild(langLabelDiv);
				
				const langSelect = document.createElement('select');
				langSelect.style.cssText = 'padding: 8px 12px; background: var(--input-background); border: 1px solid var(--background-tertiary); border-radius: 4px; color: var(--text-normal); font-size: 14px; cursor: pointer; min-width: 140px;';
				const languages = [
					{ value: 'en', label: '🇺🇸 English' },
					{ value: 'km', label: '🇰🇭 ខ្មែរ (Khmer)' },
					{ value: 'zh', label: '🇨🇳 中文 (Chinese)' }
				];
				const currentLang = self.settings['language'] || 'en';
				languages.forEach(lang => {
					const option = document.createElement('option');
					option.value = lang.value;
					option.textContent = lang.label;
					if (lang.value === currentLang) option.selected = true;
					langSelect.appendChild(option);
				});
				langSelect.onchange = () => {
					self.settings['language'] = langSelect.value;
					container.replaceWith(createPagedPanel());
				};
				langRow.appendChild(langSelect);
				container.appendChild(langRow);
				
				// ═══════════════════════════════════════════════════════════════
				// PAGE TABS
				// ═══════════════════════════════════════════════════════════════
				const tabsContainer = document.createElement('div');
				tabsContainer.style.cssText = 'display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid var(--background-modifier-accent); padding-bottom: 12px;';
				
				const createTab = (label, page) => {
					const tab = document.createElement('button');
					tab.textContent = label;
					const isActive = currentPage === page;
					tab.style.cssText = `padding: 10px 20px; border: none; border-radius: 6px 6px 0 0; background: ${isActive ? 'var(--brand-experiment)' : 'var(--background-tertiary)'}; color: ${isActive ? 'white' : 'var(--text-normal)'}; cursor: pointer; font-weight: ${isActive ? '600' : '400'}; transition: all 0.2s ease; font-size: 14px; flex: 1;`;
					tab.onmouseenter = () => { if (!isActive) tab.style.background = 'var(--background-modifier-hover)'; };
					tab.onmouseleave = () => { if (!isActive) tab.style.background = 'var(--background-tertiary)'; };
					tab.onclick = () => { currentPage = page; container.replaceWith(createPagedPanel()); };
					return tab;
				};
				
				tabsContainer.appendChild(createTab(t('tabAutomation'), 1));
				tabsContainer.appendChild(createTab(t('tabAdvanced'), 2));
				container.appendChild(tabsContainer);
				
				// ═══════════════════════════════════════════════════════════════
				// SETTINGS CONTAINER
				// ═══════════════════════════════════════════════════════════════
				const settingsContainer = document.createElement('div');
				settingsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
				
				const pageSettings = config.settings.filter(s => s.page === currentPage);
				
				pageSettings.forEach(setting => {
					if (setting.type === 'header') {
						const header = document.createElement('h3');
						const headerKey = headerTranslationMap[setting.text];
						header.textContent = headerKey ? t(headerKey) : setting.text;
						header.style.cssText = 'margin: 16px 0 8px 0; font-size: 14px; font-weight: 600; color: var(--header-primary); border-left: 3px solid var(--brand-experiment); padding-left: 10px;';
						settingsContainer.appendChild(header);
						return;
					}
					
					if (setting.type === 'divider') {
						const divider = document.createElement('div');
						divider.style.cssText = 'height: 1px; background: var(--background-modifier-accent); margin: 8px 0;';
						settingsContainer.appendChild(divider);
						return;
					}
					
					if (setting.type === 'info') {
						const info = document.createElement('div');
						info.textContent = t('infoWarning');
						info.style.cssText = 'padding: 10px 14px; background: var(--info-warning-background); border-left: 3px solid var(--info-warning-foreground); border-radius: 4px; color: var(--text-normal); font-size: 12px; line-height: 1.5;';
						settingsContainer.appendChild(info);
						return;
					}
					
					const settingRow = document.createElement('div');
					settingRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--background-primary); border-radius: 6px; transition: all 0.15s ease; border: 1px solid transparent;';
					settingRow.onmouseenter = () => { settingRow.style.background = 'var(--background-modifier-hover)'; settingRow.style.borderColor = 'var(--background-modifier-accent)'; };
					settingRow.onmouseleave = () => { settingRow.style.background = 'var(--background-primary)'; settingRow.style.borderColor = 'transparent'; };
					
					const labelDiv = document.createElement('div');
					labelDiv.style.cssText = 'flex: 1; min-width: 0;';
					
					const label = document.createElement('div');
					label.textContent = setting.id ? t(setting.id) : setting.name;
					label.style.cssText = 'font-weight: 500; color: var(--header-primary); font-size: 14px; margin-bottom: 2px;';
					
					const note = document.createElement('div');
					note.textContent = setting.id ? t(setting.id + 'Note') : setting.note;
					note.style.cssText = 'font-size: 12px; color: var(--text-muted); line-height: 1.3;';
					
					labelDiv.appendChild(label);
					labelDiv.appendChild(note);
					settingRow.appendChild(labelDiv);
					
					if (setting.type === 'switch') {
						const switchContainer = document.createElement('div');
						switchContainer.style.cssText = 'position: relative; width: 44px; height: 24px; flex-shrink: 0; margin-left: 12px;';
						
						const switchInput = document.createElement('input');
						switchInput.type = 'checkbox';
						switchInput.checked = self.settings[setting.id] ?? setting.value;
						switchInput.style.cssText = 'opacity: 0; width: 0; height: 0; position: absolute;';
						
						const slider = document.createElement('span');
						slider.style.cssText = `position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: ${switchInput.checked ? 'var(--brand-experiment)' : 'var(--background-modifier-accent)'}; border-radius: 24px; transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);`;
						
						const knob = document.createElement('span');
						knob.style.cssText = `position: absolute; height: 18px; width: 18px; left: ${switchInput.checked ? '23px' : '3px'}; bottom: 3px; background: white; border-radius: 50%; transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 1px 3px rgba(0,0,0,0.3);`;
						
						slider.appendChild(knob);
						switchContainer.appendChild(switchInput);
						switchContainer.appendChild(slider);
						
						const updateSwitch = () => {
							self.settings[setting.id] = switchInput.checked;
							slider.style.background = switchInput.checked ? 'var(--brand-experiment)' : 'var(--background-modifier-accent)';
							knob.style.left = switchInput.checked ? '23px' : '3px';
							if (setting.id === 'autoStartVideoQuests') {
								if (switchInput.checked) self.startAutoStart(); else self.stopAutoStart();
							} else if (setting.id === 'checkForNewQuests') {
								self.startInterval();
							} else if (setting.id === 'stuckDetection') {
								if (switchInput.checked) self.startStuckDetection(); else self.stopStuckDetection();
							}
						};
						
						switchInput.onchange = updateSwitch;
						switchContainer.onclick = () => { switchInput.checked = !switchInput.checked; updateSwitch(); };
						settingRow.appendChild(switchContainer);
					} else if (setting.type === 'number') {
						// Enhanced number input with +/- stepper buttons
						const numberContainer = document.createElement('div');
						numberContainer.style.cssText = 'display: flex; align-items: center; gap: 0; flex-shrink: 0; margin-left: 12px; border-radius: 6px; overflow: hidden; border: 1px solid var(--background-tertiary);';
						
						const minusBtn = document.createElement('button');
						minusBtn.textContent = '−';
						minusBtn.style.cssText = 'width: 32px; height: 32px; border: none; background: var(--background-tertiary); color: var(--text-normal); cursor: pointer; font-size: 16px; font-weight: 600; transition: background 0.15s;';
						minusBtn.onmouseenter = () => minusBtn.style.background = 'var(--background-modifier-hover)';
						minusBtn.onmouseleave = () => minusBtn.style.background = 'var(--background-tertiary)';
						
						const numberInput = document.createElement('input');
						numberInput.type = 'number';
						numberInput.value = self.settings[setting.id] ?? setting.value;
						numberInput.min = setting.min;
						numberInput.max = setting.max;
						numberInput.step = setting.step;
						numberInput.style.cssText = 'width: 50px; height: 32px; padding: 0; background: var(--input-background); border: none; border-left: 1px solid var(--background-tertiary); border-right: 1px solid var(--background-tertiary); color: var(--text-normal); font-size: 14px; text-align: center; -moz-appearance: textfield;';
						
						const plusBtn = document.createElement('button');
						plusBtn.textContent = '+';
						plusBtn.style.cssText = 'width: 32px; height: 32px; border: none; background: var(--background-tertiary); color: var(--text-normal); cursor: pointer; font-size: 16px; font-weight: 600; transition: background 0.15s;';
						plusBtn.onmouseenter = () => plusBtn.style.background = 'var(--background-modifier-hover)';
						plusBtn.onmouseleave = () => plusBtn.style.background = 'var(--background-tertiary)';
						
						const updateValue = (newVal) => {
							const min = Number(setting.min);
							const max = Number(setting.max);
							newVal = Math.max(min, Math.min(max, newVal));
							numberInput.value = newVal;
							self.settings[setting.id] = newVal;
							if (setting.id === 'checkForNewQuests') self.startInterval();
						};
						
						minusBtn.onclick = () => updateValue(Number(numberInput.value) - (setting.step || 1));
						plusBtn.onclick = () => updateValue(Number(numberInput.value) + (setting.step || 1));
						numberInput.oninput = () => {
							const val = Number(numberInput.value);
							if (!isNaN(val)) updateValue(val);
						};
						
						numberContainer.appendChild(minusBtn);
						numberContainer.appendChild(numberInput);
						numberContainer.appendChild(plusBtn);
						settingRow.appendChild(numberContainer);
					}
					
					settingsContainer.appendChild(settingRow);
				});
				
				container.appendChild(settingsContainer);
				
				// ═══════════════════════════════════════════════════════════════
				// FOOTER
				// ═══════════════════════════════════════════════════════════════
				const footer = document.createElement('div');
				footer.style.cssText = 'margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--background-modifier-accent); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;';
				
				const footerLeft = document.createElement('div');
				footerLeft.style.cssText = 'display: flex; align-items: center; gap: 8px;';
				
				const version = document.createElement('span');
				version.textContent = `FarmQuests v${config.info.version}`;
				version.style.cssText = 'font-size: 12px; color: var(--text-muted);';
				footerLeft.appendChild(version);
				
				const footerRight = document.createElement('div');
				footerRight.style.cssText = 'display: flex; gap: 8px;';
				
				// Reset defaults button
				const resetBtn = createButton(t('resetDefaults'), () => {
					if (confirm(t('resetConfirm'))) {
						const defaults = {
							acceptQuestsAutomatically: true,
							autoCompleteAllQuests: true,
							autoClaimRewards: true,
							autoStartVideoQuests: true,
							retryFailedQuests: true,
							verifyQuestCompletion: true,
							questNotifications: true,
							suppressQuestProgressPill: false,
							enableVerboseLogging: false,
							checkForNewQuests: 5,
							concurrentFarms: 3,
							delayBetweenFarms: 2,
							maxFallbackAttempts: 30,
							claimRetryAttempts: 3,
							stuckDetection: true,
							stuckTimeout: 3
						};
						for (const [key, value] of Object.entries(defaults)) {
							self.settings[key] = value;
						}
						UI.showToast(t('settingsReset'), { type: 'success' });
						container.replaceWith(createPagedPanel());
					}
				}, 'secondary');
				
				const debugBtn = createButton(t('copyDebugInfo'), () => self.copyDebugInfo(), 'secondary');
				
				footerRight.appendChild(resetBtn);
				footerRight.appendChild(debugBtn);
				
				footer.appendChild(footerLeft);
				footer.appendChild(footerRight);
				container.appendChild(footer);
				
				// Add CSS animation for pulse
				const style = document.createElement('style');
				style.textContent = `
					@keyframes pulse {
						0%, 100% { opacity: 1; }
						50% { opacity: 0.5; }
					}
				`;
				container.appendChild(style);
				
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
					title: `${this.meta.name} ${t('updateAvailableTitle')}`,
					content: t('updateAvailableContent', { version: remoteMeta.version }),
					type: 'info',
					duration: 1/0,
					actions: [
						{
							label: t('updateNow'),
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
										UI.showToast(t('updateDownloaded'), { type: 'success' });
									} catch (err) {
										this.log('error', 'Failed to download update', err.message);
										UI.showToast(t('updateFailed'), { type: 'error' });
									}
								}
							}
						},
						{ label: t('updateLater'), onClick: () => {} }
					]
				});
			} else {
				UI.showToast(`${this.meta.name} ${t('updateAvailableContent', { version: remoteMeta.version })}`, { type: 'info' });
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
					title: completed ? t('questCompletedTitle') : t('questStartedTitle'),
					content: completed ? t('questCompletedContent', { name: questName }) : t('questStartedContent', { name: questName }),
					type: completed ? 'success' : 'info',
					duration: 5000
				});
			} else {
				UI.showToast(completed ? t('questCompletedToast', { name: questName }) : t('questStartedToast', { name: questName }), { 
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
			// Patch getRunningGames to return fake games (like the gist does)
			// When fake games exist, return ONLY fake games so Discord thinks the quest game is running
			Patcher.instead(this.meta.name, this.RunningGameStore, "getRunningGames", (thisObject, args, originalFunction) => {
				if (this.fakeGames.size > 0) {
					return Array.from(this.fakeGames.values());
				}
				return originalFunction?.apply(thisObject, args) ?? [];
			});
			// Patch getGameForPID to find fake games by PID
			Patcher.instead(this.meta.name, this.RunningGameStore, "getGameForPID", (thisObject, args, originalFunction) => {
				if (this.fakeGames.size > 0) {
					const found = Array.from(this.fakeGames.values()).find(game => game.pid === args?.[0]);
					if (found) return found;
				}
				return originalFunction?.apply(thisObject, args);
			});
		}

		if (this.ApplicationStreamingStore) {
			// Patch getStreamerActiveStreamMetadata to return fake stream data (like the gist does)
			Patcher.instead(this.meta.name, this.ApplicationStreamingStore, "getStreamerActiveStreamMetadata", (thisObject, args, originalFunction) => {
				if (this.fakeApplications.size > 0) {
					// Return the first fake app's metadata (only one stream at a time)
					const arr = Array.from(this.fakeApplications.values());
					return arr.length ? arr[0] : originalFunction?.apply(thisObject, args);
				}
				return originalFunction?.apply(thisObject, args);
			});
		}

		// IMMEDIATELY check and run quests like AutoQuestComplete (don't wait for interval)
		this.runImmediateQuestCheck();
		
		this.startInterval();
		this.startStuckDetection(); // Start stuck quest detection
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
		this._unsupportedQuests?.clear();
		this._questProgressTracker?.clear();
		this._stuckQuests?.clear();
		this._questErrorTracker?.clear();
		this._questRecoveryAttempts?.clear();
		this._activeQuestId = null;
		this._activeQuestName = null;
		
		// Stop stuck detection interval
		if (this._stuckCheckInterval) {
			clearInterval(this._stuckCheckInterval);
			this._stuckCheckInterval = null;
		}
		
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

	// ═══════════════════════════════════════════════════════════════
	// STUCK DETECTION & AUTO-RECOVERY
	// ═══════════════════════════════════════════════════════════════
	
	startStuckDetection() {
		if (!this.settings.stuckDetection) return;
		
		this.stopStuckDetection();
		// Check for stuck quests every 20 seconds (more responsive)
		this._stuckCheckInterval = setInterval(() => {
			this.checkForStuckQuests();
		}, 20 * 1000);
		this.log('debug', 'Stuck detection started (20s interval)');
	}
	
	stopStuckDetection() {
		if (this._stuckCheckInterval) {
			clearInterval(this._stuckCheckInterval);
			this._stuckCheckInterval = null;
		}
	}
	
	/**
	 * Track progress update for a quest (call this when heartbeat succeeds)
	 */
	trackQuestProgress(questId, progress) {
		const now = Date.now();
		const existing = this._questProgressTracker.get(questId);
		
		if (!existing) {
			// First time tracking this quest
			this._questProgressTracker.set(questId, {
				lastProgress: progress,
				lastUpdateTime: now,
				startTime: now
			});
		} else if (progress > existing.lastProgress) {
			// Progress increased - update tracker
			this._questProgressTracker.set(questId, {
				lastProgress: progress,
				lastUpdateTime: now,
				startTime: existing.startTime
			});
			// Remove from stuck list if it was there
			this._stuckQuests.delete(questId);
			// Reset error count on successful progress
			this._questErrorTracker.delete(questId);
		}
		// If progress didn't increase, don't update lastUpdateTime (to detect stuck)
	}
	
	/**
	 * Track a heartbeat/API error for a quest (call on 404, 400, network errors)
	 */
	trackQuestError(questId, errorType = 'unknown', statusCode = null) {
		const now = Date.now();
		const existing = this._questErrorTracker.get(questId) || { consecutiveErrors: 0, lastErrorTime: 0, totalErrors: 0, lastStatusCode: null };
		existing.consecutiveErrors++;
		existing.totalErrors++;
		existing.lastErrorTime = now;
		existing.lastStatusCode = statusCode;
		existing.lastErrorType = errorType;
		this._questErrorTracker.set(questId, existing);
		
		this.log('debug', `Quest ${questId} error tracked: ${errorType} (${statusCode}), consecutive: ${existing.consecutiveErrors}, total: ${existing.totalErrors}`);
		
		// If too many consecutive errors (5+), trigger immediate stuck recovery
		const errorThreshold = 5;
		if (existing.consecutiveErrors >= errorThreshold && !this._stuckQuests.has(questId)) {
			this.log('warn', `Quest ${questId} has ${existing.consecutiveErrors} consecutive errors - triggering auto-recovery`);
			this._stuckQuests.add(questId);
			this.handleStuckQuest(questId);
		}
	}
	
	/**
	 * Check all farming quests for stuck status (progress stall OR error-stuck)
	 */
	checkForStuckQuests() {
		if (!this.settings.stuckDetection) return;
		
		const now = Date.now();
		const stuckTimeoutMs = (this.settings.stuckTimeout ?? 3) * 60 * 1000; // Default 3 minutes
		
		for (const [questId, isActive] of this.farmingQuest) {
			if (!isActive) continue; // Skip quests that are finishing
			
			// Check 1: Progress stall detection
			const tracker = this._questProgressTracker.get(questId);
			if (tracker) {
				const timeSinceLastProgress = now - tracker.lastUpdateTime;
				
				if (timeSinceLastProgress > stuckTimeoutMs && !this._stuckQuests.has(questId)) {
					this._stuckQuests.add(questId);
					this.log('warn', `Quest ${questId} appears stuck - no progress for ${Math.round(timeSinceLastProgress / 1000)}s`);
					this.handleStuckQuest(questId);
					continue;
				}
			}
			
			// Check 2: Error-stuck detection (repeated API failures)
			const errorTracker = this._questErrorTracker.get(questId);
			if (errorTracker && !this._stuckQuests.has(questId)) {
				const recentErrors = (now - errorTracker.lastErrorTime) < 60000; // Errors in last 60s
				if (recentErrors && errorTracker.consecutiveErrors >= 3) {
					this._stuckQuests.add(questId);
					this.log('warn', `Quest ${questId} error-stuck - ${errorTracker.consecutiveErrors} consecutive errors (last: ${errorTracker.lastStatusCode})`);
					this.handleStuckQuest(questId);
				}
			}
		}
	}
	
	/**
	 * Handle a stuck quest - attempt recovery with exponential backoff
	 */
	async handleStuckQuest(questId) {
		try {
			// Track recovery attempts to avoid infinite loops
			const recoveryCount = (this._questRecoveryAttempts.get(questId) || 0) + 1;
			this._questRecoveryAttempts.set(questId, recoveryCount);
			
			const maxRecoveries = 5;
			if (recoveryCount > maxRecoveries) {
				const quest = this.availableQuests?.find(q => q.id === questId);
				const questName = quest?.config?.messages?.questName ?? `Quest ${questId}`;
				this.log('warn', `Quest ${questName} exceeded max recovery attempts (${maxRecoveries}). Stopping.`);
				UI.showToast(t('stuckRecoveryFailed', { name: questName }), { type: 'error' });
				this.farmingQuest.set(questId, false);
				this.farmingQuest.delete(questId);
				return;
			}
			
			// Find the quest object
			const quest = this.availableQuests?.find(q => q.id === questId);
			const questName = quest?.config?.messages?.questName ?? `Quest ${questId}`;
			
			// Notify user
			if (this.settings.questNotifications) {
				UI.showToast(t('stuckDetectedContent', { name: questName }) + ` (attempt ${recoveryCount}/${maxRecoveries})`, { type: 'warning' });
			}
			
			this.log('info', `Attempting recovery #${recoveryCount} for stuck quest: ${questName}`);
			
			// Step 1: Stop the stuck quest and clean up all resources
			this.farmingQuest.set(questId, false);
			
			// Step 2: Clean up fake games/streams and dispatch removal
			const hadFakeGame = this.fakeGames.has(questId);
			const fakeGame = this.fakeGames.get(questId);
			this.fakeGames.delete(questId);
			this.fakeApplications.delete(questId);
			
			// Dispatch game removal to clean up Discord's state
			if (hadFakeGame && fakeGame) {
				try {
					const FluxDispatcher = this.FluxDispatcher ?? Webpack.getByKeys?.('dispatch', 'subscribe', 'register', {searchExports: true});
					// Use remainingFakes (not patched getRunningGames) for proper multi-quest cleanup
					const remainingFakes = Array.from(this.fakeGames.values());
					FluxDispatcher?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: remainingFakes });
					this.log('debug', 'Dispatched RUNNING_GAMES_CHANGE to clean up fake game');
				} catch (e) { /* ignore */ }
			}
			
			// Step 3: Clear trackers
			this._questProgressTracker.delete(questId);
			this._questErrorTracker.delete(questId);
			
			// Step 4: Exponential backoff - wait longer on each recovery attempt
			const backoffDelay = Math.min(3000 * Math.pow(1.5, recoveryCount - 1), 15000);
			this.log('debug', `Waiting ${backoffDelay}ms before recovery...`);
			await new Promise(r => setTimeout(r, backoffDelay));
			
			// Step 5: Aggressively refresh ALL stores
			this.ensureStores();
			await new Promise(r => setTimeout(r, 500));
			// Double refresh to ensure fresh state
			this.ensureStores();
			
			// Step 6: Wait for stores to settle
			await new Promise(r => setTimeout(r, 1500));
			
			// Step 7: Remove from farming map and stuck set to allow restart
			this.farmingQuest.delete(questId);
			this._stuckQuests.delete(questId);
			
			// Step 8: Re-fetch quest from FRESH store data
			const store = this.QuestsStore ?? getQuestsStore();
			let freshQuest = null;
			
			// Try multiple methods to get the quest
			if (store) {
				if (typeof store.getQuest === 'function') freshQuest = store.getQuest(questId);
				if (!freshQuest && store.quests) {
					if (typeof store.quests.get === 'function') freshQuest = store.quests.get(questId);
					else if (typeof store.quests === 'object') freshQuest = store.quests[questId];
				}
				if (!freshQuest && typeof store.getAll === 'function') {
					const all = store.getAll();
					freshQuest = Array.isArray(all) ? all.find(q => q?.id === questId) : (all || {})[questId];
				}
			}
			
			// Fallback to our cached available quests
			if (!freshQuest) freshQuest = quest;
			
			if (freshQuest && !freshQuest.userStatus?.completedAt) {
				const taskConfig = freshQuest?.config?.taskConfigV2 ?? freshQuest?.config?.taskConfig;
				const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE", "ACHIEVEMENT_IN_ACTIVITY"].find(x => taskConfig?.tasks?.[x] != null);
				const secondsNeeded = taskConfig?.tasks?.[taskName]?.target ?? 0;
				const currentProgress = freshQuest.userStatus?.progress?.[taskName]?.value ?? 0;
				const progressPercent = secondsNeeded > 0 ? (currentProgress / secondsNeeded) * 100 : 0;
				
				this.log('info', `Quest ${questName} progress: ${Math.round(progressPercent)}% (${currentProgress}/${secondsNeeded})`);
				
				// Don't try force-completion - Discord removed those API endpoints (404/400).
				// Just restart the quest farming and let heartbeats complete it naturally.
				
				// Restart the quest farming
				this.log('info', `Restarting quest: ${questName}`);
				const restartDelay = 1500 + (recoveryCount * 500);
				setTimeout(() => {
					this.farmQuest(freshQuest);
				}, restartDelay);
				
				if (this.settings.questNotifications) {
					UI.showToast(t('stuckRecoveredContent', { name: questName }), { type: 'success' });
				}
			} else {
				this.log('info', `Quest ${questName} completed or no longer available, skipping restart`);
				this._questRecoveryAttempts.delete(questId);
			}
			
		} catch (e) {
			this.log('error', `Failed to recover stuck quest ${questId}:`, e);
			const quest = this.availableQuests?.find(q => q.id === questId);
			const questName = quest?.config?.messages?.questName ?? `Quest ${questId}`;
			UI.showToast(t('stuckRecoveryFailed', { name: questName }), { type: 'error' });
		}
	}
	
	/**
	 * Get count of stuck quests (for status dashboard)
	 */
	getStuckCount() {
		return this._stuckQuests?.size ?? 0;
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
					title: t('newQuestTitle'),
					content: t('newQuestContent', { name: questName }),
					type: 'info',
					duration: 5 * 60 * 1000,
					actions: [
						{
							label: t('goToQuests'),
							onClick: () => {
								try {
									open(`/quests/${quest.id}`);
								} catch (e) {
									this.log('warn', 'Failed to open quest', e.message);
								}
							}
						},
						{
							label: t('remindMeLater'),
							onClick: () => {
								setTimeout(() => {
									this.showNewQuestNotification(quest);
								}, 60 * 60 * 1000);
							}
						}
					]
				});
			} else {
				UI.showToast(t('newQuestToast', { name: questName }), { type: 'info' });
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
			const apiInstance = Webpack.getModule?.(m => m?.Bo?.get)?.Bo ?? this.api ?? api;
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
					this.trackQuestError(quest.id, 'video_progress', e.status);
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

			// NOTE: Discord removed /quests/{id}/complete and /quests/{id}/claim endpoints (404/400).
			// Quest completion happens naturally via heartbeats. Don't call deprecated APIs
			// that generate errors and trigger false stuck detection.

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
			const FluxDispatcher = Webpack.getByKeys?.('dispatch', 'subscribe', 'register', {searchExports: true}) ?? this.FluxDispatcher;
			const api = Webpack.getModule?.(m => m?.Bo?.get)?.Bo ?? this.api;
			
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
			const taskConfig = quest?.config?.taskConfigV2 ?? quest?.config?.taskConfig;
			if (!taskConfig || !taskConfig.tasks) {
				this.log('error', "Invalid taskConfig for quest", { questId: quest?.id });
				this.farmingQuest.set(quest.id, false);
				return;
			}
			const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE", "ACHIEVEMENT_IN_ACTIVITY"].find(x => taskConfig.tasks[x] != null);
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
						// Fixed exe name extraction (Feb 2026) - use appData.name as fallback with sanitization
						const exeName = appData.executables?.find(x => x.os === "win32")?.name?.replace(">","") ??
							appData.name.replace(/[\/\\:*?"<>|]/g, "");
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
							this.fakeGames.set(quest.id, fakeGame);
							const allFakeGames = Array.from(this.fakeGames.values());
							// Dispatch like the gist: tell Discord the fake game is now running
							(this.FluxDispatcher ?? FluxDispatcher)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [], added: [fakeGame], games: allFakeGames });

							let playOnDesktop = (event) => {
								if (event.questId !== quest.id) return;
								let progress = quest.config.configVersion === 1 ? event.userStatus.streamProgressSeconds : Math.floor(event.userStatus.progress.PLAY_ON_DESKTOP.value);
								console.log(`Quest progress ${questName}: ${progress}/${secondsNeeded}`);
								this.trackQuestProgress(quest.id, progress); // Track for stuck detection

								if (progress >= secondsNeeded) {
									console.log("Quest completed!", questName);

									this.fakeGames.delete(quest.id);
									const remainingFakes = Array.from(this.fakeGames.values());
									(this.FluxDispatcher ?? FluxDispatcher)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: remainingFakes });
									(this.FluxDispatcher ?? FluxDispatcher)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);

									this.showQuestNotification(quest, true);
									this.farmingQuest.set(quest.id, false);
								} else if (!this.farmingQuest.get(quest.id)) {
									// Manually stopped
									console.log("Stopping farming quest (manual):", questName);
									this.fakeGames.delete(quest.id);
									const remainingFakes = Array.from(this.fakeGames.values());
									(this.FluxDispatcher ?? FluxDispatcher)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: remainingFakes });
									(this.FluxDispatcher ?? FluxDispatcher)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);
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
										if (!this.farmingQuest.get(quest.id)) {
											// Quest was stopped externally, clean up fallback
											if (fallbackInterval) { this._clearInterval(fallbackInterval); fallbackInterval = null; }
											return;
										}
										this.ensureStores();
										const qs = this.QuestsStore ?? getQuestsStore();
										let heartbeatSuccess = false;
										
										// Try heartbeat via API (like the gist does)
										if (this.api ?? api) {
											try {
												await (this.api ?? api).post({ url: `/quests/${quest.id}/heartbeat`, body: {} });
												heartbeatSuccess = true;
											} catch(e){
												this.trackQuestError(quest.id, 'heartbeat', e.status);
											}
										}
										if (heartbeatSuccess) this._questErrorTracker.delete(quest.id);

										// Get current progress from store
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
										this.trackQuestProgress(quest.id, current);

										// ONLY stop when quest is ACTUALLY complete (100%) - never stop early!
										// The gist waits for full completion, not 90%
										if (current >= secondsNeeded) {
											console.log('Quest completed via fallback!', quest.id);
											if (fallbackInterval) {
												this._clearInterval(fallbackInterval);
												fallbackInterval = null;
											}
											this.fakeGames.delete(quest.id);
											const remainingFakes = Array.from(this.fakeGames.values());
											(this.FluxDispatcher ?? FluxDispatcher)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: remainingFakes });
											(this.FluxDispatcher ?? FluxDispatcher)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", playOnDesktop);
											this.showQuestNotification(quest, true);
											this.farmingQuest.set(quest.id, false);
											return;
										}
										
										// Re-dispatch fake game periodically to keep Discord's heartbeat alive
										if (fallbackAttempts % 5 === 0 && this.fakeGames.has(quest.id)) {
											const allFakes = Array.from(this.fakeGames.values());
											(this.FluxDispatcher ?? FluxDispatcher)?.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [], added: [], games: allFakes });
										}
									} catch (e) { /* ignore */ }
								}, 20 * 1000));
							};

							startFallback();

							console.log(`Spoofed your game to ${applicationName}. Wait for ${Math.ceil((secondsNeeded - secondsDone) / 60)} more minutes.`);
					})
					break;

				case "STREAM_ON_DESKTOP":
					// Match gist's metadata format exactly
					const fakeApp = {
						id: applicationId,
						pid,
						sourceName: null,
					};
					this.fakeApplications.set(quest.id, fakeApp);

					let streamOnDesktop = (event) => {
						if (event.questId !== quest.id) return;
						let progress = quest.config.configVersion === 1 ? event.userStatus.streamProgressSeconds : Math.floor(event.userStatus.progress.STREAM_ON_DESKTOP.value);
						console.log(`Quest progress ${questName}: ${progress}/${secondsNeeded}`);
						this.trackQuestProgress(quest.id, progress); // Track for stuck detection

						if (progress >= secondsNeeded) {
							console.log("Quest completed!", questName);
							this.fakeApplications.delete(quest.id);
							(this.FluxDispatcher ?? FluxDispatcher)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", streamOnDesktop);
							this.showQuestNotification(quest, true);
							this.farmingQuest.set(quest.id, false);
						} else if (!this.farmingQuest.get(quest.id)) {
							// Manually stopped
							console.log("Stopping farming quest (manual):", questName);
							this.fakeApplications.delete(quest.id);
							(this.FluxDispatcher ?? FluxDispatcher)?.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", streamOnDesktop);
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
							try {
								const res = await (this.api ?? api)?.post({ url: `/quests/${quest.id}/heartbeat`, body: { stream_key: streamKey, terminal: false } });
								const progress = res.body.progress.PLAY_ACTIVITY.value;
								console.log(`Quest progress ${questName}: ${progress}/${secondsNeeded}`);
								this.trackQuestProgress(quest.id, progress); // Track for stuck detection

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
							} catch (e) {
								this.trackQuestError(quest.id, 'play_activity_heartbeat', e.status);
								this.log('warn', `PLAY_ACTIVITY heartbeat error for ${questName}:`, e.message);
								await new Promise(resolve => setTimeout(resolve, 20 * 1000));
								if (!this.farmingQuest.get(quest.id)) break;
							}
						}
					}
					playActivity();
					break;

				case "ACHIEVEMENT_IN_ACTIVITY":
					// Server-side quest that cannot be spoofed - warn user
					if (this._unsupportedQuests.has(applicationId)) {
						this.farmingQuest.set(quest.id, false);
						return;
					}
					this._unsupportedQuests.add(applicationId);
					
					UI.showConfirmationModal(
						t('unsupportedQuestTitle'),
						[
							t('unsupportedQuestContent', { name: questName, taskType: taskName }),
							t('unsupportedQuestNote')
						],
						{
							confirmText: t('goToQuest'),
							onConfirm: () => {
								try {
									open(`/quests/${quest.id}`);
								} catch (e) {
									this.log('warn', 'Failed to open quest page', e.message);
								}
							}
						}
					);
					this.farmingQuest.set(quest.id, false);
					break;

				default:
					console.error("Unknown task type:", taskName);
					this.farmingQuest.set(quest.id, false);
					break;
			}
		} catch (err) {
			console.error("FarmQuests: error inside farmQuest", err);
			if (quest?.id) this.farmingQuest.set(quest.id, false);
			try {
				UI.showConfirmationModal("Error", [
					"An error occurred while trying to complete the quest. Please reach out to developer with the following information:",
					`Quest Name: ${quest?.config?.application?.name ?? 'Unknown'}`,
					`Error: ${err.message}`,
					`Or click to send report to create an issue on github`
				], {
					confirmText: "Report Issue",
					onConfirm: () => {
						const issueTitle = encodeURIComponent(`Error while completing quest: ${quest?.config?.application?.name ?? 'Unknown'}`);
						const issueBody = encodeURIComponent(`**Quest Name:** ${quest?.config?.application?.name ?? 'Unknown'}\n**Error:** ${err.message}\n**Stack Trace:**\n\`\`\`${err.stack}\`\`\``);
						const issueUrl = `https://github.com/Sophan-Developer/FarmQuests/issues/new?title=${issueTitle}&body=${issueBody}`;
						open(issueUrl);
					}
				});
			} catch (modalErr) {
				this.log('warn', 'Failed to show error reporting modal', modalErr.message);
			}
		}
	}
}
