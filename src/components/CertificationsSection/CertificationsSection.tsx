import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const API = import.meta.env.VITE_API_URL;
const getCertificateImageUrl = (image: string) => {
  if (image.startsWith("/uploads/")) {
   const API_ORIGIN = API.replace(/\/api\/?$/, "");

return `${API_ORIGIN}${image}`;
  }

  return image;
};

type Certification = {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  verificationLink?: string;
  order: number;
};

export const CertificationsSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const direction = useRef(1);
  const pauseUntil = useRef(0);

  const [sliderValue, setSliderValue] = useState(0);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  /*
   * LOAD CERTIFICATIONS
   */

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const response = await fetch(`${API}/certifications`);

        if (!response.ok) {
          throw new Error("Failed to fetch certifications");
        }

        const data = await response.json();

        setCertifications(
          data.sort(
            (a: Certification, b: Certification) =>
              (a.order ?? 0) - (b.order ?? 0)
          )
        );
      } catch (error) {
        console.error(
          "Failed to load certifications:",
          error
        );
      }
    };

    loadCertifications();
  }, []);

  /*
 * AUTO SCROLL
 */

useEffect(() => {
  let timer: number | undefined;

  const startAutoScroll = () => {
    const track = trackRef.current;

    if (!track) {
      timer = window.setTimeout(startAutoScroll, 300);
      return;
    }

    const maxScroll =
      track.scrollWidth - track.clientWidth;

    if (maxScroll <= 0) {
      timer = window.setTimeout(startAutoScroll, 300);
      return;
    }

    timer = window.setInterval(() => {
      const currentTrack = trackRef.current;

      if (!currentTrack) return;
      if (isDragging.current) return;

      if (Date.now() < pauseUntil.current) return;

      const max =
        currentTrack.scrollWidth -
        currentTrack.clientWidth;

      if (max <= 0) return;

      let next =
        currentTrack.scrollLeft +
        direction.current * 1.5;

      if (next >= max) {
        next = max;
        direction.current = -1;
      }

      if (next <= 0) {
        next = 0;
        direction.current = 1;
      }

      currentTrack.scrollLeft = next;

      setSliderValue(
        Math.min(
          100,
          Math.max(0, (next / max) * 100)
        )
      );
    }, 30);
  };

  startAutoScroll();

  return () => {
    if (timer !== undefined) {
      window.clearInterval(timer);
      window.clearTimeout(timer);
    }
  };
}, []);
  /*
   * UPDATE SLIDER
   */

  const updateSlider = () => {
    const track = trackRef.current;

    if (!track) return;

    const maxScroll =
      track.scrollWidth - track.clientWidth;

    if (maxScroll <= 0) {
      setSliderValue(0);
      return;
    }

    setSliderValue(
      Math.min(
        100,
        Math.max(
          0,
          (track.scrollLeft / maxScroll) * 100
        )
      )
    );
  };

  /*
   * PAUSE AFTER MANUAL INTERACTION
   */

  const pauseAutoScroll = () => {
    pauseUntil.current = Date.now() + 1500;
  };

  /*
   * DRAG START
   */

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const track = trackRef.current;

    if (!track) return;

    isDragging.current = true;

    startX.current = event.clientX;
    startScrollLeft.current = track.scrollLeft;

    pauseAutoScroll();

    track.setPointerCapture(event.pointerId);
  };

  /*
   * DRAGGING
   */

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const track = trackRef.current;

    if (!track || !isDragging.current) return;

    const distance =
      event.clientX - startX.current;

    track.scrollLeft =
      startScrollLeft.current - distance;

    updateSlider();
  };

  /*
   * DRAG END
   */

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const track = trackRef.current;

    isDragging.current = false;

    pauseAutoScroll();

    if (
      track?.hasPointerCapture(event.pointerId)
    ) {
      track.releasePointerCapture(event.pointerId);
    }
  };

  /*
   * SLIDER
   */

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const track = trackRef.current;

    if (!track) return;

    const value = Number(event.target.value);

    const maxScroll =
      track.scrollWidth - track.clientWidth;

    track.scrollLeft =
      (value / 100) * maxScroll;

    setSliderValue(value);

    pauseAutoScroll();

    if (value >= 99) {
      direction.current = -1;
    }

    if (value <= 1) {
      direction.current = 1;
    }
  };

  return (
    <section
      id="certifications"
      className="
        w-full
        max-w-7xl
        mx-auto
        px-6
        py-24
        overflow-hidden
      "
    >
      {/* Heading */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.8,
        }}
        className="mb-12 md:mb-16"
      >
        <h2
          className="
            text-3xl
            md:text-5xl
            font-bold
            tracking-tight
            mb-4
            text-center
            md:text-left
          "
        >
          Certifications{" "}
          <span className="text-gradient-primary">
            &amp; Learning
          </span>
        </h2>

        <p
          className="
            text-muted-foreground
            text-center
            md:text-left
            max-w-2xl
            text-lg
          "
        >
          A collection of certifications, training, and
          learning milestones earned along my journey in
          technology.
        </p>
      </motion.div>

      {/* Gallery */}

      <div className="relative">
        <div
          ref={trackRef}
          className="
            flex
            gap-6
            overflow-x-auto
            overflow-y-hidden
            cursor-grab
            active:cursor-grabbing
            select-none
            touch-pan-x
            pb-4
          "
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onScroll={updateSlider}
        >
          {certifications.map((certificate) => (
            <motion.article
              key={certificate._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              whileHover={{
                y: -8,
                scale: 1.015,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="
                group
                shrink-0
                w-[300px]
                sm:w-[330px]
                md:w-[350px]
                rounded-[2rem]
                overflow-hidden
                border
                border-foreground/10
                bg-white
                dark:bg-white/[0.035]
                backdrop-blur-xl
                shadow-[0_10px_35px_rgba(0,0,0,0.08)]
                dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)]
                hover:border-primary/50
                hover:bg-white
                dark:hover:bg-white/[0.07]
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.14)]
                dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                transition-all
                duration-500
              "
            >
              {/* Certificate Image */}

              <a
                href={getCertificateImageUrl(certificate.image)}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="
                  relative
                  block
                  w-full
                  aspect-[4/3]
                  bg-muted/40
                  dark:bg-white/[0.025]
                  border-b
                  border-foreground/10
                  overflow-hidden
                "
              >
                <img
                  src={getCertificateImageUrl(certificate.image)}
                  alt={certificate.title}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="
                    w-full
                    h-full
                    object-contain
                    p-2
                    transition-transform
                    duration-700
                    group-hover:scale-[1.025]
                  "
                />

                {/* External link */}

                <div
                  className="
                    absolute
                    top-4
                    right-4
                    w-10
                    h-10
                    rounded-full
                    bg-black/50
                    backdrop-blur-md
                    border
                    border-white/20
                    flex
                    items-center
                    justify-center
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-300
                    group-hover:scale-110
                  "
                >
                  <ExternalLink
                    className="
                      w-4
                      h-4
                      text-white
                    "
                  />
                </div>
              </a>

              {/* Details */}

              <div className="p-6">
                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    text-primary
                    font-semibold
                    mb-2
                  "
                >
                  {certificate.issuer}
                </p>

                <h3
                  className="
                    text-xl
                    md:text-2xl
                    font-bold
                    tracking-tight
                    leading-tight
                    mb-2
                  "
                >
                  {certificate.title}
                </h3>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                    mb-3
                  "
                >
                  {certificate.date}
                </p>

                <p
                  className="
                    text-sm
                    leading-relaxed
                    text-muted-foreground
                    line-clamp-3
                  "
                >
                  {certificate.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Functional Slider */}

        <div className="mt-5 px-2">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={sliderValue}
            onChange={handleSliderChange}
            aria-label="Slide through certifications"
            className="
              certification-slider
              w-full
              h-1.5
              appearance-none
              rounded-full
              bg-foreground/10
              cursor-pointer
              outline-none
            "
          />
        </div>
      </div>

      <p
        className="
          mt-5
          text-center
          text-xs
          text-muted-foreground/60
          tracking-wide
        "
      >
        Auto-scrolling · Drag, swipe, or use the slider
      </p>

      <style>{`
        .certification-slider::-webkit-slider-thumb {
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          cursor: grab;
        }

        .certification-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
        }

        .certification-slider::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          cursor: grab;
        }

        .certification-slider::-moz-range-thumb:active {
          cursor: grabbing;
        }
      `}</style>
    </section>
  );
};