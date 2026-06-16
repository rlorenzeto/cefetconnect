const PPC_ICON_CONFIG = {
  MATEMATICA: {
    color: "#0B3BB8",
    title: "Matemática",
  },
  FISICA_QUIMICA: {
    color: "#55B83E",
    title: "Física e Química",
  },
  HUMANIDADES: {
    color: "#7655F6",
    title: "Humanidades",
  },
  CONTROLE_PROCESSOS: {
    color: "#18C8D8",
    title: "Controle de Processos",
  },
  ELETRONICA: {
    color: "#F22626",
    title: "Eletrônica",
  },
  ELETRICIDADE: {
    color: "#FFD11A",
    title: "Eletricidade",
  },
  PRATICA_PROFISSIONAL: {
    color: "#FFD11A",
    title: "Prática Profissional",
  },
  ENG_SOFTWARE_BD: {
    color: "#0B7F38",
    title: "Engenharia de Software e Banco de Dados",
  },
  FUNDAMENTOS_COMP: {
    color: "#FF7A12",
    title: "Fundamentos de Engenharia de Computação",
  },
  SISTEMAS_INTELIGENTES: {
    color: "#F23A3A",
    title: "Sistemas Inteligentes",
  },
  REDES_SD: {
    color: "#9AA84A",
    title: "Redes e Sistemas Distribuídos",
  },
};

function SealBase({ color, className = "h-24 w-24", children, title }) {
  const patternId = `scribble-${String(title).replace(/\s+/g, "-")}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      role="img"
      aria-label={title}
    >
      <defs>
        <pattern
          id={patternId}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-18)"
        >
          <path
            d="M0 2h10M0 5h10M0 8h10"
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        </pattern>

        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="1.4"
            floodColor="#000"
            floodOpacity="0.18"
          />
        </filter>
      </defs>

      <path
        d="
          M60 4
          L64.2 7.1 L68.9 4.9 L72.3 8.8 L77.3 7.7 L79.7 12.3 L84.8 12.4
          L86.1 17.4 L91 18.6 L91.1 23.8 L95.5 26.2 L94.4 31.3 L98.1 34.8
          L95.9 39.5 L98.8 43.8 L95.6 47.8 L97.3 52.7 L93.5 56.1
          L94.1 61.2 L89.7 63.8 L89.2 68.9 L84.4 70.5 L82.8 75.4
          L77.7 76.1 L75.1 80.5 L70 80 L66.7 84 L62 82.4 L58 85.7
          L53.8 82.7 L49.1 84.9 L45.7 81 L40.7 82.1 L38.3 77.5 L33.2 77.4
          L31.9 72.4 L27 71.2 L26.9 66 L22.5 63.6 L23.6 58.5 L19.9 55
          L22.1 50.3 L19.2 46 L22.4 42 L20.7 37.1 L24.5 33.7 L23.9 28.6
          L28.3 26 L28.8 20.9 L33.6 19.3 L35.2 14.4 L40.3 13.7 L42.9 9.3
          L48 9.8 L51.3 5.8 L56 7.4 Z
        "
        fill={color}
        filter="url(#soft-shadow)"
      />

      <path
        d="
          M60 4
          L64.2 7.1 L68.9 4.9 L72.3 8.8 L77.3 7.7 L79.7 12.3 L84.8 12.4
          L86.1 17.4 L91 18.6 L91.1 23.8 L95.5 26.2 L94.4 31.3 L98.1 34.8
          L95.9 39.5 L98.8 43.8 L95.6 47.8 L97.3 52.7 L93.5 56.1
          L94.1 61.2 L89.7 63.8 L89.2 68.9 L84.4 70.5 L82.8 75.4
          L77.7 76.1 L75.1 80.5 L70 80 L66.7 84 L62 82.4 L58 85.7
          L53.8 82.7 L49.1 84.9 L45.7 81 L40.7 82.1 L38.3 77.5 L33.2 77.4
          L31.9 72.4 L27 71.2 L26.9 66 L22.5 63.6 L23.6 58.5 L19.9 55
          L22.1 50.3 L19.2 46 L22.4 42 L20.7 37.1 L24.5 33.7 L23.9 28.6
          L28.3 26 L28.8 20.9 L33.6 19.3 L35.2 14.4 L40.3 13.7 L42.9 9.3
          L48 9.8 L51.3 5.8 L56 7.4 Z
        "
        fill={`url(#${patternId})`}
      />

      <circle cx="60" cy="45" r="44" stroke="white" strokeOpacity="0.22" strokeWidth="3" />
      <circle cx="60" cy="45" r="36" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" />
      <circle cx="60" cy="45" r="33" stroke="white" strokeOpacity="0.16" strokeWidth="1.5" />

      <g
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {children}
      </g>
    </svg>
  );
}

