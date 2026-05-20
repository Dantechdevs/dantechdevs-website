import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Pricing from './components/Pricing';
import { About, Contact, Footer } from './components/Sections';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
