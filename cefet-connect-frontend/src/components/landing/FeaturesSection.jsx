import { Newspaper, Users, CalendarDays, Trophy, Tag, Award } from "lucide-react"
import { Reveal } from "./Reveal"

const features = [
  {
    icon: Newspaper,
    iconBg: "bg-brand-green-medium",
    title: "Feed de Publicações",
    text: "Compartilhe ideias, dúvidas, oportunidades e experiências com toda a comunidade acadêmica. Curta, comente e interaja com outros estudantes.",
  },
  {
    icon: Users,
    iconBg: "bg-brand-green-dark",
    title: "Comunidades Acadêmicas",
    text: "Crie ou participe de grupos voltados para disciplinas, projetos, áreas de pesquisa e interesses específicos.",
  },
  {
    icon: CalendarDays,
    iconBg: "bg-brand-blue-medium",
    title: "Eventos e Mentorias",
    text: "Organize e participe de palestras, encontros, grupos de estudo e mentorias diretamente pela plataforma.",
  },
  {
    icon: Trophy,
    iconBg: "bg-brand-blue-light",
    title: "Ranking de Interação",
    text: "Gamifique sua participação e destaque-se entre os estudantes mais ativos da comunidade.",
  },
  {
    icon: Tag,
    iconBg: "bg-brand-green-light",
    title: "Interesses Acadêmicos",
    text: "Selecione áreas de interesse e descubra estudantes que compartilham os mesmos objetivos acadêmicos.",
  },
  {
    icon: Award,
    iconBg: "bg-brand-green-medium",
    title: "Conquistas Acadêmicas",
    text: "Receba distintivos e ícones especiais conforme sua participação e evolução na plataforma.",
  },
]

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            Tudo o que você precisa para se conectar academicamente
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Ferramentas desenvolvidas para fortalecer a colaboração e a integração entre estudantes.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 100}>
              <article className="group h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-green-light/50 hover:shadow-xl">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
