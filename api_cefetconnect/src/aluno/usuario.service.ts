import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; //criptografar senhas
import { unlink } from 'fs/promises';
import { join } from 'path';

import { Usuario } from '../entities/usuario.entity.js';
import { Post } from '../entities/post.entity.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { EmailService } from '../email/email.service.js';
import { ErrorMessages } from '../common/constants/messages.errors.js';
import { SuccessMessages } from '../common/constants/messages.success.js';
import { AlterarEmailDto } from './dto/alterar-email.dto.js';
import { AlterarSenhaDto } from './dto/alterar-senha.dto.js';
import { PostService } from '../post/post.service.js';

//interage com o banco de dados através do Repository do TypeORM, e também por fazer coisas como criptografar a senha antes de salvar no banco, ou verificar se já existe um usuário com a mesma matrícula ou email.
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly emailService: EmailService,
    private readonly postService: PostService,
  ) {}

  private gerarCodigoVerificacao(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private validarDataNascimento(dataNascimento: string): string | null {
    if (!dataNascimento || !/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      return 'Digite uma data de nascimento válida.';
    }

    const [ano, mes, dia] = dataNascimento.split('-').map(Number);

    if (!ano || !mes || !dia) {
      return 'Digite uma data de nascimento válida.';
    }

    if (ano < 1930) {
      return 'Digite uma data de nascimento válida.';
    }

    const nascimento = new Date(ano, mes - 1, dia);

    const dataExiste =
      nascimento.getFullYear() === ano &&
      nascimento.getMonth() === mes - 1 &&
      nascimento.getDate() === dia;

    if (!dataExiste) {
      return 'Digite uma data de nascimento válida.';
    }

    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;

    const aniversarioJaPassou =
      hoje.getMonth() > mes - 1 ||
      (hoje.getMonth() === mes - 1 && hoje.getDate() >= dia);

    if (!aniversarioJaPassou) {
      idade -= 1;
    }

    if (idade < 18) {
      return 'Você deve ter pelo menos 18 anos.';
    }

    if (idade > 100) {
      return 'Digite uma data de nascimento válida.';
    }

    return null;
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<{
    idUsuario: number;
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
      idUsuario: usuarioSalvo.idUsuario,
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

  async findByTokenIntegracao(tokenIntegracao: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { tokenIntegracao },
    });
  }

  async verificarEmail(
    idUsuario: number,
    codigo: string,
  ): Promise<{
    mensagem: string,
    codigo: string
  }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
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

  async reenviarCodigo(idUsuario: number): Promise<{ mensagem: string, codigo: string }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
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
      select: ['nomeUsuario', 'biografia', 'fotoUrl'],
    });
  }

  //Essa função é usada para buscar usuários por nome (lupa do sistema)
  async buscarPorNome(nome: string): Promise<Pick<Usuario, 'nomeUsuario' | 'fotoUrl'>[]> {
    return await this.usuarioRepository.find({
      where: { nomeUsuario: Like(`%${nome}%`) },
      select: ['nomeUsuario', 'fotoUrl'],
    });
  }

  async buscarPorMatricula(matricula: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      idUsuario: usuario.idUsuario,
      matricula: usuario.matricula,
      email: usuario.email,
      emailVerificado: usuario.emailVerificado,
    };
  }

  async findOne(idUsuario: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    return usuario;
  }

  /*async findPerfil(matricula: string): Promise<Pick<Usuario, 'nomeUsuario' | 'fotoUrl' | 'biografia'>> {
    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
      select: ['nomeUsuario', 'fotoUrl', 'biografia'],
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    return usuario;
  }*/

  async findPerfilCompleto(
    idUsuario: number,
    idUsuarioLogado: number,
  ): Promise<any> {
    const isOwnProfile = Number(idUsuario) === Number(idUsuarioLogado);

    const selectPublico: (keyof Usuario)[] = [
      'idUsuario',
      'nomeUsuario',
      'fotoUrl',
      'biografia',
    ];

    const selectPrivado: (keyof Usuario)[] = [
      'email',
      'matricula',
      'dataNascimento',
      'aceitouTermos',
      'tokenIntegracao',
    ];

    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: isOwnProfile
        ? [...selectPublico, ...selectPrivado]
        : selectPublico,
      relations: ['posts'],
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const perfil: any = {
      idUsuario: usuario.idUsuario,
      nomeUsuario: usuario.nomeUsuario,
      fotoUrl: usuario.fotoUrl ?? null,
      biografia: usuario.biografia ?? null,
      posts: usuario.posts ?? [],
      totalPosts: usuario.posts?.length ?? 0,
      isOwnProfile,
    };

    if (isOwnProfile) {
      perfil.email = usuario.email;
      perfil.matricula = usuario.matricula;
      perfil.dataNascimento = usuario.dataNascimento ?? null;
      perfil.aceitouTermos = Boolean(usuario.aceitouTermos);
      perfil.tokenIntegracao = usuario.tokenIntegracao ?? null;
    }

    return perfil;
  }

  async update(
    idUsuario: number,
    updateUsuarioDto: UpdateUsuarioDto,
    fotoUrl?: Express.Multer.File,
  ): Promise<
    Pick<
      Usuario,
      | 'idUsuario'
      | 'matricula'
      | 'nomeUsuario'
      | 'biografia'
      | 'fotoUrl'
      | 'dataNascimento'
      | 'aceitouTermos'
    >
  > {
    const usuario = await this.findOne(idUsuario); // Garante que o usuário existe
    if ((updateUsuarioDto as any).aceitouTermos !== undefined) {
      (updateUsuarioDto as any).aceitouTermos =
        (updateUsuarioDto as any).aceitouTermos === true ||
        (updateUsuarioDto as any).aceitouTermos === 'true';
    }

    if ((updateUsuarioDto as any).aceitouTermos === false) {
      throw new BadRequestException(
        'Você precisa aceitar os termos para continuar usando o Cefet Connect.',
      );
    }

    if ((updateUsuarioDto as any).dataNascimento !== undefined) {
      const erroDataNascimento = this.validarDataNascimento(
        (updateUsuarioDto as any).dataNascimento,
      );

      if (erroDataNascimento) {
        throw new BadRequestException(erroDataNascimento);
      }
    }

    if (updateUsuarioDto.matricula && updateUsuarioDto.matricula !== usuario.matricula) {
      const existente = await this.usuarioRepository.findOne({ where: { matricula: updateUsuarioDto.matricula } });
      if (existente) throw new ConflictException(ErrorMessages.EUSR00002.mensagem);
    }

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
    const atualizado = await this.usuarioRepository.save(usuario);

    return {
      idUsuario: atualizado.idUsuario,
      matricula: atualizado.matricula,
      nomeUsuario: atualizado.nomeUsuario,
      biografia: atualizado.biografia,
      fotoUrl: atualizado.fotoUrl,
      dataNascimento: atualizado.dataNascimento,
      aceitouTermos: Boolean(atualizado.aceitouTermos),
    };
  }

  async remove(idUsuario: number): Promise<void> {
    const usuario = await this.findOne(idUsuario);
    await this.usuarioRepository.remove(usuario);
  }

  async alterarSenha(idUsuario: number, dto: AlterarSenhaDto): Promise<{ codigo: string; mensagem: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const senhaCorreta = await bcrypt.compare(dto.senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new BadRequestException(ErrorMessages.EUSR00010.mensagem);
    }

    const salt = await bcrypt.genSalt(10);
    usuario.senha = await bcrypt.hash(dto.novaSenha, salt);
    await this.usuarioRepository.save(usuario);

    return { codigo: 'SUSR00008', mensagem: SuccessMessages.SUSR00008.mensagem };
  }

  async alterarEmail(idUsuario: number, dto: AlterarEmailDto): Promise<{ codigo: string; mensagem: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const senhaCorreta = await bcrypt.compare(dto.senha, usuario.senha);
    if (!senhaCorreta) {
      throw new BadRequestException(ErrorMessages.EUSR00010.mensagem);
    }

    const emailEmUso = await this.usuarioRepository.findOne({ where: { email: dto.novoEmail } });
    if (emailEmUso) {
      throw new ConflictException(ErrorMessages.EUSR00011.mensagem);
    }

    const codigo = this.gerarCodigoVerificacao();
    usuario.email = dto.novoEmail;
    usuario.emailVerificado = false;
    usuario.codigoVerificacao = codigo;
    await this.usuarioRepository.save(usuario);

    await this.emailService.enviarCodigoVerificacao(usuario.email, usuario.nomeUsuario, codigo);

    return { codigo: 'SUSR00009', mensagem: SuccessMessages.SUSR00009.mensagem };
  }

  async esqueceuSenha(email: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const codigoRecuperacao = this.gerarCodigoVerificacao();
    usuario.codigoVerificacao = codigoRecuperacao;
    await this.usuarioRepository.save(usuario);

    await this.emailService.enviarCodigoRecuperacao(
      usuario.email,
      usuario.nomeUsuario,
      codigoRecuperacao,
    );

    return {
      codigo: 'SUSR00010',
      mensagem: SuccessMessages.SUSR00010.mensagem,
    };
  }

  async resetarSenha(
    email: string,
    codigo: string,
    novaSenha: string,
  ): Promise<{ codigo: string; mensagem: string }> {

    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    if (!usuario.codigoVerificacao || usuario.codigoVerificacao !== codigo) {
      throw new BadRequestException(ErrorMessages.EUSR00005.mensagem);
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

    usuario.senha = senhaCriptografada;
    usuario.codigoVerificacao = null;

    await this.usuarioRepository.save(usuario);

    return {
      codigo: 'SUSR00011',
      mensagem: SuccessMessages.SUSR00011.mensagem,
    };
  }

  async vincularGradMent(idUsuario: number, gradmentToken: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    usuario.tokenIntegracao = gradmentToken;
    await this.usuarioRepository.save(usuario);

    return {
      codigo: 'SUSR00012',
      mensagem: 'Conta do GradMent vinculada com sucesso.',
    };
  }
}
