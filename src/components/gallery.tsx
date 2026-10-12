"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { artworks, galleryItems, type Artwork, type HeadingPanel } from "@/data/gallery";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function ArtworkCard({
  artwork,
  onOpen,
  eager,
}: {
  artwork: Artwork;
  onOpen: (trigger: HTMLButtonElement) => void;
  eager: boolean;
}) {
  return (
    <article className="artwork-card">
      <button
        className="artwork-button"
        type="button"
        onClick={(event) => onOpen(event.currentTarget)}
        aria-label={`${artwork.title}の詳細を見る`}
      >
        <span className="artwork-frame">
          <Image
            src={`${basePath}${artwork.image}`}
            alt={artwork.title}
            width={artwork.width}
            height={artwork.height}
            sizes="(min-width: 1600px) 19vw, (min-width: 1100px) 23vw, (min-width: 768px) 31vw, 46vw"
            loading={eager ? "eager" : "lazy"}
            className="artwork-image"
          />
        </span>
      </button>
    </article>
  );
}

function HeadingCard({ panel }: { panel: HeadingPanel }) {
  const style = {
    backgroundColor: panel.backgroundColor,
    color: panel.textColor,
    "--panel-aspect": String(panel.aspectRatio),
  } as CSSProperties;

  return (
    <div className="heading-panel" style={style}>
      <span className="heading-panel-subtitle">{panel.subtitle}</span>
      <div>
        <h2 id={panel.id}>{panel.title}</h2>
        {panel.description && <p>{panel.description}</p>}
      </div>
    </div>
  );
}

type GalleryGroup = { id: string; heading: HeadingPanel | null; items: Artwork[] };

const galleryGroups = galleryItems.reduce<GalleryGroup[]>((groups, item) => {
  if (item.type === "heading") {
    groups.push({ id: item.id, heading: item, items: [] });
  } else {
    if (groups.length === 0) groups.push({ id: "ungrouped", heading: null, items: [] });
    groups[groups.length - 1].items.push(item);
  }
  return groups;
}, []);

function Lightbox({
  artwork,
  closing,
  onClose,
  onNavigate,
}: {
  artwork: Artwork;
  closing: boolean;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onNavigate(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate(1);
      } else if (event.key === "Tab") {
        const controls = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])") ?? [],
        );
        if (controls.length === 0) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate]);

  return (
    <div
      className={`lightbox-backdrop${closing ? " is-closing" : ""}`}
      onPointerDown={onClose}
      role="presentation"
    >
      <div
        className="lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${artwork.title}の拡大画像`}
        ref={dialogRef}
      >
        <button className="lightbox-close icon-button" type="button" ref={closeRef} onPointerDown={(event) => event.stopPropagation()} onClick={onClose} aria-label="閉じる" title="閉じる">
          <X size={23} strokeWidth={1.6} aria-hidden="true" />
        </button>
        <div className="lightbox-image-wrap">
          <Image
            key={artwork.id}
            src={`${basePath}${artwork.image}`}
            alt={artwork.title}
            width={artwork.width}
            height={artwork.height}
            sizes="(max-width: 800px) 90vw, 65vw"
            className="lightbox-image"
            onPointerDown={(event) => event.stopPropagation()}
            priority
          />
        </div>
        <button className="lightbox-prev icon-button" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => onNavigate(-1)} aria-label="前の作品" title="前の作品">
          <ArrowLeft size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button className="lightbox-next icon-button" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => onNavigate(1)} aria-label="次の作品" title="次の作品">
          <ArrowRight size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setIsClosing(true);
  }, []);

  useEffect(() => {
    if (!isClosing) return;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280;
    const timeout = window.setTimeout(() => {
      setActiveIndex(null);
      setIsClosing(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    }, duration);
    return () => window.clearTimeout(timeout);
  }, [isClosing]);

  const navigate = useCallback((direction: -1 | 1) => {
    if (!isClosing) {
      setActiveIndex((index) => index === null ? null : (index + direction + artworks.length) % artworks.length);
    }
  }, [isClosing]);

  return (
    <>
      <div className="gallery-groups">
        {galleryGroups.map((group) => (
          <section className="gallery-group" key={group.id} aria-labelledby={group.heading?.id} aria-label={group.heading ? undefined : "作品"}>
            {group.heading && <HeadingCard panel={group.heading} />}
            <div className="group-artworks">
              {group.items.map((item) => (
                <ArtworkCard
                  key={item.id}
                  artwork={item}
                  eager={artworks.indexOf(item) < 2}
                  onOpen={(trigger) => {
                    triggerRef.current = trigger;
                    setIsClosing(false);
                    setActiveIndex(artworks.indexOf(item));
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      {activeIndex !== null && createPortal(
        <Lightbox
          artwork={artworks[activeIndex]}
          closing={isClosing}
          onClose={close}
          onNavigate={navigate}
        />,
        document.body,
      )}
    </>
  );
}
