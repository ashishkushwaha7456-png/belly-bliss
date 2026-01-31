import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms of Service | Belly Bliss',
};

export default function TermsOfService() {
    return (
        <main>
            <Header />
            <div className="container section-padding legal-content" style={{ marginTop: '100px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last Updated: January 31, 2026</p>

                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing and using Belly Bliss, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>

                    <section>
                        <h2>2. Use License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials on Belly Bliss's website for personal, non-commercial transitory viewing only.</p>
                    </section>

                    <section>
                        <h2>3. Disclaimer</h2>
                        <p>The materials on Belly Bliss's website are provided on an 'as is' basis. Belly Bliss makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                        <p><strong>Medical Disclaimer:</strong> The information on this website is for informational purposes only and is not intended as medical advice. Always consult with a healthcare professional before making any dietary changes.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
