import crypto from "crypto";

// if (!process.env.ENCRYPTION_KEY) {
//   console.error("CRITICAL ERROR: ENCRYPTION_KEY environment variable is not set!");
//   console.error("User API credentials cannot be encrypted/decrypted without a stable key.");
//   console.error("Please set ENCRYPTION_KEY to a 64-character hex string.");
//   console.error("Generate one with: node -e \"console.log(crypto.randomBytes(32).toString('hex'))\"");
//   process.exit(1);
// }



const ENCRYPTION_KEY =
	process.env.ENCRYPTION_KEY ||
	"97b2146afff776c82d7c4972a60609a0b6ba6c175b36e431bbbf7dfb7f722c9f";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function encryptApiKey(text: string): string {
	const iv = crypto.randomBytes(IV_LENGTH);
	const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), "hex");

	const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

	let encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");

	const authTag = cipher.getAuthTag();

	// Return: iv:authTag:encrypted
	return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decryptApiKey(encrypted: string): string {
	const parts = encrypted.split(":");
	if (parts.length !== 3) {
		throw new Error("Invalid encrypted format");
	}

	const iv = Buffer.from(parts[0], "hex");
	const authTag = Buffer.from(parts[1], "hex");
	const encryptedText = parts[2];

	const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), "hex");

	const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(authTag);

	let decrypted = decipher.update(encryptedText, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
}
