import { ArrowRight } from "lucide-react"
import { Reveal } from "./Reveal"

export function CtaSection() {
  return (
    <section id="cta" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue-medium to-brand-green-dark px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <h2 className="relative mx-auto max-w-3xl font-heading text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            Pronto para transformar sua experiência acadêmica?
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/90 text-pretty">
            Conecte-se com pessoas, participe de comunidades e faça parte da nova rede acadêmica do CEFET.
          </p>
          <div className="relative mt-9">
            <a
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-brand-blue-medium shadow-lg transition-all hover:bg-brand-green-50 hover:shadow-xl"
            >
              Criar minha conta gratuitamente
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
          <p className="relative mt-5 text-sm text-white/80">
            Sem custos. Simples. Feito para a comunidade acadêmica.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
