import { useNavigate } from "react-router";
import { ArrowDownIcon, ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import HeroCandles from "./HeroCandles";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative isolate flex min-h-[min(740px,calc(100svh_-_116px))] flex-col overflow-hidden bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 max-sm:min-h-0"
      id="home-hero"
      data-voice-section="home introduction"
    >
      <HeroCandles />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[69%] top-1/2 z-[1] h-[min(72vw,680px)] w-[min(72vw,680px)] -translate-x-1/2 -translate-y-1/2 max-[900px]:left-[70%] max-[900px]:h-[min(88vw,620px)] max-[900px]:w-[min(88vw,620px)] max-sm:left-1/2 max-sm:top-[71%] max-sm:h-[min(112vw,500px)] max-sm:w-[min(112vw,500px)]"
      >
        <span className="absolute left-1/2 top-1/2 h-[62%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-rose-300/35 dark:border-rose-500/25 animate-orbit-spin">
          <span className="absolute left-[18%] top-[12%] h-2.5 w-2.5 rounded-full border-2 border-stone-50 bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,.45)] dark:border-slate-950 dark:bg-rose-300" />
        </span>
        <span className="absolute left-1/2 top-1/2 h-[43%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-orange-300/35 dark:border-orange-400/25 animate-orbit-spin-reverse">
          <span className="absolute right-[10%] top-[28%] h-2 w-2 rounded-full border-2 border-stone-50 bg-orange-500 shadow-[0_0_16px_rgba(249,115,22,.4)] dark:border-slate-950 dark:bg-orange-300" />
        </span>
        <span className="absolute left-1/2 top-1/2 h-[25%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-slate-300/45 dark:border-slate-500/35 animate-orbit-spin">
          <span className="absolute bottom-[6%] left-[27%] h-1.5 w-1.5 rounded-full bg-slate-500 shadow-[0_0_12px_rgba(100,116,139,.5)] dark:bg-slate-300" />
        </span>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 top-[12%] -z-10 h-72 w-72 rounded-full bg-rose-100/70 dark:bg-rose-950/70" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 right-[4%] -z-10 h-60 w-64 rounded-full bg-orange-100/70 dark:bg-orange-950/60" />
      <div aria-hidden="true" className="pointer-events-none absolute left-[32%] top-1/3 -z-10 h-48 w-48 rounded-full bg-slate-200/70 dark:bg-slate-900/70" />

      <div className="relative z-10 mx-auto grid w-[min(calc(100%_-_64px),1280px)] flex-1 grid-cols-[.93fr_1.07fr] items-center gap-[clamp(34px,6vw,90px)] py-[76px] max-[900px]:w-[min(calc(100%_-_48px),760px)] max-[900px]:grid-cols-[1fr_.9fr] max-[900px]:gap-6 max-[900px]:py-14 max-sm:w-[calc(100%_-_40px)] max-sm:grid-cols-1 max-sm:gap-3 max-sm:py-12">
        <div className="relative z-10 max-w-[540px]">
          <p className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-rose-800 dark:text-rose-300 max-sm:mb-5 max-sm:text-[8px]">
            <SparklesIcon className="h-4 w-4" aria-hidden="true" /> A softer ritual for every day
          </p>
          <h1 className="m-0 font-serif text-[clamp(62px,7vw,104px)] font-medium leading-[.88] tracking-[-.07em] text-slate-950 dark:text-white max-[900px]:text-[clamp(59px,8vw,76px)] max-sm:text-[clamp(64px,17vw,86px)]">
            Let your day
            <span className="block pt-2 text-[.75em] font-normal leading-[1.12] tracking-[-.055em] text-slate-600 dark:text-slate-300">unwind with</span>
            <em className="block text-[1.09em] font-normal not-italic leading-[.95] text-rose-800 dark:text-rose-300">intention.</em>
          </h1>
          <p className="mt-7 max-w-[425px] text-sm leading-8 text-slate-600 dark:text-slate-300 max-sm:mt-5 max-sm:text-xs">
            From the first light of morning to the last quiet hour, find thoughtfully made incense for moments that feel like yours.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 max-sm:mt-6 max-sm:gap-2">
            <button type="button" className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-rose-700 bg-rose-600 px-6 text-xs font-bold text-white shadow-lg shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-rose-700 max-sm:min-h-[46px] max-sm:px-4 max-sm:text-[10px]" onClick={() => navigate("/fetch-products")}>
              Explore incense <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-slate-300 bg-white/70 dark:bg-slate-900/70 px-6 text-xs font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-50 max-sm:min-h-[46px] max-sm:px-4 max-sm:text-[10px] dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => navigate("/cart")}>
              Visit your bag
            </button>
          </div>

          <div className="mt-11 flex items-center gap-3 max-sm:mt-7">
            <span className="h-px w-9 bg-orange-600 dark:bg-orange-400" />
            <p className="m-0 text-[10px] tracking-wide text-slate-500 dark:text-slate-400 max-sm:text-[8px]">Made with intention <span className="px-1 text-orange-600 dark:text-orange-400">·</span> Delivered across India</p>
          </div>
        </div>

        <div className="relative flex min-h-[600px] flex-col items-center justify-center max-[900px]:min-h-[550px] max-sm:mt-2 max-sm:min-h-[440px]">
          <div aria-hidden="true" className="pointer-events-none absolute right-[7%] top-[5%] h-[82%] w-[74%] rotate-3 rounded-[2rem] border border-rose-200/70 bg-rose-100/80 dark:border-rose-800/50 dark:bg-rose-950/70" />

          <figure className="relative z-[1] m-0 w-[min(72%,420px)] max-[900px]:w-[78%] max-sm:w-[min(75%,300px)]">
            <div className="relative h-[min(50vw,480px)] min-h-[380px] overflow-hidden rounded-[2rem] border border-white bg-slate-200 shadow-[0_22px_60px_rgba(15,23,42,.18)] transition duration-500 hover:-translate-y-1 max-[900px]:h-[430px] max-[900px]:min-h-0 max-sm:h-[335px] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_22px_60px_rgba(0,0,0,.35)]">
              <img src="/incense-ritual.jpg" alt="Incense sticks smoldering in a lotus-shaped holder, with smoke curling above" fetchPriority="high" className="h-full w-full object-cover [object-position:50%_54%] saturate-[.94] brightness-[1.08]" />
            </div>

            <figcaption className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="grid gap-1">
                <small className="text-[8px] font-bold tracking-[.15em] text-rose-700 dark:text-rose-300">THE EVERYDAY RITUAL</small>
                <strong className="font-serif text-base font-normal text-slate-900 dark:text-slate-100 max-sm:text-sm">Light a little calm.</strong>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 font-serif text-lg text-rose-800 dark:bg-rose-950 dark:text-rose-200">01</span>
            </figcaption>
          </figure>

          <div className="absolute left-[2%] top-[13%] z-20 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-900/10 max-sm:left-0 max-sm:top-[10%] max-sm:px-2 max-sm:py-1.5 dark:border-slate-700 dark:bg-slate-900">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"><SparklesIcon className="h-4 w-4" aria-hidden="true" /></span>
            <span className="text-[8px] font-bold uppercase tracking-[.12em] text-slate-700 dark:text-slate-200 max-sm:text-[7px]">Botanical incense</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[52px] w-[min(calc(100%_-_64px),1280px)] grid-cols-[1fr_auto_1fr] items-center border-t border-slate-300/70 text-[8px] tracking-[.16em] text-slate-500 max-[900px]:w-[min(calc(100%_-_48px),760px)] max-sm:min-h-[45px] max-sm:w-[calc(100%_-_40px)] max-sm:text-[6px] max-sm:tracking-wider dark:border-slate-700 dark:text-slate-400">
        <span>AURA &amp; EMBER · DAILY INCENSE</span>
        <button type="button" onClick={() => navigate("/fetch-products")} aria-label="Browse the incense collection" className="grid h-[30px] w-[30px] place-items-center rounded-full border border-rose-700/30 bg-transparent text-rose-800 hover:bg-rose-50 max-sm:h-[26px] max-sm:w-[26px] dark:border-rose-300/30 dark:text-rose-300 dark:hover:bg-slate-800"><ArrowDownIcon className="h-3.5 w-3.5" aria-hidden="true" /></button>
        <span className="text-right">01 / MAKE SPACE FOR YOU</span>
      </div>
    </section>
  );
};

export default HeroSection;
