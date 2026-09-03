import { useMemo } from "react";
import { Link } from "react-router-dom";

const imageModules = import.meta.glob(
  "../assets/visual-library/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function getImages() {
  return Object.entries(imageModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src], index) => {
      const fileName = path.split("/").pop() || `visual-${index + 1}`;

      return {
        id: `${fileName}-${index}`,
        src,
        fileName,
        title: `AI Visual Guide ${String(index + 1).padStart(3, "0")}`,
      };
    });
}

export default function VisualLibrarySection() {
  const images = useMemo(() => getImages(), []);

  const previewImages = images.slice(0, 8);

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute left-[5%] top-10 h-72 w-72 rounded-full bg-cyan-500/[0.07] blur-[110px]" />

      <div className="pointer-events-none absolute right-[5%] bottom-0 h-80 w-80 rounded-full bg-violet-500/[0.08] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-9 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
              📚 Visual Knowledge
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              AI Visual Learning
              <span className="ml-3 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Library
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Explore AI cheat sheets, prompt engineering guides, AI tools,
              automation concepts, skills, learning notes and visual reference
              posters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Visual Resources
              </div>

              <div className="mt-1 text-2xl font-black text-white">
                {images.length}+
              </div>
            </div>

            <Link
              to="/visual-library"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-4 text-sm font-black text-white shadow-[0_15px_45px_rgba(6,182,212,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(124,58,237,0.22)]"
            >
              Explore Library

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* IMAGE GRID */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {previewImages.map((image, index) => (
            <Link
              to={`/visual-library?image=${index + 1}`}
              key={image.id}
              className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#080c18] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_25px_70px_rgba(6,182,212,0.12)] sm:p-3"
            >
              {/* IMAGE */}

              <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-gradient-to-b from-[#151b2e] to-[#090d17]">
                <img
                  src={image.src}
                  alt={image.title}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.035]"
                  style={{
                    imageRendering: "auto",
                    filter: "contrast(1.025) saturate(1.025)",
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/[0.02]" />

                {/* NUMBER */}

                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur-md">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* VIEW */}

                <div className="absolute bottom-3 right-3 translate-y-2 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-[10px] font-black text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  🔍 View
                </div>
              </div>

              {/* CARD FOOTER */}

              <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-white sm:text-sm">
                    {image.title}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Visual Learning
                  </p>
                </div>

                <span className="shrink-0 text-cyan-300 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* BOTTOM CTA */}

        <div className="mt-8 text-center">
          <Link
            to="/visual-library"
            className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-7 py-4 text-sm font-black text-white transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-400/[0.07]"
          >
            📚 View All {images.length} Visual Guides
            <span className="text-violet-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}