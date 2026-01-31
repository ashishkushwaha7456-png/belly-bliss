import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPages } from '@/data/dbHelper';

export const metadata = {
  title: 'About Us | Belly Bliss',
  description: 'Learn about the mission and team behind Belly Bliss.',
};

export default function AboutPage() {
  const pages = getPages();
  const pageData = pages.about || { title: 'About Us', subtitle: '', content: '<p>Content not found.</p>' };

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
        <div className="content-wrap" dangerouslySetInnerHTML={{ __html: pageData.content }} />
      </section>
      <Footer />
    </main>
  );
}