function PpcGlyph({ code }) {
  switch (code) {
    case "MATEMATICA":
      return (
        <>
          <path d="M25 58h70" />
          <path d="M40 78V20" />
          <path d="M37 24l3-4 3 4" />
          <path d="M91 55l4 3-4 3" />
          <path d="M30 25v48" strokeDasharray="4 4" opacity="0.8" />
          <path d="M43 78c4-28 12-32 22-32 11 0 19-6 28-8" />
          <path d="M54 61c7-2 17-3 35-6" />
          <text x="61" y="35" fill="white" fontSize="8" fontWeight="700">
            y=log(x)
          </text>
          <text x="45" y="68" fill="white" fontSize="7" fontWeight="700">
            (1,0)
          </text>
        </>
      );

    case "FISICA_QUIMICA":
      return (
        <>
          <path d="M45 28h17" />
          <path d="M52 31v36" />
          <path d="M40 67h24" />
          <path d="M45 67l-8 12h36L64 67" />
          <path d="M45 51h19" />
          <circle cx="50" cy="42" r="2" fill="white" />
          <circle cx="59" cy="58" r="2" fill="white" />
          <path d="M77 31c12 2 16 10 12 19s-16 12-25 6-12-17-5-23 18-5 25 2" />
          <circle cx="75" cy="44" r="4" />
          <path d="M64 44h23M75 31v26" />
          <path d="M25 35h22" />
          <path d="M31 35v28" />
          <path d="M42 35v28" />
          <circle cx="31" cy="70" r="5" />
          <circle cx="42" cy="70" r="5" />
          <text x="19" y="27" fill="white" fontSize="8" fontWeight="700">
            F=ma
          </text>
          <text x="22" y="84" fill="white" fontSize="7" fontWeight="700">
            E=mc²
          </text>
        </>
      );

    case "HUMANIDADES":
      return (
        <>
          <path d="M25 56l17-16c4-4 10-4 14 0l4 4" />
          <path d="M95 56L78 40c-4-4-10-4-14 0L45 59" />
          <path d="M42 60l12 12c4 4 10 4 14 0l11-11" />
          <path d="M36 66l10 10M48 75l7 7M72 75l-7 7M84 66l-10 10" />
          <path d="M21 45l13-13 12 12-13 13z" />
          <path d="M99 45L86 32 74 44l13 13z" />
          <path d="M38 65c-4 2-8 1-11-2" />
          <path d="M82 65c4 2 8 1 11-2" />
        </>
      );

    case "CONTROLE_PROCESSOS":
      return (
        <>
          <path d="M60 20h12l3 12 11 5-6 10 3 12-11 5-4 11H55l-4-11-11-5 3-12-6-10 11-5 3-12h9z" />
          <circle cx="60" cy="48" r="16" />
        </>
      );

    case "ELETRONICA":
      return (
        <>
          <rect x="43" y="31" width="34" height="34" rx="4" />
          <rect x="52" y="40" width="16" height="16" rx="2" />
          <path d="M36 37H24M36 45H24M36 53H24M36 61H24" />
          <path d="M96 37H84M96 45H84M96 53H84M96 61H84" />
          <path d="M49 24V13M57 24V13M65 24V13M73 24V13" />
          <path d="M49 83V72M57 83V72M65 83V72M73 83V72" />
          <circle cx="24" cy="37" r="2" />
          <circle cx="96" cy="45" r="2" />
          <circle cx="57" cy="13" r="2" />
          <circle cx="73" cy="83" r="2" />
        </>
      );

    case "ELETRICIDADE":
      return (
        <>
          <path d="M67 18 42 53h18L51 84l29-40H62z" />
          <path d="M29 45l-8-3M31 58l-8 4M91 45l8-3M89 58l8 4" opacity="0.8" />
        </>
      );

    case "PRATICA_PROFISSIONAL":
      return (
        <>
          <rect x="24" y="39" width="42" height="33" rx="4" />
          <path d="M35 39v-8h20v8" />
          <path d="M24 51h42" />
          <path d="M34 51v8M56 51v8" />
          <path d="M61 70c1-17 12-25 26-20 9 4 13 11 13 20" />
          <path d="M56 70h48" />
          <path d="M69 49c2 9 2 14 0 21M82 48c4 8 5 15 2 22M94 58c-4 3-9 4-14 4" />
        </>
      );

    case "ENG_SOFTWARE_BD":
      return (
        <>
          <ellipse cx="42" cy="28" rx="20" ry="8" />
          <path d="M22 28v39c0 5 9 9 20 9s20-4 20-9V28" />
          <path d="M22 41c0 5 9 9 20 9s20-4 20-9" />
          <path d="M22 55c0 5 9 9 20 9s20-4 20-9" />
          <rect x="55" y="43" width="42" height="32" rx="4" />
          <path d="M55 53h42" />
          <path d="M68 64l-8-6 8-6" />
          <path d="M84 52l8 6-8 6" />
          <path d="M78 52l-7 18" />
          <circle cx="63" cy="48" r="1.5" fill="white" />
          <circle cx="69" cy="48" r="1.5" fill="white" />
          <circle cx="75" cy="48" r="1.5" fill="white" />
        </>
      );

    case "FUNDAMENTOS_COMP":
      return (
        <>
          <rect x="25" y="30" width="70" height="45" rx="4" />
          <path d="M50 82h20" />
          <path d="M60 75v7" />
          <path d="M49 56l-11-9 11-9" />
          <path d="M71 38l11 9-11 9" />
          <path d="M64 36l-9 23" />
        </>
      );

    case "SISTEMAS_INTELIGENTES":
      return (
        <>
          <path d="M60 24c-13-10-31 1-26 18-10 7-8 23 5 27 4 12 21 12 25 1 12 8 28-1 25-16 10-9 3-26-11-25-3-10-14-12-18-5z" />
          <path d="M60 24v56" />
          <path d="M48 39h-8v10h-7" />
          <path d="M49 57h-9" />
          <path d="M48 70h-8v-8h-7" />
          <path d="M72 39h8v10h7" />
          <path d="M71 57h9" />
          <path d="M72 70h8v-8h7" />
          <circle cx="33" cy="49" r="2" />
          <circle cx="33" cy="62" r="2" />
          <circle cx="87" cy="49" r="2" />
          <circle cx="87" cy="62" r="2" />
        </>
      );

    case "REDES_SD":
      return (
        <>
          <circle cx="60" cy="50" r="13" />
          <path d="M47 50h26M60 37c4 5 6 22 0 26M60 37c-4 5-6 22 0 26" />
          <rect x="21" y="25" width="22" height="17" rx="3" />
          <rect x="77" y="25" width="22" height="17" rx="3" />
          <rect x="21" y="66" width="22" height="17" rx="3" />
          <rect x="77" y="66" width="22" height="17" rx="3" />
          <path d="M43 33h14M77 33H63M43 74h14M77 74H63" />
          <path d="M32 42v24M88 42v24" strokeDasharray="4 4" />
          <path d="M43 33h34M43 74h34" strokeDasharray="4 4" opacity="0.8" />
        </>
      );

    default:
      return (
        <>
          <circle cx="60" cy="50" r="20" />
          <path d="M60 35v18l11 8" />
        </>
      );
  }
}

