import { Gallery } from "@/components/gallery";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="header-row">
          <h1 className="wordmark">ARTWORKS</h1>
        </div>
      </header>
      <main className="gallery-section">
        <Gallery />
      </main>
    </>
  );
}
