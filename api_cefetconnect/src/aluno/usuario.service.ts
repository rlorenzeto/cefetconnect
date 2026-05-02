import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; //criptografar senhas
import { unlink } from 'fs/promises';
import { join } from 'path';

import { Usuario } from './entities/usuario.entity.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { EmailService } from '../email/email.service.js';
import { ErrorMessages } from '../common/constants/messages.errors.js';
import { SuccessMessages } from '../common/constants/messages.success.js';

//interage com o banco de dados através do Repository do TypeORM, e também por fazer coisas como criptografar a senha antes de salvar no banco, ou verificar se já existe um usuário com a mesma matrícula ou email.
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly emailService: EmailService,
  ) { }

  private gerarCodigoVerificacao(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<{
    matricula: string;
    nomeUsuario: string;
    email: string;
  }> {
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: [
        { matricula: createUsuarioDto.matricula },
        { email: createUsuarioDto.email },
      ],
    });

    if (usuarioExistente) {
      throw new ConflictException(ErrorMessages.EUSR00002.mensagem);
    }

    const sequenciaAleatoria = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(
      createUsuarioDto.senha,
      sequenciaAleatoria,
    );

    const codigo = this.gerarCodigoVerificacao();

    const novoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      senha: senhaCriptografada,
      emailVerificado: false,
      codigoVerificacao: codigo,
    });

    const usuarioSalvo = await this.usuarioRepository.save(novoUsuario);

    await this.emailService.enviarCodigoVerificacao(
      usuarioSalvo.email,
      usuarioSalvo.nomeUsuario,
      codigo,
    );

    return {
      matricula: usuarioSalvo.matricula,
      nomeUsuario: usuarioSalvo.nomeUsuario,
      email: usuarioSalvo.email,
    };
  }

  // p/ o login
  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
    });
  }

  async verificarEmail(
    matricula: string,
    codigo: string,
  ): Promise<{
    mensagem: string,
    codigo: string
  }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    if (usuario.emailVerificado) {
      throw new BadRequestException(ErrorMessages.EUSR00004.mensagem);
    }

    if (usuario.codigoVerificacao !== codigo) {
      throw new BadRequestException(ErrorMessages.EUSR00005.mensagem);
    }

    usuario.emailVerificado = true;
    usuario.codigoVerificacao = null;
    await this.usuarioRepository.save(usuario);

    return {
      codigo: 'SUSR00006',
      mensagem: SuccessMessages.SUSR00006.mensagem,
    };
  }

  async reenviarCodigo(matricula: string): Promise<{ mensagem: string, codigo: string }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    if (usuario.emailVerificado) {
      throw new BadRequestException(ErrorMessages.EUSR00004.mensagem);
    }

    const novoCodigo = this.gerarCodigoVerificacao();
    usuario.codigoVerificacao = novoCodigo;
    await this.usuarioRepository.save(usuario);

    await this.emailService.enviarCodigoVerificacao(
      usuario.email,
      usuario.nomeUsuario,
      novoCodigo,
    );

    return {
      codigo: 'SUSR00007',
      mensagem: SuccessMessages.SUSR00007.mensagem,
    };
  }

  async findAll() {
    return await this.usuarioRepository.find({
      select: ['matricula', 'nomeUsuario', 'email', 'emailVerificado', 'biografia'],
    });
  }

  async findOne(matricula: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
      select: [
        'matricula',
        'nomeUsuario',
        'email',
        'emailVerificado',
        'fotoUrl',
        'biografia',
      ],
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    return usuario;
  }

  async update(
    matricula: string,
    updateUsuarioDto: UpdateUsuarioDto,
    fotoUrl?: Express.Multer.File,
  ): Promise<Usuario> {
    const usuario = await this.findOne(matricula); // Garante que o usuário existe

    // Se a pessoa estiver tentando mudar a senha, precisamos criptografar a nova também
    if (updateUsuarioDto.senha) {
      const sequenciaAleatoria = await bcrypt.genSalt(10);
      updateUsuarioDto.senha = await bcrypt.hash(
        updateUsuarioDto.senha,
        sequenciaAleatoria,
      );
    }

    // Se uma nova foto de perfil foi enviada
    if (fotoUrl) {
      // Remove a foto antiga do disco, se existir
      if (usuario.fotoUrl) {
        const caminhoAntigo = join(process.cwd(), usuario.fotoUrl);
        await unlink(caminhoAntigo).catch(() => {
          // Ignora erro caso o arquivo já não exista no disco
        });
      }

      // Salva o caminho relativo da nova foto
      (updateUsuarioDto as any).fotoUrl = fotoUrl.path.replace(/\\/g, '/');
    }

    // Mescla os dados antigos com os novos e salva
    this.usuarioRepository.merge(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(matricula: string): Promise<void> {
    const usuario = await this.findOne(matricula);
    await this.usuarioRepository.remove(usuario);
  }
}
