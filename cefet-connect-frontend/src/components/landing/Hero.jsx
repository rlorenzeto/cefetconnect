"use client"

import {
  ArrowRight,
  Users,
  CalendarDays,
  MessageCircle,
  Bell,
  Heart,
  MessageSquare,
  Home,
  Newspaper,
  Hash,
  Trophy,
  Award,
  User,
  Settings,
  CheckCircle2,
} from "lucide-react"
import { Link } from "react-router-dom";
import { Logo } from "./Logo"

const quickFeatures = ["Comunidades Acadêmicas", "Eventos e Mentorias", "Networking entre alunos",]

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      {/* soft background shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-green-light/15 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-blue-light/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-green-50 blur-2xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Left column */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-green-light/40 bg-brand-green-50 px-4 py-1.5 text-sm font-medium text-brand-green-dark">
            <span className="h-2 w-2 rounded-full bg-brand-green-dark" />
            A nova rede acadêmica do CEFET-MG
          </span>

          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            <span className="text-[#5cb036]">Connect-se</span>, aprenda e cresça dentro do <span className="text-primary">CEFET</span>.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
            Uma plataforma criada para aproximar estudantes, fortalecer comunidades acadêmicas e impulsionar mentorias,
            eventos e networking dentro da instituição.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {quickFeatures.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-5 w-5 text-brand-green-medium" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-brand-blue-dark hover:shadow-lg"
            >
              Entrar
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-green-medium/40 bg-background px-7 py-3.5 text-base font-semibold text-brand-green-dark transition-all hover:bg-brand-green-50"
            >
              Crie sua conta
            </Link>
          </div>
        </div>

        {/* Right column — mockup */}
        <div className="relative">
          <HeroMockup />
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Users, label: "Comunidades Acadêmicas", color: "text-brand-green-dark" },
            { icon: CalendarDays, label: "Participação em eventos", color: "text-brand-blue-medium" },
            { icon: Users, label: "Conexão entre alunos", color: "text-brand-green-medium" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green-50">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span className="font-heading text-xl font-bold text-foreground">{stat.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HeroMockup() {
  return (
    <div className="relative mx-auto max-w-xl">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-brand-blue-medium/10">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Logo className="scale-90 origin-left" />
          <div className="hidden flex-1 px-6 sm:block">
            <div className="h-8 w-full rounded-full bg-muted" />
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue-medium text-[10px] font-bold text-white">
            CC
          </span>
        </div>

        <div className="grid grid-cols-12">
          {/* sidebar */}
          <div className="col-span-3 hidden flex-col gap-1 border-r border-border p-3 sm:flex">
            {[
              { icon: Home, label: "Início", active: true },
              { icon: Users, label: "Comunidades" },
              { icon: CalendarDays, label: "Eventos" },
              { icon: Trophy, label: "Ranking" },
              { icon: User, label: "Perfil" },
            ].map((item) => (
              <span
                key={item.label}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
                  item.active ? "bg-brand-blue-medium/10 text-brand-blue-medium" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </span>
            ))}
          </div>

          {/* feed */}
          <div className="col-span-12 flex flex-col gap-3 bg-muted/30 p-3 sm:col-span-6">
            <div className="rounded-xl border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground">
              No que você está pensando?
            </div>
            {[
              {
                name: "Mariana Costa",
                role: "Engenharia de Computação · 2h",
                text: "Alguém animado para o evento de IA na próxima semana? Vai ser incrível!",
              },
              {
                name: "Lucas Fernandes",
                role: "Engenharia de Controle e Automação · 4h",
                text: "Grupo de estudos sobre Estruturas de Dados, interessados chamem!",
              },
            ].map((post) => (
              <div key={post.name} className="rounded-xl border border-border bg-card p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-green-light to-brand-blue-light" />
                  <span className="flex flex-col">
                    <span className="text-[11px] font-semibold text-foreground">{post.name}</span>
                    <span className="text-[9px] text-muted-foreground">{post.role}</span>
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-foreground">{post.text}</p>
                <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-brand-green-medium" /> 24 curtidas
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> 8 comentários
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* right column */}
          <div className="col-span-3 hidden flex-col gap-3 border-l border-border p-3 sm:flex">
            <div className="rounded-xl border border-border bg-card p-2.5">
              <p className="mb-2 text-[10px] font-semibold text-foreground">Ranking semanal</p>
              {[
                { name: "Ana", xp: "125 pts" },
                { name: "João", xp: "95 pts" },
                { name: "Maria", xp: "80 pts" },
              ].map((r, i) => (
                <div key={r.name} className="mb-1.5 flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-green-50 text-[8px] font-bold text-brand-green-dark">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[9px] font-medium text-foreground">{r.name}</span>
                  <span className="text-[8px] text-muted-foreground">{r.xp}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-2.5">
              <p className="mb-2 text-[10px] font-semibold text-foreground">Comunidades</p>
              {["Cálculo 1", "Física 2"].map((ev) => (
                <div key={ev} className="mb-2 flex items-start gap-1.5">
                  <Users className="mt-0.5 h-3 w-3 shrink-0 text-brand-blue-medium" />
                  <span className="text-[9px] leading-tight text-muted-foreground">{ev}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-2.5">
              <p className="mb-2 text-[10px] font-semibold text-foreground">Próximos eventos</p>
              {["Palestra", "Mentoria"].map((ev) => (
                <div key={ev} className="mb-2 flex items-start gap-1.5">
                  <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 text-brand-blue-medium" />
                  <span className="text-[9px] leading-tight text-muted-foreground">{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
