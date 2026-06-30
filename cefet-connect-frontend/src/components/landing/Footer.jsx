import { Camera, Share2, Play, Mail } from "lucide-react"
import { Logo } from "./Logo"

const quickLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Comunidades", href: "#comunidades" },
  { label: "Sobre", href: "#sobre" },
  { label: "Entrar", href: "#cta" },
]

const socials = [
  { label: "E-mail", icon: Mail, href: "mailto:cefetconnect@gmail.com" },
]

export function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Conectando estudantes, ideias e oportunidades dentro do ambiente acadêmico.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-white">Links rápidos</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-brand-green-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-white">Contato</h3>
            <a
              href="mailto:cefetconnect@gmail.com"
              className="mt-4 block text-sm text-white/60 transition-colors hover:text-brand-green-light"
            >
              cefetconnect@gmail.com
            </a>
            <ul className="mt-5 flex gap-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-brand-green-light hover:text-brand-green-light"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
           {new Date().getFullYear()} CEFET Connect. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
