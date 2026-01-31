import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPages } from '@/data/dbHelper';

export const metadata = {
    title: 'Terms of Service | Belly Bliss',
    description: 'Terms and Conditions for using Belly Bliss.',
};

export default function TermsPage() {
    const pages = getPages();
    const pageData = pages.terms || { title: 'Terms of Service', subtitle: '', content: '<p>Content not found.</p>' };

    return (
        <main>
            <Header />
            <div className="page-header">
                <div className="container">
                    <h1>{pageData.title}</h1>
                    <p>{pageData.subtitle}</p>
                </div>
            </div>

            <section className="container section-padding">
                <div className="content-wrap legal-content" dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </section>
            <Footer />
        </main>
    );
}
