type DadosIcone = {
  nomeIcone: string;
  descricaoIcone: string;
  codigoIcone: string;
};

const ICONES_COMUNS = {
  MATEMATICA: {
    nomeIcone: 'Matemática',
    descricaoIcone: 'Representa a conclusão do eixo de Matemática.',
    codigoIcone: 'MATEMATICA',
  },

  FISICA_QUIMICA: {
    nomeIcone: 'Física e Química',
    descricaoIcone: 'Representa a conclusão do eixo de Física e Química.',
    codigoIcone: 'FISICA_QUIMICA',
  },

  HUMANIDADES: {
    nomeIcone: 'Humanidades e Ciências Sociais',
    descricaoIcone: 'Representa a conclusão do eixo de Humanidades e Ciências Sociais.',
    codigoIcone: 'HUMANIDADES',
  },

  ELETRICIDADE: {
    nomeIcone: 'Eletricidade',
    descricaoIcone: 'Representa a conclusão do eixo de Eletricidade.',
    codigoIcone: 'ELETRICIDADE',
  },

  ELETRONICA: {
    nomeIcone: 'Eletrônica',
    descricaoIcone: 'Representa a conclusão do eixo de Eletrônica.',
    codigoIcone: 'ELETRONICA',
  },

  CONTROLE_PROCESSOS: {
    nomeIcone: 'Controle de Processos',
    descricaoIcone: 'Representa a conclusão do eixo de Controle de Processos.',
    codigoIcone: 'CONTROLE_PROCESSOS',
  },

  PRATICA_PROFISSIONAL: {
    nomeIcone: 'Prática Profissional e Formação Diversificada',
    descricaoIcone: 'Representa a conclusão do eixo de Prática Profissional e Formação Diversificada.',
    codigoIcone: 'PRATICA_PROFISSIONAL',
  },
} as const;

export const ICONES_PPC_POR_CURSO = {
  ECOMP: {
    ...ICONES_COMUNS,

    FUNDAMENTOS_COMP: {
      nomeIcone: 'Fundamentos de Engenharia de Computação',
      descricaoIcone: 'Representa a conclusão do eixo de Fundamentos de Engenharia de Computação.',
      codigoIcone: 'FUNDAMENTOS_COMP',
    },

    ENG_SOFTWARE_BD: {
      nomeIcone: 'Engenharia de Software e Banco de Dados',
      descricaoIcone: 'Representa a conclusão do eixo de Engenharia de Software e Banco de Dados.',
      codigoIcone: 'ENG_SOFTWARE_BD',
    },

    REDES_SD: {
      nomeIcone: 'Redes e Sistemas Distribuídos',
      descricaoIcone: 'Representa a conclusão do eixo de Redes e Sistemas Distribuídos.',
      codigoIcone: 'REDES_SD',
    },

    SISTEMAS_INTELIGENTES: {
      nomeIcone: 'Sistemas Inteligentes',
      descricaoIcone: 'Representa a conclusão do eixo de Sistemas Inteligentes.',
      codigoIcone: 'SISTEMAS_INTELIGENTES',
    },
  },

  ENCAUT: {
    ...ICONES_COMUNS,

    AUTOMACAO: {
      nomeIcone: 'Automação',
      descricaoIcone: 'Representa a conclusão do eixo de Automação.',
      codigoIcone: 'AUTOMACAO',
    },

    COMPUTACAO_MATEMATICA_APLICADA: {
      nomeIcone: 'Computação e Matemática Aplicada',
      descricaoIcone: 'Representa a conclusão do eixo de Computação e Matemática Aplicada.',
      codigoIcone: 'COMPUTACAO_MATEMATICA_APLICADA',
    },

    INFORMATICA_INDUSTRIAL: {
      nomeIcone: 'Informática Industrial',
      descricaoIcone: 'Representa a conclusão do eixo de Informática Industrial.',
      codigoIcone: 'INFORMATICA_INDUSTRIAL',
    },

    MECANICA: {
      nomeIcone: 'Mecânica',
      descricaoIcone: 'Representa a conclusão do eixo de Mecânica.',
      codigoIcone: 'MECANICA',
    },
  },
} as const;

export const ICONES_PPC_ENG_COMP = ICONES_PPC_POR_CURSO.ECOMP;

export type CursoGradmentCodigo = keyof typeof ICONES_PPC_POR_CURSO;

export type CodigoIconePpc =
  | keyof typeof ICONES_PPC_POR_CURSO.ECOMP
  | keyof typeof ICONES_PPC_POR_CURSO.ENCAUT;

export function normalizarTexto(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
}

export function obterCursoGradment(curso: any): CursoGradmentCodigo | null {
  const texto = normalizarTexto(
    String(
      curso?.codigo ??
      curso?.codigoCurso ??
      curso?.idCurso ??
      curso?.nomeCurso ??
      curso?.nome ??
      curso ??
      '',
    ),
  );

  if (
    texto.includes('ENCAUT') ||
    texto.includes('CONTROLE') ||
    texto.includes('AUTOMACAO')
  ) {
    return 'ENCAUT';
  }

  if (
    texto.includes('ECOMP') ||
    texto.includes('ENG_COMP') ||
    texto.includes('ENGENHARIA DE COMPUTACAO') ||
    texto.includes('COMPUTACAO')
  ) {
    return 'ECOMP';
  }

  return null;
}

export function obterCatalogoIcones(
  curso: CursoGradmentCodigo,
): Record<string, DadosIcone> {
  return ICONES_PPC_POR_CURSO[curso] as unknown as Record<string, DadosIcone>;
}