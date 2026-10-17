import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import hero from "../assets/hero.jpg";
import { PlaceGrid } from "../components/places/PlaceCard";
import { Button } from "../components/ui/button";
import { CATEGORIES } from "../utils/constants";

export default function HomePage() {
  return (
    <>
      <section className="container-page mt-4">
        <div className="relative isolate overflow-hidden rounded-[2.25rem]">
          <img
            src={hero}
            alt="Туристка над мъгливи долини"
            width={1600}
            height={912}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-hero" />

          <div className="flex min-h-[68vh] flex-col justify-end p-8 text-primary-foreground sm:p-14">
            <span className="animate-rise glass mb-5 w-fit rounded-full px-4 py-1.5 text-xs font-semibold text-foreground">
              ✦ Пътеводител, писан от пътешественици
            </span>

            <h1 className="animate-rise max-w-4xl text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Места, които си <span className="text-gradient">заслужават</span>{" "}
              пътя.
            </h1>

            <p className="animate-rise mt-5 max-w-xl text-lg opacity-90">
              Открий скрити езера, стари улички и тайни заливи — и сподели
              своите.
            </p>

            <div className="animate-rise mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
              >
                <Link to="/places">
                  Разгледай каталога
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass h-12 rounded-full px-6 text-foreground"
              >
                <Link to="/places?view=map">Виж картата</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-16">
        <h2 className="text-3xl">Избери посока</h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              to={`/places?category=${encodeURIComponent(c.value)}`}
              className="group rounded-3xl border bg-card p-5 transition hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-2xl transition group-hover:bg-accent">
                {c.emoji}
              </span>

              <p className="mt-4 text-sm font-semibold">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl">Най-нови места</h2>

          <Link
            to="/places"
            className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground"
          >
            Виж всички
          </Link>
        </div>

        <PlaceGrid places={[]} />
      </section>
    </>
  );
}
