import { NextResponse } from 'next/server';
import { getMessages, saveMessages } from '@/data/dbHelper';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const messages = getMessages();
        const newMessage = {
            id: Date.now().toString(),
            name,
            email,
            message,
            status: 'pending', // pending, replied
            createdAt: new Date().toISOString()
        };

        messages.push(newMessage);
        saveMessages(messages);

        // Notify Admin via Email
        try {
            await resend.emails.send({
                from: 'Belly Bliss <onboarding@resend.dev>',
                to: 'ashishkushwaha7456@gmail.com',
                subject: `New Inquiry from ${name} - Belly Bliss`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #primary;">New Inquiry from ${name}</h2>
                        <p><strong>From:</strong> ${name} (${email})</p>
                        <div style="background: #f4f7f6; padding: 15px; border-radius: 10px;">
                            <strong>Message:</strong><br/>
                            <p>${message}</p>
                        </div>
                        <p style="margin-top: 20px;">
                            <a href="http://localhost:3000/admin" style="background: #2c3e50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Login to Admin Dashboard</a>
                        </p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error('Admin notification email failed:', emailError);
        }

        return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
