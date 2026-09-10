import {
  motion,
  useInView,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
} from "react";

function TypedBiography({
  text = "",
  start,
}) {
  const [visibleCharacters, setVisibleCharacters] =
    useState(0);

  useEffect(() => {
    if (!start) return;

    setVisibleCharacters(0);

    const timer = window.setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= text.length) {
          window.clearInterval(timer);
          return current;
        }

        return current + 1;
      });
    }, 12);

    return () => window.clearInterval(timer);
  }, [text, start]);

  return (
    <p className="about-typed-text">
      {text.slice(0, visibleCharacters)}

      {visibleCharacters < text.length && (
        <span className="about-type-cursor">
          |
        </span>
      )}
    </p>
  );
}

export default function AboutSection({
  data,
}) {
  const sectionRef = useRef(null);

  const isVisible = useInView(sectionRef, {
    once: true,
    amount: 0.3,
  });

  return (
    <div
      ref={sectionRef}
      className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]"
    >
      <div>
        <motion.p
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={
            isVisible
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          className="label"
        >
          About me
        </motion.p>

        <motion.h2
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={
            isVisible
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.7,
          }}
          className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          {data?.heading}
        </motion.h2>

        <div className="mt-8 max-w-3xl">
          <TypedBiography
            text={data?.bio}
            start={isVisible}
          />
        </div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          x: 50,
          scale: 0.94,
        }}
        animate={
          isVisible
            ? {
                opacity: 1,
                x: 0,
                scale: 1,
              }
            : {}
        }
        transition={{
          duration: 0.8,
          delay: 0.15,
        }}
        className="about-photo-frame"
      >
        {data?.image?.url ? (
          <img
            src={data.image.url}
            alt="Hemanth M Sirvi"
            className="about-photo"
          />
        ) : (
          <div className="about-photo-empty">
            Upload your photograph from the
            admin dashboard
          </div>
        )}

        <div className="about-photo-line" />

        <span className="about-photo-label">
          HEMANTH M SIRVI
        </span>
      </motion.div>
    </div>
  );
}