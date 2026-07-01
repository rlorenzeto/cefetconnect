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
    nomeIcone: 'Prática Profissional e Integração Curricular',
    descricaoIcone: 'Representa a conclusão do eixo de Prática Profissional e Formação Diversificada.',
    codigoIcone: 'PRATICA_PROFISSIONAL',
  },
    PERIODO_1: {
    nomeIcone: '1º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 1º Período.',
    codigoIcone: 'PERIODO_1',
  },
  PERIODO_2: {
    nomeIcone: '2º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 2º Período.',
    codigoIcone: 'PERIODO_2',
  },
  PERIODO_3: {
    nomeIcone: '3º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 3º Período.',
    codigoIcone: 'PERIODO_3',
  },
  PERIODO_4: {
    nomeIcone: '4º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 4º Período.',
    codigoIcone: 'PERIODO_4',
  },
  PERIODO_5: {
    nomeIcone: '5º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 5º Período.',
    codigoIcone: 'PERIODO_5',
  },
  PERIODO_6: {
    nomeIcone: '6º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 6º Período.',
    codigoIcone: 'PERIODO_6',
  },
  PERIODO_7: {
    nomeIcone: '7º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 7º Período.',
    codigoIcone: 'PERIODO_7',
  },
  PERIODO_8: {
    nomeIcone: '8º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 8º Período.',
    codigoIcone: 'PERIODO_8',
  },
  PERIODO_9: {
    nomeIcone: '9º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 9º Período.',
    codigoIcone: 'PERIODO_9',
  },
  PERIODO_10: {
    nomeIcone: '10º Período',
    descricaoIcone: 'Representa a conclusão de todas as disciplinas do 10º Período.',
    codigoIcone: 'PERIODO_10',
  },
} as const;

const ICONES_ECOMP = {
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
} as const;

const ICONES_ENCAUT = {
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
} as const;

export const ICONES_PPC_POR_CURSO = {
  ECOMP: {
    ...ICONES_COMUNS,
    ...ICONES_ECOMP,
  },

  ENCAUT: {
    ...ICONES_COMUNS,
    ...ICONES_ENCAUT,
  },
} as const;

/**
 * Mantém esse nome porque o icone.service.ts antigo importa ICONES_PPC_ENG_COMP.
 * Aqui ele junta todos os códigos que o service já está tentando normalizar.
 */
export const ICONES_PPC_ENG_COMP = {
  ...ICONES_COMUNS,
  ...ICONES_ECOMP,
  ...ICONES_ENCAUT,
} as const;

export type CodigoIconePpc = keyof typeof ICONES_PPC_ENG_COMP;
