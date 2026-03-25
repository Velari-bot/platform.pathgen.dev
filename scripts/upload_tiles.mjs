import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import 'dotenv/config';

// R2 Credentials from environment
const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "pathgen-replays";
const TILES_DIR = "/Users/aidenbender/Desktop/iinfinite zoom map/replayscope-app/public/tiles";

async function uploadFile(filePath, key) {
    const fileContent = fs.readFileSync(filePath);
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: "image/png",
    });

    try {
        await r2Client.send(command);
        console.log(`Uploaded: ${key}`);
    } catch (err) {
        console.error(`Failed to upload ${key}:`, err.message);
    }
}

async function walkDir(dir, baseDir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await walkDir(fullPath, baseDir);
        } else if (file.endsWith(".png")) {
            const relativePath = path.relative(baseDir, fullPath);
            // Target format: tiles/ch7s2/{z}/{x}/{y}.png
            const key = `tiles/ch7s2/${relativePath}`;
            await uploadFile(fullPath, key);
        }
    }
}

async function main() {
    console.log("Starting tile upload to R2...");
    await walkDir(TILES_DIR, TILES_DIR);
    console.log("Upload complete.");
}

main().catch(console.error);
