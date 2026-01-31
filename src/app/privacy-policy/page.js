import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Privacy Policy | Belly Bliss',
};

export default function PrivacyPolicy() {
    return (
        <main>
            <Header />
            <div className="container section-padding legal-content" style={{ marginTop: '100px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last Updated: January 31, 2026</p>

                    <section>
                        <h2>1. Introduction</h2>
                        <p>Welcome to Belly Bliss. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                    </section>

                    <section>
                        <h2>2. The Data We Collect</h2>
                        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                        <ul>
                            <li><strong>Identity Data:</strong> includes first name, last name.</li>
                            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Cookies</h2>
                        <p>We use cookies to enhance your experience. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.</p>
                    </section>

                    <section>
                        <h2>4. Google AdSense</h2>
                        <p>We use Google AdSense to serve ads on our website. Google uses cookies to serve ads based on a user's prior visits to your website or other websites.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
