const { GROQ_API_KEY: groqApiKey } = process.env;

if (!groqApiKey) {
  throw new Error("GROQ_API_KEY is not defined in the environment variables.");
}

export const EnvConfig = () => ({
  groqApiKey,
});
