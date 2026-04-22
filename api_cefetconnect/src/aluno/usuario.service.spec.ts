import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service.js';
import { describe, beforeEach, it, expect } from '@jest/globals'; 

describe('UsuarioService', () => { 
  let service: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

