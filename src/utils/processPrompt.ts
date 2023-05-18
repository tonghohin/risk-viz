import { ComprehendClient, DetectEntitiesCommand } from "@aws-sdk/client-comprehend";

export default async function processPrompt(prompt: string) {
    try {
        const client = new ComprehendClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
            }
        });
        const command = new DetectEntitiesCommand({ LanguageCode: "en", Text: prompt });

        const data = await client.send(command);
        return data;
    } catch (error) {
        console.error(error);
    }
}
