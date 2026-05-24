import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePinDto } from './dto/create-pin.dto';
import { UpdatePinDto } from './dto/update-pin.dto';
import { ImportarPinsDto } from './dto/importar-pins.dto';
import { SugerirPinsDto } from './dto/sugerir-pins.dto';
import { Pin, OrigemPin } from '../entities/pin.entity';
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
  ) {}

  private toDto(pp: PossuiPin) {
    return { id: pp.id, idPin: pp.pin.idPin, nomePin: pp.pin.nomePin, origem: pp.origem };
  }

  private async findOrCreatePin(nomePin: string): Promise<Pin> {
    let pin = await this.pinRepository.findOne({ where: { nomePin } });
    if (!pin) {
      pin = await this.pinRepository.save(this.pinRepository.create({ nomePin }));
    }
    return pin;
  }

  async create(dto: CreatePinDto, idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);

    const pin = await this.findOrCreatePin(dto.nomePin);

    const existente = await this.possuiPinRepository.findOne({
      where: { pin: { idPin: pin.idPin }, usuario: { idUsuario } },
    });
    if (existente) throw new ConflictException(ErrorMessages.EPIN00003.mensagem);

    const saved = await this.possuiPinRepository.save(
      this.possuiPinRepository.create({ pin, usuario, origem: dto.origem ?? OrigemPin.MANUAL }),
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
      if (nomesExistentes.has(nomePin.toLowerCase())) {
        duplicados.push(nomePin);
      } else {
        const pin = await this.findOrCreatePin(nomePin);
        const saved = await this.possuiPinRepository.save(
          this.possuiPinRepository.create({ pin, usuario, origem: OrigemPin.GRADMENT }),
        );
        adicionados.push(this.toDto(saved));
        nomesExistentes.add(nomePin.toLowerCase());
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

    return {
      sugestoes: dto.disciplinas.filter((d) => !nomesExistentes.has(d.toLowerCase())),
      jaAdicionados: dto.disciplinas.filter((d) => nomesExistentes.has(d.toLowerCase())),
    };
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
      comunidades: pin.comunidades?.map((c) => ({
        idComunidade: c.idComunidade,
        nomeComunidade: c.nomeComunidade,
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

    return pin.comunidades?.map((c) => ({
      idComunidade: c.idComunidade,
      nomeComunidade: c.nomeComunidade,
      descricaoComunidade: c.descricaoComunidade,
    })) ?? [];
  }

  async adicionarComunidade(idPin: string, idComunidade: string) {
    const pin = await this.pinRepository.findOne({
      where: { idPin },
      relations: ['comunidades'],
    });
    if (!pin) throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);

    const comunidade = await this.comunidadeRepository.findOne({ where: { idComunidade } });
    if (!comunidade) throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);

    const jaRelacionado = pin.comunidades?.some((c) => c.idComunidade === idComunidade);
    if (jaRelacionado) throw new ConflictException(ErrorMessages.EPIN00004.mensagem);

    pin.comunidades = [...(pin.comunidades ?? []), comunidade];
    await this.pinRepository.save(pin);
    return { idPin, idComunidade };
  }

  async removerComunidade(idPin: string, idComunidade: string) {
    const pin = await this.pinRepository.findOne({
      where: { idPin },
      relations: ['comunidades'],
    });
    if (!pin) throw new NotFoundException(ErrorMessages.EPIN00001.mensagem);

    const tamanhoOriginal = pin.comunidades?.length ?? 0;
    pin.comunidades = pin.comunidades?.filter((c) => c.idComunidade !== idComunidade) ?? [];

    if (pin.comunidades.length === tamanhoOriginal)
      throw new NotFoundException(ErrorMessages.EPIN00005.mensagem);

    await this.pinRepository.save(pin);
    return { removido: true, idPin, idComunidade };
  }
}
