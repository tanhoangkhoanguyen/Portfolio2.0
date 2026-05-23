import { useState } from "react"
import { scrollToSection } from "../lib/scrollToSection"

const BEACH_FALLBACK =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop&q=80"

export function About() {
  const [imgSrc, setImgSrc] = useState("/profile.png")

  return (
    <div className="w-full">
      <h2 className="text-left text-slate-900 dark:text-white">About me</h2>
      <div className="mt-10 w-full text-left">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
          <div className="shrink-0 md:flex md:w-60 md:self-stretch">
            <img
              src={imgSrc}
              alt="Tan Hoang Khoa Nguyen"
              width={280}
              height={280}
              className="aspect-square w-56 rounded-lg object-cover sm:w-60 md:aspect-auto md:h-full md:min-h-[12rem] md:w-full"
              onError={() => setImgSrc((s) => (s === BEACH_FALLBACK ? s : BEACH_FALLBACK))}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start">
            <p className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Hi, I&apos;m{" "}
              <span className="hero-name-gradient">
                Khoa
              </span>
            </p>
            <p className="mt-2 w-full text-slate-700 dark:text-slate-300">
              I am a passionate developer who sees coding as something magical — a journey where every challenge becomes
              an opportunity for growth. I&apos;m also a big fan of K-dramas — mostly for the plot, but somehow they
              steal more of my time than coding.
            </p>

            <hr className="my-3 w-full border-0 border-t border-sky-200/90 dark:border-slate-800" />

            <dl className="grid w-full gap-1.5">
              <div className="flex flex-col gap-0 sm:flex-row sm:items-baseline sm:gap-2">
                <dt className="shrink-0 font-semibold text-sky-800 dark:text-sky-300">School</dt>
                <dd className="text-slate-700 dark:text-slate-300">University of South Florida</dd>
              </div>
              <div className="flex flex-col gap-0 sm:flex-row sm:items-baseline sm:gap-2">
                <dt className="shrink-0 font-semibold text-sky-800 dark:text-sky-300">Major</dt>
                <dd className="text-slate-700 dark:text-slate-300">Computer Science</dd>
              </div>
              <div className="flex flex-col gap-0 sm:flex-row sm:items-baseline sm:gap-2">
                <dt className="shrink-0 font-semibold text-sky-800 dark:text-sky-300">Focus</dt>
                <dd className="text-slate-700 dark:text-slate-300">AI Engineer, Software Engineer, ML Researcher</dd>
              </div>
            </dl>

            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="https://drive.google.com/file/d/1Ogszi5_CAXD6CFPZQJZZtJFbx_8UXSCv/view?usp=drive_link"
                download="Tan-Hoang-Khoa-Nguyen-Resume.pdf"
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-500 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                Download resume
              </a>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center justify-center rounded-lg border border-sky-500/50 bg-white/80 px-5 py-2.5 text-sm font-semibold text-sky-900 transition hover:border-sky-600 hover:bg-white dark:border-sky-400/40 dark:bg-black/50 dark:text-sky-100 dark:hover:border-sky-300 dark:hover:bg-sky-500/10"
              >
                Contact me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
