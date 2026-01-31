import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `foods/${fileName}`,
            Body: buffer,
            ContentType: file.type,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        const imageUrl = `${process.env.AWS_URL}foods/${fileName}`;

        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        console.error('S3 Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
