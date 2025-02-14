const encoder = new TextEncoder();
const saltSize = 16;
const iterations = 100000;
const keyLength = 32; // 256 bits

// Generate a salt
const generateSalt = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(saltSize));
};

// Hash function using PBKDF2
export const hash = async (plainPassword: string): Promise<string> => {
  const salt = generateSalt();
  const passwordData = encoder.encode(plainPassword);

  const key = await crypto.subtle.importKey(
    "raw",
    passwordData,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: iterations,
      hash: "SHA-256",
    },
    key,
    keyLength * 8
  );

  const hashedPassword = Buffer.from(hashBuffer).toString("hex");
  const saltHex = Buffer.from(salt).toString("hex");

  return `${saltHex}:${hashedPassword}`;
};

// Compare function
export const compare = async (
  plainPassword: string,
  storedPassword: string
): Promise<boolean> => {
  const [saltHex, storedHash] = storedPassword.split(":");

  if (!saltHex || !storedHash) {
    throw new Error("Invalid stored password format");
  }

  const salt = new Uint8Array(Buffer.from(saltHex, "hex"));
  const passwordData = encoder.encode(plainPassword);

  const key = await crypto.subtle.importKey(
    "raw",
    passwordData,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: iterations,
      hash: "SHA-256",
    },
    key,
    keyLength * 8
  );

  const hashedPassword = Buffer.from(hashBuffer).toString("hex");

  return hashedPassword === storedHash;
};
