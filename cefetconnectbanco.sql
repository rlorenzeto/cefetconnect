-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: cefetconnect
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
  `idComentario` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `texto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataHora` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fk_Usuario_matricula` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_Post_idPost` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idComentario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentario`
--

LOCK TABLES `comentario` WRITE;
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comunidade`
--

DROP TABLE IF EXISTS `comunidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comunidade` (
  `idComunidade` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomeComunidade` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricaoComunidade` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idComunidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comunidade`
--

LOCK TABLES `comunidade` WRITE;
/*!40000 ALTER TABLE `comunidade` DISABLE KEYS */;
/*!40000 ALTER TABLE `comunidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `idEvento` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricaoEvento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localEvento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `dataEvento` datetime NOT NULL,
  `fk_Usuario_matricula` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_Comunidade_idComunidade` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idEvento`),
  KEY `FK_046fe41412f42d1b232028a2829` (`fk_Usuario_matricula`),
  KEY `FK_8375b968ce8ad6dbd0bb9a2c888` (`fk_Comunidade_idComunidade`),
  CONSTRAINT `FK_046fe41412f42d1b232028a2829` FOREIGN KEY (`fk_Usuario_matricula`) REFERENCES `usuario` (`matricula`) ON DELETE CASCADE,
  CONSTRAINT `FK_8375b968ce8ad6dbd0bb9a2c888` FOREIGN KEY (`fk_Comunidade_idComunidade`) REFERENCES `comunidade` (`idComunidade`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likecomentario`
--

DROP TABLE IF EXISTS `likecomentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likecomentario` (
  `usuarioMatricula` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comentarioIdComentario` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`usuarioMatricula`,`comentarioIdComentario`),
  KEY `IDX_cd5c1d8fa44144a261e44b8852` (`usuarioMatricula`),
  KEY `IDX_6fcf71f3daeda1329ad756ccd3` (`comentarioIdComentario`),
  CONSTRAINT `FK_6fcf71f3daeda1329ad756ccd3e` FOREIGN KEY (`comentarioIdComentario`) REFERENCES `comentario` (`idComentario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cd5c1d8fa44144a261e44b88522` FOREIGN KEY (`usuarioMatricula`) REFERENCES `usuario` (`matricula`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likecomentario`
--

LOCK TABLES `likecomentario` WRITE;
/*!40000 ALTER TABLE `likecomentario` DISABLE KEYS */;
/*!40000 ALTER TABLE `likecomentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likepost`
--

DROP TABLE IF EXISTS `likepost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likepost` (
  `usuarioMatricula` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postIdPost` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`usuarioMatricula`,`postIdPost`),
  KEY `IDX_1f575723650968361f7e2fc8c2` (`usuarioMatricula`),
  KEY `IDX_a9d217595e0b98dd8a1c8a116b` (`postIdPost`),
  CONSTRAINT `FK_1f575723650968361f7e2fc8c25` FOREIGN KEY (`usuarioMatricula`) REFERENCES `usuario` (`matricula`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_a9d217595e0b98dd8a1c8a116bc` FOREIGN KEY (`postIdPost`) REFERENCES `post` (`idPost`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likepost`
--

LOCK TABLES `likepost` WRITE;
/*!40000 ALTER TABLE `likepost` DISABLE KEYS */;
/*!40000 ALTER TABLE `likepost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participa`
--

DROP TABLE IF EXISTS `participa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participa` (
  `usuarioMatricula` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comunidadeIdComunidade` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`usuarioMatricula`,`comunidadeIdComunidade`),
  KEY `IDX_fca79952a98fda6eee8ec27a84` (`usuarioMatricula`),
  KEY `IDX_1cbda5d72d09c4fc7dbacae386` (`comunidadeIdComunidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participa`
--

LOCK TABLES `participa` WRITE;
/*!40000 ALTER TABLE `participa` DISABLE KEYS */;
/*!40000 ALTER TABLE `participa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `idPost` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataHoraPublicacao` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `arquivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_Comunidade_idComunidade` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_Usuario_matricula` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_Evento_idEvento` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idPost`),
  KEY `FK_cc88234054dcb2f8ecf09983854` (`fk_Comunidade_idComunidade`),
  KEY `FK_7c710583e68bb7a5b64d3428147` (`fk_Usuario_matricula`),
  KEY `FK_bc59ce85a480a88396cf3eb2382` (`fk_Evento_idEvento`),
  CONSTRAINT `FK_7c710583e68bb7a5b64d3428147` FOREIGN KEY (`fk_Usuario_matricula`) REFERENCES `usuario` (`matricula`) ON DELETE CASCADE,
  CONSTRAINT `FK_bc59ce85a480a88396cf3eb2382` FOREIGN KEY (`fk_Evento_idEvento`) REFERENCES `evento` (`idEvento`) ON DELETE SET NULL,
  CONSTRAINT `FK_cc88234054dcb2f8ecf09983854` FOREIGN KEY (`fk_Comunidade_idComunidade`) REFERENCES `comunidade` (`idComunidade`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `matricula` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomeUsuario` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fotoUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biografia` text COLLATE utf8mb4_unicode_ci,
  `emailVerificado` tinyint(1) NOT NULL DEFAULT '0',
  `codigoVerificacao` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`matricula`),
  UNIQUE KEY `IDX_c2591f33cb2c9e689e241dda91` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('20240000001','Lucas Silva','lucas.silva@aluno.cefetmg.br','$2b$10$R5MPsdOug4UT7gy48cN.ROiGCUMPXG2LFceoU9KUfghd9ATkVi2le',NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-04  8:19:32
