import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    async handleLargeFileUpload(
        files: Express.Multer.File[],
        body: {
            name: string;
            totalChunk: number;
        },
    ): Promise<{ link: string; fileName: string }> {
        if (!files?.length) {
            throw new BadRequestException('No files uploaded');
        }

        // Get file name without chunk number
        const fileName = body.name.match(/(.+)-\d+$/)?.[1] ?? body.name;
        const chunksDir = path.join(process.cwd(), 'uploads', `chunks-${fileName}`);
        const finalFilePath = path.join(process.cwd(), 'uploads', fileName);

        try {
            // Create chunks directory if it doesn't exist
            if (!fs.existsSync(chunksDir)) {
                fs.mkdirSync(chunksDir, { recursive: true });
            }

            // Save chunk file
            const chunkPath = path.join(chunksDir, body.name);
            fs.copyFileSync(files[0].path, chunkPath);
            fs.unlinkSync(files[0].path); // Clean up temp file

            const filesInDir = fs.readdirSync(chunksDir);

            // If all chunks are uploaded, merge them
            if (filesInDir.length === body.totalChunk) {
                await this.mergeChunks(chunksDir, filesInDir, finalFilePath);
            }

            return {
                link: `http://localhost:8000/upload/${fileName}`,
                fileName,
            };
        } catch (error) {
            // Clean up on error
            if (fs.existsSync(chunksDir)) {
                fs.rmSync(chunksDir, { recursive: true, force: true });
            }
            throw new BadRequestException(`Failed to process file: ${error.message}`);
        }
    }

    private async mergeChunks(
        chunksDir: string,
        filesInDir: string[],
        finalFilePath: string,
    ): Promise<void> {
        const sortedChunks = filesInDir.sort((a, b) => {
            const aIndex = parseInt(a.split('-').pop() || '0');
            const bIndex = parseInt(b.split('-').pop() || '0');
            return aIndex - bIndex;
        });

        // Create write stream for final file
        const writeStream = fs.createWriteStream(finalFilePath);

        for (const chunk of sortedChunks) {
            const chunkFilePath = path.join(chunksDir, chunk);
            const chunkBuffer = fs.readFileSync(chunkFilePath);
            writeStream.write(chunkBuffer);
        }

        writeStream.end();

        // Clean up chunks after successful merge
        await new Promise<void>((resolve) => {
            writeStream.on('finish', () => {
                fs.rm(chunksDir, { recursive: true }, () => resolve());
            });
        });
    }
}
