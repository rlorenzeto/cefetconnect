import { PenLine, Tag, Users, Rocket } from "lucide-react"
import { Reveal } from "./Reveal"

const steps = [
  {
    icon: PenLine,
    iconBg: "bg-brand-green-medium",
    title: "1. Crie sua conta",
    text: "Utilize seu e-mail institucional para acessar a plataforma.",
  },
  {
    icon: Tag,
    iconBg: "bg-brand-blue-medium",
    title: "2. Escolha seus interesses",
    text: "Selecione áreas acadêmicas e personalize seu perfil.",
  },
  {
    icon: Users,
    iconBg: "bg-brand-green-dark",
    title: "3. Entre em comunidades",
    text: "Descubra grupos, mentorias e eventos.",
  },
  {
    icon: Rocket,
    iconBg: "bg-brand-blue-light",
    title: "4. Interaja e evolua",
    text: "Compartilhe conhecimento e construa conexões relevantes.",
  },
]

export function StepsSection() {
  return (
    <section id="comunidades" className="bg-brand-green-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center font-heading text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            Comece em poucos passos
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-brand-green-light via-brand-blue-light to-brand-blue-medium lg:block"
          />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 120}>
                <div className="flex flex-col items-center text-center">
                  <span
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ${step.iconBg} text-white shadow-lg ring-8 ring-brand-green-50`}
                  >
                    <step.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-heading text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
