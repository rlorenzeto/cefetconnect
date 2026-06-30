const PIN_IMAGE_BY_CODE = {
  // comuns
  MATEMATICA: "/pins/matematica.svg",
  FISICA_QUIMICA: "/pins/fisica e quimica.svg",
  HUMANIDADES: "/pins/humanidades e ciencias sociais.svg",
  ELETRICIDADE: "/pins/eletricidade.svg",
  ELETRONICA: "/pins/eletronica.svg",
  CONTROLE_PROCESSOS: "/pins/controle e processos.svg",
  PRATICA_PROFISSIONAL: "/pins/pratica profissional e formacao diversificada.svg",

  // exclusivos de Engenharia de Computação
  ENG_SOFTWARE_BD: "/pins/ecomp/engenharia de software e banco de dados.svg",
  FUNDAMENTOS_COMP: "/pins/ecomp/fundamentos de engenharia de computacao.svg",
  REDES_SD: "/pins/ecomp/redes e sistemas distribuidos.svg",
  SISTEMAS_INTELIGENTES: "/pins/ecomp/sistemas inteligentes.svg",

  // exclusivos de Controle e Automação
  AUTOMACAO: "/pins/encaut/automacao.svg",
  COMPUTACAO_MATEMATICA_APLICADA: "/pins/encaut/computacao e matematica aplicada.svg",
  INFORMATICA_INDUSTRIAL: "/pins/encaut/informatica industrial.svg",
  MECANICA: "/pins/encaut/mecanica.svg",
};

const PIN_TITLE_BY_CODE = {
  MATEMATICA: "Matemática",
  FISICA_QUIMICA: "Física e Química",
  HUMANIDADES: "Humanidades e Ciências Sociais",
  ELETRICIDADE: "Eletricidade",
  ELETRONICA: "Eletrônica",
  CONTROLE_PROCESSOS: "Controle de Processos",
  PRATICA_PROFISSIONAL: "Prática Profissional e Formação Diversificada",

  ENG_SOFTWARE_BD: "Engenharia de Software e Banco de Dados",
  FUNDAMENTOS_COMP: "Fundamentos de Engenharia de Computação",
  REDES_SD: "Redes e Sistemas Distribuídos",
  SISTEMAS_INTELIGENTES: "Sistemas Inteligentes",

  AUTOMACAO: "Automação",
  COMPUTACAO_MATEMATICA_APLICADA: "Computação e Matemática Aplicada",
  INFORMATICA_INDUSTRIAL: "Informática Industrial",
  MECANICA: "Mecânica",
};

export function getGradmentPinImage(code) {
  return PIN_IMAGE_BY_CODE[code] ?? null;
}

export function getGradmentPinTitle(code) {
  return PIN_TITLE_BY_CODE[code] ?? "Pin acadêmico";
}

export function AcademicPpcIcon({
  code = "MATEMATICA",
  className = "h-24 w-24",
}) {
  const src = getGradmentPinImage(code);
  const title = getGradmentPinTitle(code);

  if (!src) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500`}
        title={title}
      >
        ?
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      title={title}
      className={`${className} object-contain`}
      loading="lazy"
    />
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

export function AutomacaoPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="AUTOMACAO" className={className} />;
}

export function ComputacaoMatematicaAplicadaPpcIcon({
  className = "h-24 w-24",
}) {
  return (
    <AcademicPpcIcon
      code="COMPUTACAO_MATEMATICA_APLICADA"
      className={className}
    />
  );
}

export function InformaticaIndustrialPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="INFORMATICA_INDUSTRIAL" className={className} />;
}

export function MecanicaPpcIcon({ className = "h-24 w-24" }) {
  return <AcademicPpcIcon code="MECANICA" className={className} />;
}