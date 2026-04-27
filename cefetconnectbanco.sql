/* Lógico_1: */

CREATE TABLE Usuario (
    matricula VARCHAR(11) PRIMARY KEY,
    nomeUsuario VARCHAR(255),
    email VARCHAR(255),
    senha VARCHAR(255)
);

CREATE TABLE Post (
    idPost VARCHAR(255) PRIMARY KEY,
    dataHoraPublicacao datetime,
    arquivo VARCHAR(255),
    fk_Comunidade_idComunidade VARCHAR(255),
    fk_Usuario_matricula VARCHAR(255),
    fk_Evento_idEvento VARCHAR(255)
);

CREATE TABLE Comunidade (
    idComunidade VARCHAR(255) PRIMARY KEY,
    nomeComunidade VARCHAR(255),
    descricaoComunidade VARCHAR(255)
);

CREATE TABLE Evento (
    idEvento VARCHAR(255) PRIMARY KEY,
    titulo VARCHAR(255),
    descricaoEvento VARCHAR(255),
    localEvento VARCHAR(255),
    status boolean,
    dataEvento datetime,
    fk_Usuario_matricula VARCHAR(255),
    fk_Comunidade_idComunidade VARCHAR(255)
);

CREATE TABLE comentario (
    texto VARCHAR(255),
    idComentario VARCHAR(255) PRIMARY KEY,
    dataHora datetime,
    fk_Usuario_matricula VARCHAR(255),
    fk_Post_idPost VARCHAR(255)
);

CREATE TABLE likePost (
    fk_Usuario_matricula VARCHAR(255),
    fk_Post_idPost VARCHAR(255)
);

CREATE TABLE participa (
    fk_Usuario_matricula VARCHAR(255),
    fk_Comunidade_idComunidade VARCHAR(255)
);

CREATE TABLE likeComentario (
    fk_Usuario_matricula VARCHAR(255),
    fk_comentario_idComentario VARCHAR(255)
);
 
ALTER TABLE Post ADD CONSTRAINT FK_Post_2
    FOREIGN KEY (fk_Comunidade_idComunidade)
    REFERENCES Comunidade (idComunidade)
    ON DELETE SET NULL;
 
ALTER TABLE Post ADD CONSTRAINT FK_Post_3
    FOREIGN KEY (fk_Usuario_matricula)
    REFERENCES Usuario (matricula)
    ON DELETE CASCADE;
 
ALTER TABLE Post ADD CONSTRAINT FK_Post_4
    FOREIGN KEY (fk_Evento_idEvento)
    REFERENCES Evento (idEvento)
    ON DELETE SET NULL;
 
ALTER TABLE Evento ADD CONSTRAINT FK_Evento_2
    FOREIGN KEY (fk_Usuario_matricula)
    REFERENCES Usuario (matricula)
    ON DELETE CASCADE;
 
ALTER TABLE Evento ADD CONSTRAINT FK_Evento_3
    FOREIGN KEY (fk_Comunidade_idComunidade)
    REFERENCES Comunidade (idComunidade)
    ON DELETE SET NULL;
 
ALTER TABLE comentario ADD CONSTRAINT FK_comentario_2
    FOREIGN KEY (fk_Usuario_matricula)
    REFERENCES Usuario (matricula)
    ON DELETE CASCADE;
 
ALTER TABLE comentario ADD CONSTRAINT FK_comentario_3
    FOREIGN KEY (fk_Post_idPost)
    REFERENCES Post (idPost)
    ON DELETE CASCADE;
 
ALTER TABLE likePost ADD CONSTRAINT FK_likePost_1
    FOREIGN KEY (fk_Usuario_matricula)
    REFERENCES Usuario (matricula)
    ON DELETE SET NULL;
 
ALTER TABLE likePost ADD CONSTRAINT FK_likePost_2
    FOREIGN KEY (fk_Post_idPost)
    REFERENCES Post (idPost)
    ON DELETE SET NULL;
 
ALTER TABLE participa ADD CONSTRAINT FK_participa_1
    FOREIGN KEY (fk_Usuario_matricula)
    REFERENCES Usuario (matricula)
    ON DELETE SET NULL;
 
ALTER TABLE participa ADD CONSTRAINT FK_participa_2
    FOREIGN KEY (fk_Comunidade_idComunidade)
    REFERENCES Comunidade (idComunidade)
    ON DELETE SET NULL;
 
ALTER TABLE likeComentario ADD CONSTRAINT FK_likeComentario_1
    FOREIGN KEY (fk_Usuario_matricula)
    REFERENCES Usuario (matricula)
    ON DELETE SET NULL;
 
ALTER TABLE likeComentario ADD CONSTRAINT FK_likeComentario_2
    FOREIGN KEY (fk_comentario_idComentario)
    REFERENCES comentario (idComentario)
    ON DELETE SET NULL;
    
