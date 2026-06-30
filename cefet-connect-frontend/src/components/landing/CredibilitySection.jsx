import { GraduationCap, Users, Rocket } from "lucide-react"
import { Reveal } from "./Reveal"

const cards = [
  {
    icon: GraduationCap,
    title: "Feito por estudantes, para estudantes.",
    text: "Pensado nas necessidades reais da vida acadêmica.",
  },
  {
    icon: Users,
    title: "Fortalecendo a integração acadêmica no CEFET-MG.",
    text: "Conectando talentos, ideias e propósitos.",
  },
  {
    icon: Rocket,
    title: "Incentivando colaboração, extensão e inovação.",
    text: "Construindo juntos um ambiente acadêmico mais forte.",
  },
]

export function CredibilitySection() {
  return (
    <section id="sobre" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 110}>
              <article className="h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-50">
                  <card.icon className="h-6 w-6 text-brand-green-dark" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold leading-snug text-foreground text-balance">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
