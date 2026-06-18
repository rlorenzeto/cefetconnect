import { Injectable, NotFoundException, ForbiddenException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreatePinDto } from './dto/create-pin.dto';
import { UpdatePinDto } from './dto/update-pin.dto';
import { ImportarPinsDto } from './dto/importar-pins.dto';
import { SugerirPinsDto } from './dto/sugerir-pins.dto';
import { CategoriaPin, Pin, OrigemPin } from '../entities/pin.entity';
import { PossuiPin } from '../entities/possui-pin.entity';
import { Usuario } from '../entities/usuario.entity';
import { Comunidade } from '../entities/comunidade.entity';
import { ErrorMessages } from '../common/constants/messages.errors';

@Injectable()
export class PinService {
  constructor(
    @InjectRepository(Pin)
    private pinRepository: Repository<Pin>,
    @InjectRepository(PossuiPin)
    private possuiPinRepository: Repository<PossuiPin>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Comunidade)
    private comunidadeRepository: Repository<Comunidade>,
    private configService: ConfigService,
  ) {}

  private toDto(pp: PossuiPin) {
    return {
      idPin: pp.pin.idPin,
      nomePin: pp.pin.nomePin,
      categoriaPin: pp.pin.categoriaPin,
      origem: pp.origem,
    };
  }

  private async findOrCreatePin(
    nomePin: string,
    categoriaPin: CategoriaPin = CategoriaPin.DISCIPLINA,
  ): Promise<Pin> {
    const nomeFormatado = nomePin.trim();

    let pin = await this.pinRepository.findOne({
      where: { nomePin: nomeFormatado },
    });

    if (!pin) {
      pin = await this.pinRepository.save(
        this.pinRepository.create({
          nomePin: nomeFormatado,
          categoriaPin,
        }),
      );
    }
    return pin;
  }

  private async relacionarPinComComunidadesPorNome(pin: Pin) {
    const comunidades = await this.comunidadeRepository
      .createQueryBuilder('comunidade')
      .where('LOWER(TRIM(comunidade.nomeComunidade)) = LOWER(TRIM(:nomePin))', {
        nomePin: pin.nomePin,
      })
      .getMany();

    if (comunidades.length === 0) return;

    const pinComComunidades = await this.pinRepository.findOne({
      where: { idPin: pin.idPin },
      relations: ['comunidades'],
    });

    if (!pinComComunidades) return;

    const comunidadesAtuais = pinComComunidades.comunidades ?? [];

    const novasComunidades = comunidades.filter(
      (comunidade) =>
        !comunidadesAtuais.some(
          (atual) => atual.idComunidade === comunidade.idComunidade,
        ),
    );

    if (novasComunidades.length === 0) return;

    pinComComunidades.comunidades = [
      ...comunidadesAtuais,
      ...novasComunidades,
    ];

    await this.pinRepository.save(pinComComunidades);
  }

  async create(dto: CreatePinDto, idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);

    const pin = await this.findOrCreatePin(
      dto.nomePin,
      dto.categoriaPin ?? CategoriaPin.DISCIPLINA,
    );

    await this.relacionarPinComComunidadesPorNome(pin);

    const existente = await this.possuiPinRepository.findOne({
      where: { pin: { idPin: pin.idPin }, usuario: { idUsuario } },
    });
    if (existente) throw new ConflictException(ErrorMessages.EPIN00003.mensagem);

    const saved = await this.possuiPinRepository.save(
      this.possuiPinRepository.create({
        pin,
        usuario,
        origem: OrigemPin.MANUAL,
      }),
    );

    return this.toDto(saved);
  }

  async importar(dto: ImportarPinsDto, idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);

    const existentes = await this.possuiPinRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['pin'],
    });
    const nomesExistentes = new Set(existentes.map((pp) => pp.pin.nomePin.toLowerCase()));

    const adicionados: ReturnType<typeof this.toDto>[] = [];
    const duplicados: string[] = [];

    for (const nomePin of dto.pins) {
      const nomeFormatado = nomePin.trim();
      const chave = nomeFormatado.toLowerCase();

      if (nomesExistentes.has(chave)) {
        duplicados.push(nomeFormatado);
      } else {
        const pin = await this.findOrCreatePin(
          nomeFormatado,
          CategoriaPin.DISCIPLINA,
        );

        await this.relacionarPinComComunidadesPorNome(pin);

        const saved = await this.possuiPinRepository.save(
          this.possuiPinRepository.create({
            pin,
            usuario,
            origem: OrigemPin.GRADMENT,
          }),
        );

        adicionados.push(this.toDto(saved));
        nomesExistentes.add(chave);
      }
    }

    return { adicionados, duplicados };
  }

  async sugerir(dto: SugerirPinsDto, idUsuario: number) {
    const existentes = await this.possuiPinRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['pin'],
    });
    const nomesExistentes = new Set(existentes.map((pp) => pp.pin.nomePin.toLowerCase()));

    const disciplinasFormatadas = dto.disciplinas.map((disciplina) =>
      disciplina.trim(),
    );

    return {
      sugestoes: disciplinasFormatadas.filter(
        (disciplina) => !nomesExistentes.has(disciplina.toLowerCase()),
      ),
      jaAdicionados: disciplinasFormatadas.filter((disciplina) =>
        nomesExistentes.has(disciplina.toLowerCase()),
      ),
    };
  }

  async sugerirDoGradment(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);

    if (!usuario.tokenIntegracao) {
      throw new UnauthorizedException('Sua conta não está vinculada ao GradMent.');
    }

    const gradmentApiUrl = this.configService.get<string>('GRADMENT_API_URL', 'http://localhost:8080');

    let response;
    try {
      response = await fetch(`${gradmentApiUrl}/integracao/materias-aprovadas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${usuario.tokenIntegracao}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (e: any) {
      throw new Error('Falha na comunicação com o GradMent: ' + e.message);
    }

    const data = await response.json() as any;

    if (!response.ok || data.status !== 'sucesso') {
      throw new Error(data.erro || data.mensagem || 'Falha ao recuperar matérias do GradMent.');
    }

    const materiasAprovadas = data.dados?.materias_aprovadas || [];
    const disciplinas: string[] = materiasAprovadas.map((m: any) => m.nome);

    return this.sugerir({ disciplinas }, idUsuario);
  }

  async findByComunidade(idComunidade: string) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const pins = await this.pinRepository
      .createQueryBuilder('pin')
      .innerJoin('pin.comunidades', 'comunidade')
      .where('comunidade.idComunidade = :idComunidade', { idComunidade })
      .orderBy('pin.nomePin', 'ASC')
      .getMany();

    return pins.map((pin) => ({
      idPin: pin.idPin,
      nomePin: pin.nomePin,
      categoriaPin: pin.categoriaPin,
    }));
  }

  async findDisponiveis(search?: string) {
    const query = this.pinRepository
      .createQueryBuilder('pin')
      .orderBy('pin.nomePin', 'ASC');

    if (search?.trim()) {
      query.where('pin.nomePin LIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    const pins = await query.getMany();

    return pins.map((pin) => ({
      idPin: pin.idPin,
      nomePin: pin.nomePin,
      categoriaPin: pin.categoriaPin,
    }));
  }

  async findMeus(idUsuario: number) {
    const associacoes = await this.possuiPinRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['pin'],
    });
    return associacoes.map((pp) => this.toDto(pp));
  }

  async findByUsuario(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);

    const associacoes = await this.possuiPinRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['pin'],
    });
    return associacoes.map((pp) => this.toDto(pp));
  }

  async update(idPin: string, dto: UpdatePinDto, idUsuario: number) {
    const pin = await this.pinRepository.findOne({ where: { idPin } });
    if (!pin) throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);

    const associacao = await this.possuiPinRepository.findOne({
      where: { pin: { idPin }, usuario: { idUsuario } },
      relations: ['pin', 'usuario'],
    });
    if (!associacao) throw new ForbiddenException(ErrorMessages.EPIN00002.mensagem);

    if (dto.nomePin !== undefined) {
      const novoPin = await this.findOrCreatePin(dto.nomePin);
      if (novoPin.idPin !== associacao.pin.idPin) {
        const duplicado = await this.possuiPinRepository.findOne({
          where: { pin: { idPin: novoPin.idPin }, usuario: { idUsuario } },
        });
        if (duplicado) throw new ConflictException(ErrorMessages.EPIN00003.mensagem);
        associacao.pin = novoPin;
      }
    }

    const saved = await this.possuiPinRepository.save(associacao);
    return this.toDto(saved);
  }

  async remove(idPin: string, idUsuario: number) {
    const pin = await this.pinRepository.findOne({ where: { idPin } });
    if (!pin) throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);

    const associacao = await this.possuiPinRepository.findOne({
      where: { pin: { idPin }, usuario: { idUsuario } },
    });
    if (!associacao) throw new ForbiddenException(ErrorMessages.EPIN00002.mensagem);

    await this.possuiPinRepository.remove(associacao);
    return { removido: true, idPin };
  }

  async findDetalhes(idPin: string) {
    const pin = await this.pinRepository.findOne({
      where: { idPin },
      relations: ['comunidades'],
    });
    if (!pin) throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);

    const totalUsuarios = await this.possuiPinRepository.count({
      where: { pin: { idPin } },
    });

    return {
      idPin: pin.idPin,
      nomePin: pin.nomePin,
      totalUsuarios,
      comunidades:
        pin.comunidades?.map((c) => ({
          idComunidade: c.idComunidade,
          nomeComunidade: c.nomeComunidade,
          descricaoComunidade: c.descricaoComunidade,
          fotoUrlComunidade: c.fotoUrlComunidade,
        })) ?? [],
    };
  }

  async findUsuariosByPin(idPin: string) {
    const pin = await this.pinRepository.findOne({ where: { idPin } });
    if (!pin) throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);

    const associacoes = await this.possuiPinRepository.find({
      where: { pin: { idPin } },
      relations: ['usuario'],
    });

    return associacoes.map((pp) => ({
      idUsuario: pp.usuario.idUsuario,
      nomeUsuario: pp.usuario.nomeUsuario,
      fotoUrl: pp.usuario.fotoUrl ?? null,
      origem: pp.origem,
    }));
  }

  async findComunidadesByPin(idPin: string) {
    const pin = await this.pinRepository.findOne({
      where: { idPin },
      relations: ['comunidades'],
    });
    if (!pin) throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);

    return (
      pin.comunidades?.map((c) => ({
        idComunidade: c.idComunidade,
        nomeComunidade: c.nomeComunidade,
        descricaoComunidade: c.descricaoComunidade,
        fotoUrlComunidade: c.fotoUrlComunidade,
      })) ?? []
    );
  }

  async adicionarComunidade(
    idPin: string,
    idComunidade: string,
    idUsuario: number,
  ) {
    const pin = await this.pinRepository.findOne({
      where: { idPin },
      relations: ["comunidades"],
    });

    if (!pin) {
      throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);
    }

    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
      relations: ["criador"],
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const idCriador = comunidade.criador?.idUsuario;

    if (String(idCriador || "") !== String(idUsuario || "")) {
      throw new ForbiddenException(
        "Apenas o criador da comunidade pode adicionar pins.",
      );
    }

    const jaRelacionado = pin.comunidades?.some(
      (c) => c.idComunidade === idComunidade,
    );

    if (jaRelacionado) {
      throw new ConflictException(ErrorMessages.EPIN00004.mensagem);
    }

    pin.comunidades = [...(pin.comunidades ?? []), comunidade];

    await this.pinRepository.save(pin);

    return { idPin, idComunidade };
  }
  async removerComunidade(
    idPin: string,
    idComunidade: string,
    idUsuario: number,
  ) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
      relations: ["criador"],
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const idCriador = comunidade.criador?.idUsuario;

    if (String(idCriador || "") !== String(idUsuario || "")) {
      throw new ForbiddenException(
        "Apenas o criador da comunidade pode remover pins.",
      );
    }

    const pin = await this.pinRepository.findOne({
      where: { idPin },
      relations: ["comunidades"],
    });

    if (!pin) {
      throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);
    }

    const tamanhoOriginal = pin.comunidades?.length ?? 0;

    pin.comunidades =
      pin.comunidades?.filter((c) => c.idComunidade !== idComunidade) ?? [];

    if (pin.comunidades.length === tamanhoOriginal) {
      throw new NotFoundException(ErrorMessages.EPIN00005.mensagem);
    }

    await this.pinRepository.save(pin);

    return { removido: true, idPin, idComunidade };
  }
}
