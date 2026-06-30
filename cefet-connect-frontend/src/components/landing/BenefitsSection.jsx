import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  MonitorSmartphone, 
  Star, 
  Menu, 
  Home, 
  CalendarDays, 
  User, 
  Plus, 
  Check, 
  Code,
  Calculator,
  BookOpen
} from "lucide-react"
import { Reveal } from "./Reveal"

const benefits = [
  {
    icon: Users,
    title: "Networking Inteligente",
    text: "Conheça estudantes, professores e grupos alinhados aos seus interesses acadêmicos.",
  },
  {
    icon: TrendingUp,
    title: "Maior Engajamento",
    text: "Participe ativamente da vida acadêmica e fortaleça seu protagonismo estudantil.",
  },
  {
    icon: Briefcase,
    title: "Desenvolvimento Profissional",
    text: "Amplie sua rede de contatos e descubra oportunidades de pesquisa, extensão e projetos.",
  },
  {
    icon: MonitorSmartphone,
    title: "Centralização da Informação",
    text: "Tenha eventos, comunidades e interações acadêmicas organizadas em um único ambiente.",
  },
  {
    icon: Star,
    title: "Reconhecimento Acadêmico",
    text: "Seu envolvimento é valorizado através de rankings e conquistas.",
  },
]

function ProfileMobileMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[320px] aspect-[9/19] overflow-hidden rounded-[2.5rem] border-[8px] border-slate-900 bg-muted/30 shadow-2xl">
      {/* Scrollable Content */}
      <div className="flex h-full flex-col overflow-y-auto pb-16 scrollbar-hide">
        
        {/* Top Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue-medium text-[9px] font-bold text-white">
              CC
            </span>
            <span className="text-xs font-bold text-brand-green-dark">
              CEFET <span className="text-brand-green-medium">Connect</span>
            </span>
          </div>
          <Menu className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-2">
          {/* Profile Card */}
          <div className="bg-card px-4 pb-1 shadow-sm">
            <img
              src="/campus.png" /* Coloque a imagem na pasta public */
              alt="Capa do perfil com prédios"
              className="h-[60px] w-full rounded-b-xl object-cover"
            />
            <div className="relative -mt-8 flex justify-center">
              <div className="rounded-full border-4 border-card bg-card">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 border border-border">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="mt-0.5 text-center">
              <h3 className="text-sm font-bold text-foreground">Nome do Usuário</h3>
            </div>

            <div className="mt-1 flex gap-3">
              <div className="flex-1 rounded-xl bg-muted/50 py-2 text-center">
                <p className="text-sm font-bold text-brand-green-dark">4</p>
                <p className="text-[9px] text-muted-foreground">Posts</p>
              </div>
              <div className="flex-1 rounded-xl bg-muted/50 py-2 text-center">
                <p className="text-sm font-bold text-brand-blue-medium">2</p>
                <p className="text-[9px] text-muted-foreground">Comunidades</p>
              </div>
            </div>
          </div>

          {/* Descrição acadêmica */}
          <div className="bg-card px-4 py-3 shadow-sm">
            <h4 className="text-[11px] font-semibold text-foreground">Descrição acadêmica</h4>
            <div className="mt-1 rounded-xl bg-muted/30 p-2.5">
              <p className="text-[10px] text-muted-foreground">
                Minha descrição acadêmica
              </p>
            </div>
          </div>

          {/* Pins acadêmicos */}
          <div className="bg-card px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-[11px] font-semibold text-foreground">Pins acadêmicos</h4>
                <p className="text-[9px] text-muted-foreground">5 pin(s) exibido(s) no perfil</p>
              </div>
              <span className="rounded-full bg-brand-green-medium px-2 py-1 text-[9px] font-medium text-white">
                Adicionar pin
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Cálculo I", "Estrutura de Dados"].map((pin) => (
                <span 
                  key={pin} 
                  className="flex items-center gap-1 rounded-full border border-brand-green-light bg-brand-green-50 px-2 py-0.5 text-[9px] font-medium text-brand-green-dark"
                >
                  {pin} <Check className="h-2.5 w-2.5" />
                </span>
              ))}
            </div>
          </div>

          {/* Ícones acadêmicos */}
          <div className="bg-card px-4 py-1 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-[11px] font-semibold text-foreground">Ícones acadêmicos</h4>
                <p className="text-[9px] text-muted-foreground">3 conquista(s) do PPC</p>
              </div>
              <span className="text-[9px] font-medium text-brand-green-medium cursor-pointer hover:underline">
                Atualizar ícones
              </span>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
                  <Code className="h-5 w-5" />
                </div>
                <span className="text-[8px] font-semibold text-muted-foreground">Programação</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm border border-green-200">
                  <Calculator className="h-5 w-5" />
                </div>
                <span className="text-[8px] font-semibold text-muted-foreground">Matemática</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-sm border border-purple-200">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-[8px] font-semibold text-muted-foreground">Humanas</span>
              </div>
            </div>
          </div>

          {/* GradMent Integration & Edit */}
          <div className="bg-card px-4 py-1 shadow-sm">
            <div className="flex items-center justify-between rounded-xl border border-border p-2 bg-muted/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-brand-green-dark p-1">
                   <div className="h-full w-full border border-white/40 grid grid-cols-2 gap-0.5 p-0.5">
                      <div className="bg-white/80 rounded-[1px]" />
                      <div className="bg-white/80 rounded-[1px]" />
                      <div className="bg-white/80 rounded-[1px]" />
                      <div className="bg-white/40 rounded-[1px]" />
                   </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-foreground">GradMent</p>
                  <p className="text-[8px] text-muted-foreground max-w-[120px] leading-tight">
                    Vincule sua conta do GradMent para importar ícones automaticamente.
                  </p>
                </div>
              </div>
              <button className="rounded-lg bg-brand-green-medium px-2 py-1.5 text-[9px] font-semibold text-white">
                Conectar Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card px-6 py-2 pb-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between text-muted-foreground relative">
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-brand-green-medium transition-colors">
            <Home className="h-5 w-5" />
            <span className="text-[8px] font-medium">Início</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-brand-green-medium transition-colors">
            <Users className="h-5 w-5" />
            <span className="text-[8px] font-medium">Comunidades</span>
          </div>
          
          {/* FAB Action Button */}
          <div className="absolute left-1/2 -top-6 -translate-x-1/2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-brand-green-medium text-white shadow-lg ring-4 ring-card hover:bg-brand-green-dark transition-colors">
            <Plus className="h-6 w-6" />
          </div>

          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-brand-green-medium transition-colors ml-8">
            <CalendarDays className="h-5 w-5" />
            <span className="text-[8px] font-medium">Eventos</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-brand-green-medium cursor-pointer">
            <User className="h-5 w-5 fill-current" />
            <span className="text-[8px] font-bold">Perfil</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            Mais do que uma rede social. Um ecossistema acadêmico.
          </h2>
        </Reveal>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative flex justify-center lg:justify-end pr-0 lg:pr-8">
              {/* Elementos decorativos */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-10 h-32 w-32 rounded-3xl bg-brand-green-50"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-4 right-4 h-40 w-40 rounded-full bg-brand-blue-light/10"
              />
              
              {/* Mockup Mobile Interativo */}
              <ProfileMobileMockup />
              
            </div>
          </Reveal>

          <ul className="flex flex-col gap-6">
            {benefits.map((benefit, i) => (
              <Reveal as="li" key={benefit.title} delay={i * 90}>
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-50">
                    <benefit.icon className="h-5 w-5 text-brand-green-dark" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}