import { NextResponse } from 'next/server';
import { getSubscribers } from '@/data/dbHelper';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const auth = request.headers.get('Authorization');
        if (auth !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { pdfUrl, recipients } = await request.json();
        if (!pdfUrl) {
            return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });
        }

        let subscribers = getSubscribers();
        if (subscribers.length === 0) {
            return NextResponse.json({ message: 'No subscribers to send to' }, { status: 200 });
        }

        // Filter by recipients if provided
        if (recipients && Array.isArray(recipients) && recipients.length > 0) {
            subscribers = subscribers.filter(s => recipients.includes(s.id));
        }

        if (subscribers.length === 0) {
            return NextResponse.json({ message: 'No matching subscribers found' }, { status: 400 });
        }

        // In a real production app, you would use a queue like Redis/BullMQ to handle this
        // For now, we will map through them (fine for small subscriber counts)
        // or send one batch email if Resend supports multiple BCC (it does, up to 50 usually)

        // Sending individually to personalize/ensure delivery for now
        const emailPromises = subscribers.map(sub =>
            resend.emails.send({
                from: 'Belly Bliss <onboarding@resend.dev>',
                to: sub.email,
                subject: '🥗 Your Weekly Diet Plan is Here! - Belly Bliss',
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #27ae60;">Belly Bliss</h1>
                            <p style="color: #666;">Your weekly guide to superfood nutrition</p>
                        </div>
                        
                        <div style="background: white; border: 1px solid #eee; padding: 30px; border-radius: 20px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <h2 style="color: #2c3e50; margin-top: 0;">Weekly Diet Chart</h2>
                            <p style="margin-bottom: 25px; line-height: 1.6; color: #555;">
                                Hello! Here is your curated diet plan for the upcoming week. 
                                We've included some amazing superfoods to boost your energy and immunity.
                            </p>
                            
                            <a href="${pdfUrl}" style="background: #27ae60; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
                                📥 Download PDF Weekly Plan
                            </a>
                            
                            <p style="margin-top: 25px; font-size: 0.9rem; color: #888;">
                                (Or click this link: <a href="${pdfUrl}" style="color: #27ae60;">${pdfUrl}</a>)
                            </p>
                        </div>

                        <div style="text-align: center; margin-top: 30px; font-size: 0.8rem; color: #aaa;">
                            <p>You received this email because you subscribed to Belly Bliss.</p>
                            <p>© ${new Date().getFullYear()} Belly Bliss. All rights reserved.</p>
                        </div>
                    </div>
                `
            })
        );

        await Promise.all(emailPromises);

        // Also notify admin
        await resend.emails.send({
            from: 'Belly Bliss System <onboarding@resend.dev>',
            to: 'ashishkushwaha7456@gmail.com',
            subject: 'System: Weekly Plan Sent Successfully',
            html: `<p>Weekly plan sent to <strong>${subscribers.length}</strong> subscribers.</p><p>PDF Link: ${pdfUrl}</p>`
        });

        return NextResponse.json({ message: `Sent to ${subscribers.length} subscribers` });
    } catch (error) {
        console.error('Newsletter send error:', error);
        return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
    }
}
