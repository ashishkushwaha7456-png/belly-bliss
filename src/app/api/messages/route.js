import { NextResponse } from 'next/server';
import { getMessages, saveMessages } from '@/data/dbHelper';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const messages = getMessages();
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, status, reply } = await request.json();
        const messages = getMessages();
        const index = messages.findIndex(m => m.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        const userMessage = messages[index];

        // Send Email via Resend if there is a reply
        if (reply) {
            try {
                await resend.emails.send({
                    from: 'Belly Bliss <onboarding@resend.dev>', // You should verify your domain on Resend
                    to: userMessage.email,
                    subject: 'Reply from Belly Bliss Support',
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #2c3e50;">Hello ${userMessage.name},</h2>
                            <p>Thank you for contacting Belly Bliss. Here is the response to your inquiry:</p>
                            <div style="background: #f4f7f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                                <strong>Your message:</strong><br/>
                                <em>"${userMessage.message}"</em>
                            </div>
                            <div style="background: #e6fffa; padding: 15px; border-radius: 10px; border-left: 4px solid #38b2ac;">
                                <strong>Our Reply:</strong><br/>
                                <p>${reply}</p>
                            </div>
                            <p style="margin-top: 30px;">Stay healthy,<br/><strong>Ashish Kumar</strong> from Belly Bliss</p>
                        </div>
                    `,
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
        }

        messages[index] = {
            ...messages[index],
            status: status || messages[index].status,
            reply: reply || messages[index].reply,
            repliedAt: reply ? new Date().toISOString() : messages[index].repliedAt
        };

        saveMessages(messages);

        return NextResponse.json(messages[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const messages = getMessages();
        const filteredMessages = messages.filter(m => m.id !== id);
        saveMessages(filteredMessages);

        return NextResponse.json({ message: 'Message deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
