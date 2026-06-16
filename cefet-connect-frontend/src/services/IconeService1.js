import { apiFetch } from "./api";

const MOCK_GRADMENT_ICONES = true;
const MOCK_STORAGE_KEY = "mock_gradment_icones_usuario";

const MOCK_GRADMENT_RESPONSE = {
  curso: {
    idCurso: "ENG_COMP_LEOPOLDINA",
    nomeCurso: "Engenharia de Computação",
  },
  usuario: {
    matricula: "20240000000",
    nomeUsuario: "Usuário Simulado",
  },
  eixosFinalizados: [
    {
      codigo: "MATEMATICA",
      nome: "Matemática",
    },
    {
      codigo: "FISICA_QUIMICA",
      nome: "Física e Química",
    },
    {
      codigo: "HUMANIDADES",
      nome: "Humanidades e Ciências Sociais Aplicadas à Engenharia",
    },
    {
      codigo: "ELETRICIDADE",
      nome: "Eletricidade",
    },
    {
      codigo: "ELETRONICA",
      nome: "Eletrônica",
    },
    {
      codigo: "CONTROLE_PROCESSOS",
      nome: "Controle de Processos",
    },
    {
      codigo: "PRATICA_PROFISSIONAL",
      nome: "Prática Profissional e Integração Curricular",
    },
    {
      codigo: "FUNDAMENTOS_COMP",
      nome: "Fundamentos de Engenharia de Computação",
    },
    {
      codigo: "ENG_SOFTWARE_BD",
      nome: "Engenharia de Software e Banco de Dados",
    },
    {
      codigo: "REDES_SD",
      nome: "Redes e Sistemas Distribuídos",
    },
    {
      codigo: "SISTEMAS_INTELIGENTES",
      nome: "Sistemas Inteligentes",
    },
  ],
};

const ICONES_CATALOGO = {
  MATEMATICA: {
    idIcone: 1,
    nomeIcone: "Matemática",
    descricaoIcone:
      "Representa a conclusão do eixo de Matemática do PPC de Engenharia de Computação.",
    codigoIcone: "MATEMATICA",
  },

  FISICA_QUIMICA: {
    idIcone: 2,
    nomeIcone: "Física e Química",
    descricaoIcone:
      "Representa a conclusão do eixo de Física e Química do PPC de Engenharia de Computação.",
    codigoIcone: "FISICA_QUIMICA",
  },

  HUMANIDADES: {
    idIcone: 3,
    nomeIcone: "Humanidades e Ciências Sociais Aplicadas à Engenharia",
    descricaoIcone:
      "Representa a conclusão do eixo de Humanidades e Ciências Sociais Aplicadas à Engenharia.",
    codigoIcone: "HUMANIDADES",
  },

  ELETRICIDADE: {
    idIcone: 4,
    nomeIcone: "Eletricidade",
    descricaoIcone:
      "Representa a conclusão do eixo de Eletricidade do PPC de Engenharia de Computação.",
    codigoIcone: "ELETRICIDADE",
  },

  ELETRONICA: {
    idIcone: 5,
    nomeIcone: "Eletrônica",
    descricaoIcone:
      "Representa a conclusão do eixo de Eletrônica do PPC de Engenharia de Computação.",
    codigoIcone: "ELETRONICA",
  },

  CONTROLE_PROCESSOS: {
    idIcone: 6,
    nomeIcone: "Controle de Processos",
    descricaoIcone:
      "Representa a conclusão do eixo de Controle de Processos do PPC de Engenharia de Computação.",
    codigoIcone: "CONTROLE_PROCESSOS",
  },

  PRATICA_PROFISSIONAL: {
    idIcone: 7,
    nomeIcone: "Prática Profissional e Integração Curricular",
    descricaoIcone:
      "Representa a conclusão do eixo de Prática Profissional e Integração Curricular.",
    codigoIcone: "PRATICA_PROFISSIONAL",
  },

  FUNDAMENTOS_COMP: {
    idIcone: 8,
    nomeIcone: "Fundamentos de Engenharia de Computação",
    descricaoIcone:
      "Representa a conclusão do eixo de Fundamentos de Engenharia de Computação.",
    codigoIcone: "FUNDAMENTOS_COMP",
  },

  ENG_SOFTWARE_BD: {
    idIcone: 9,
    nomeIcone: "Engenharia de Software e Banco de Dados",
    descricaoIcone:
      "Representa a conclusão do eixo de Engenharia de Software e Banco de Dados.",
    codigoIcone: "ENG_SOFTWARE_BD",
  },

  REDES_SD: {
    idIcone: 10,
    nomeIcone: "Redes e Sistemas Distribuídos",
    descricaoIcone:
      "Representa a conclusão do eixo de Redes e Sistemas Distribuídos.",
    codigoIcone: "REDES_SD",
  },

  SISTEMAS_INTELIGENTES: {
    idIcone: 11,
    nomeIcone: "Sistemas Inteligentes",
    descricaoIcone:
      "Representa a conclusão do eixo de Sistemas Inteligentes do PPC de Engenharia de Computação.",
    codigoIcone: "SISTEMAS_INTELIGENTES",
  },
};

function unwrap(response) {
  return response?.dados || response;
}

function getMockIconesSalvos() {
  const raw = localStorage.getItem(MOCK_STORAGE_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMockIcones(icones) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(icones));
}

function montarIconesDoGradment() {
  return MOCK_GRADMENT_RESPONSE.eixosFinalizados
    .map((eixo) => ICONES_CATALOGO[eixo.codigo])
    .filter(Boolean)
    .map((icone) => ({
      ...icone,
      dataConquistaIcone: new Date().toISOString(),
    }));
}

export async function listMyIcons() {
  if (MOCK_GRADMENT_ICONES) {
    return getMockIconesSalvos();
  }

  const response = await apiFetch("/icone/meus");
  return unwrap(response);
}

export async function listUserIcons(idUsuario) {
  if (MOCK_GRADMENT_ICONES) {
    return getMockIconesSalvos();
  }

  const response = await apiFetch(`/icone/usuario/${idUsuario}`);
  return unwrap(response);
}

export async function importarIconesDoGradment() {
  if (MOCK_GRADMENT_ICONES) {
    const iconesAtuais = getMockIconesSalvos();
    const codigosAtuais = new Set(
      iconesAtuais.map((icone) => icone.codigoIcone)
    );

    const iconesVindosDoGradment = montarIconesDoGradment();

    const adicionados = iconesVindosDoGradment.filter(
      (icone) => !codigosAtuais.has(icone.codigoIcone)
    );

    const duplicados = iconesVindosDoGradment
      .filter((icone) => codigosAtuais.has(icone.codigoIcone))
      .map((icone) => icone.nomeIcone);

    const iconesAtualizados = [...iconesAtuais, ...adicionados];

    saveMockIcones(iconesAtualizados);

    return {
      adicionados,
      duplicados,
      ignorados: [],
      gradment: MOCK_GRADMENT_RESPONSE,
    };
  }

  const response = await apiFetch("/icone/importar", {
    method: "POST",
  });

  return unwrap(response);
}