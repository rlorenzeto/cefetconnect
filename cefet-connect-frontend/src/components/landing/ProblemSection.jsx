import { Users, Megaphone, CheckCircle2 } from "lucide-react"
import { Reveal } from "./Reveal"

const cards = [
  {
    icon: Users,
    iconBg: "bg-brand-green-dark",
    title: "Dificuldade em encontrar colegas com interesses semelhantes.",
    text: "Muitos estudantes possuem interesses acadêmicos em comum, mas não conseguem se conectar facilmente.",
  },
  {
    icon: Megaphone,
    iconBg: "bg-brand-blue-medium",
    title: "Pouca divulgação de mentorias e eventos.",
    text: "Diversas iniciativas acadêmicas deixam de alcançar alunos que poderiam se beneficiar delas.",
  },
  {
    icon: CheckCircle2,
    iconBg: "bg-brand-green-medium",
    title: "O CEFET Connect centraliza toda essa experiência.",
    text: "Comunidades, eventos e networking em um único ambiente digital.",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-brand-green-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-center font-heading text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            A vida acadêmica vai muito além da sala de aula.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 120}>
              <article className="h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}>
                  <card.icon className="h-6 w-6 text-white" />
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
