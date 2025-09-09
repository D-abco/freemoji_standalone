#  Moonlight freeMoji

A Moonlight extension that allows you to send custom emojis without Discord Nitro by converting them to hyperlinks.

##  Features

- **Send any custom emoji** without needing Discord Nitro
- **Customizable link text** - choose what users without the plugin see  
- **Vencord-style formatting** - clean hyperlinks instead of raw URLs
- **Easy configuration** - modify settings directly in the code

##  Quick Installation

1. Install [Moonlight](https://moonlight-mod.github.io/) Discord client mod
2. Download this repository (Code  Download ZIP)
3. Copy the src/freeMoji folder to your Moonlight extensions directory:
   - **Windows:** %APPDATA%/moonlight-mod/extensions/
   - **macOS:** ~/Library/Application Support/moonlight-mod/extensions/
   - **Linux:** ~/.config/moonlight-mod/extensions/
4. Restart Discord and enable the extension in Moonlight settings

##  Configuration

Edit the SETTINGS object in src/freeMoji/webpackModules/entrypoint.ts:

```typescript
const SETTINGS = {
    // Link text options:
    // - "{{NAME}}" -> Uses emoji name: [sadge](url)
    // - "{{.}}" -> Vencord-style dot: [.](url) 
    // - "emoji" -> Custom text: [emoji](url)
    // - "" -> Empty: [](url)
    linkText: "{{.}}",
    
    useHyperlinks: true  // false = plain URLs
};
```

###  Popular Configurations

| Style | Setting | Result |
|-------|---------|---------|
| **Vencord-style** | "{{.}}" | [.](emoji-url) |
| **Emoji names** | "{{NAME}}" | [sadge](emoji-url) |
| **Hidden** | "" | [](emoji-url) |
| **Custom** | "emoji" | [emoji](emoji-url) |

##  How it Works

When you try to send a custom emoji you don't have access to:

| Your view | Others see (without plugin) |
|-----------|----------------------------|
|  Normal emoji | [.](https://cdn.discordapp.com/emojis/123.webp) |

**Example:**
`
You type: "Hello :customEmoji:"
Gets sent as: "Hello [.](https://cdn.discordapp.com/emojis/123.webp)"
`

Users with the plugin see emojis normally. Users without see clickable links to the emoji image.

##  Development

Built with Moonlight's extension system:
- **Webpack module insertion** for core logic
- **Patches** to bypass emoji restrictions  
- **Spacepack** to hook Discord's message system

##  Credits

- Based on [Vendetta extension by @maisymoe](https://github.com/vendetta-mod/VendettaPlugins)
- Inspired by [Vencord's fakeNitro](https://github.com/Vendicated/Vencord/tree/main/src/plugins/fakeNitro)
- Built for [Moonlight](https://moonlight-mod.github.io/)

##  License

MIT License - feel free to modify and redistribute!

---

**Having issues?** Open an issue on this repository or check the [Moonlight Discord](https://discord.gg/FdZBTFCP6F) for help.