export function AcademicPpcIcon({
  code = "MATEMATICA",
  className = "h-24 w-24",
}) {
  const config = PPC_ICON_CONFIG[code] ?? PPC_ICON_CONFIG.MATEMATICA;

  return (
    <span style={{ color: config.color }} className="inline-flex">
      <SealBase color={config.color} className={className} title={config.title}>
        <PpcGlyph code={code} />
      </SealBase>
    </span>
  );
}

export function MatematicaPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="MATEMATICA" className={className} />;
}

export function FisicaQuimicaPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="FISICA_QUIMICA" className={className} />;
}

export function HumanidadesPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="HUMANIDADES" className={className} />;
}

export function ControleProcessosPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="CONTROLE_PROCESSOS" className={className} />;
}

export function EletronicaPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="ELETRONICA" className={className} />;
}

export function EletricidadePpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="ELETRICIDADE" className={className} />;
}

export function PraticaProfissionalPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="PRATICA_PROFISSIONAL" className={className} />;
}

export function EngenhariaSoftwareBdPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="ENG_SOFTWARE_BD" className={className} />;
}

export function FundamentosComputacaoPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="FUNDAMENTOS_COMP" className={className} />;
}

export function SistemasInteligentesPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="SISTEMAS_INTELIGENTES" className={className} />;
}

export function RedesSistemasDistribuidosPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="REDES_SD" className={className} />;
}