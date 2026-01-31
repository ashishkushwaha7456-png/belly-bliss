import { NextResponse } from 'next/server';
import { getSubscribers, saveSubscribers } from '@/data/dbHelper';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const subscribers = getSubscribers();

        // Check if already subscribed
        if (subscribers.some(s => s.email === email)) {
            return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
        }

        const newSubscriber = {
            id: Date.now().toString(),
            email,
            joinedAt: new Date().toISOString()
        };

        subscribers.push(newSubscriber);
        saveSubscribers(subscribers);

        // Notify Admin via Email
        try {
            await resend.emails.send({
                from: 'Belly Bliss <onboarding@resend.dev>',
                to: 'ashishkushwaha7456@gmail.com',
                subject: 'New Newsletter Subscriber',
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #2c3e50;">New Subscriber Alert!</h2>
                        <p>A new user has joined the Belly Bliss wellness community.</p>
                        <div style="background: #f4f7f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                            <strong>Subscriber Email:</strong><br/>
                            <p>${email}</p>
                        </div>
                        <p>Total Subscribers: ${subscribers.length}</p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error('Admin notification failed:', emailError);
        }

        return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
