import { EmojiStore, SelectedGuildStore } from "@moonlight-mod/wp/common_stores";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const logger = moonlight.getLogger("freeMoji/entrypoint");
logger.info('Hello from freeMoji/entrypoint!');

interface Message {
    content: string;
    // TODO: Get the proper type for this
    invalidEmojis: any[];
}

// Settings - customize these to change how emojis are formatted
const SETTINGS = {
    // Link text options:
    // - "{{NAME}}" -> Uses the emoji name (e.g., [sadge](url))
    // - "{{.}}" -> Uses a dot like Vencord (e.g., [.](url)) 
    // - "emoji" -> Uses custom text (e.g., [emoji](url))
    // - "" -> Empty text (e.g., [](url))
    linkText: "{{NAME}}",
    
    // Set to false to use plain URLs instead of hyperlinks
    useHyperlinks: true
};

const COOL = "Queueing message to be sent";
const module = spacepack.findByCode(COOL)[0].exports;

const originalSend = module.Z.sendMessage;
module.Z.sendMessage = async (...args: any[]) => {
	modifyIfNeeded(args[1]);
	return originalSend.call(module.Z, ...args);
};

// https://github.com/luimu64/nitro-spoof/blob/1bb75a2471c39669d590bfbabeb7b922672929f5/index.js#L25
const hasEmotesRegex = /<a?:(\w+):(\d+)>/i;

function extractUnusableEmojis(messageString: string, size: number) {
	const emojiStrings = messageString.matchAll(/<a?:(\w+):(\d+)>/gi);
	const emojiUrls = [];

	for (const emojiString of emojiStrings) {
		// Fetch required info about the emoji
		const emoji = EmojiStore.getCustomEmojiById(emojiString[2]);
		const emojiName = emojiString[1]; // Get emoji name from the match

		// Check emoji usability
		if (
			emoji.guildId !== SelectedGuildStore.getGuildId() ||
			emoji.animated
		) {
			// Remove emote from original msg
			messageString = messageString.replace(emojiString[0], "");
			
			// Generate emoji URL
			const emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.webp?size=48${emoji.animated ? '&animated=true' : ''}`;
			
			// Format based on settings
			if (SETTINGS.useHyperlinks) {
				// Replace placeholders in link text
				let linkText = SETTINGS.linkText
					.replace(/\{\{NAME\}\}/g, emojiName)
					.replace(/\{\{\.\}\}/g, ".");
				
				emojiUrls.push(`[${linkText}](${emojiUrl})`);
			} else {
				emojiUrls.push(emojiUrl);
			}
		}
	}

	return { 
        newContent: messageString.trim(),
        extractedEmojis: emojiUrls,
    };
}

export default function modifyIfNeeded(msg: Message) {
	if (!msg.content.match(hasEmotesRegex)) return;

	// Find all emojis from the captured message string and return object with emojiURLS and content
	const { newContent, extractedEmojis } = extractUnusableEmojis(msg.content, 48);

	msg.content = newContent;

	if (extractedEmojis.length > 0) msg.content += `\n${extractedEmojis.join("\n")}`;

	// Set invalidEmojis to empty to prevent Discord yelling to you about you not having nitro
	msg.invalidEmojis = [];
};