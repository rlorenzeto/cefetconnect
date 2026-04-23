import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; //criptografar senhas

import { Usuario } from './entities/usuario.entity.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

//interage com o banco de dados através do Repository do TypeORM, e também por fazer coisas como criptografar a senha antes de salvar no banco, ou verificar se já existe um usuário com a mesma matrícula ou email.
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

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
      throw new ConflictException('Matrícula ou Email já cadastrados no sistema.');
    }

    const sequenciaAleatoria = await bcrypt.genSalt(10); //Gera uma sequência aleatória para fortalecer a criptografia da senha. O número 10 é o custo, ou seja, o número de vezes que a senha será processada para gerar o hash. 
    const senhaCriptografada = await bcrypt.hash(createUsuarioDto.senha, sequenciaAleatoria);

    const novoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      senha: senhaCriptografada,
    });

    const usuarioSalvo = await this.usuarioRepository.save(novoUsuario); //salva no banco
    
    // Remove a senha antes de retornar no response
    
    return {
      matricula: usuarioSalvo.matricula,
      nomeUsuario: usuarioSalvo.nomeUsuario,
      email: usuarioSalvo.email,
    } 
  }

  // p/ o login 
  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
    });
  }

  async findAll() {
    return await this.usuarioRepository.find({
      select: ['matricula', 'nomeUsuario', 'email'] 
    });
  }

  async findOne(matricula: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
      select: ['matricula', 'nomeUsuario', 'email'] 
    });

    if (!usuario) {
      throw new NotFoundException(`Estudante com matrícula ${matricula} não encontrado.`);
    }

    return usuario;
  }

  async update(matricula: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(matricula); // Garante que o usuário existe

    // Se a pessoa estiver tentando mudar a senha, precisamos criptografar a nova também
    if (updateUsuarioDto.senha) {
      const sequenciaAleatoria = await bcrypt.genSalt(10);
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, sequenciaAleatoria);
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
