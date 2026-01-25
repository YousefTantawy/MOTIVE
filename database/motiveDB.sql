CREATE DATABASE  IF NOT EXISTS `ecen424_db_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ecen424_db_project`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: motivedatabase.mysql.database.azure.com    Database: ecen424_db_project
-- ------------------------------------------------------
-- Server version	8.0.42-azure

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
-- Table structure for table `audit_log_details`
--

DROP TABLE IF EXISTS `audit_log_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log_details` (
  `detail_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_id` bigint unsigned NOT NULL,
  `field_name` varchar(50) NOT NULL,
  `old_value` text,
  `new_value` text,
  PRIMARY KEY (`detail_id`),
  KEY `log_id` (`log_id`),
  CONSTRAINT `audit_log_details_ibfk_1` FOREIGN KEY (`log_id`) REFERENCES `audit_logs` (`log_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log_details`
--

LOCK TABLES `audit_log_details` WRITE;
/*!40000 ALTER TABLE `audit_log_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_log_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `action_type` varchar(50) NOT NULL,
  `entity_affected` varchar(50) NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,4,'UPDATE','User','2',NULL,'2025-12-27 16:32:28');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authidentities`
--

DROP TABLE IF EXISTS `authidentities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authidentities` (
  `auth_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `provider` varchar(50) NOT NULL,
  `provider_key` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`auth_id`),
  UNIQUE KEY `provider` (`provider`,`provider_key`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `authidentities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authidentities`
--

LOCK TABLES `authidentities` WRITE;
/*!40000 ALTER TABLE `authidentities` DISABLE KEYS */;
INSERT INTO `authidentities` VALUES (1,1,'local','alice@example.com','hash_alice',NULL),(2,2,'google','google_bob_123',NULL,NULL),(3,3,'github','github_charlie_456',NULL,NULL),(4,4,'local','admin@example.com','hash_admin',NULL),(8,8,'Local','yousef@gmail.com','$2a$11$9oYHHkliUidmJWsECn5YhusHiYtN4e1PiSbxslvWs7si.qM1gDqeq',NULL),(10,10,'Local','omar.ashraf1@gmail.com','$2a$11$wwwfqkZKe/XmfIyGZUBf7eav3s8rbc1Zw/fLPUgao4bfff4bMVYw.',NULL),(13,13,'Local','ha@email.com','$2a$11$qsSOivnn2cU/71jcBMYJC.C46Hk2wio9gzfcZBL/vP35mPd4alHq2','2025-12-28 14:40:34'),(16,16,'Local','omar.ashraf11@gmail.com','$2a$11$h013ABIC6e09kpVp4sQ3re80eizkTlkDz/f7nL8yP8om.YP2Juu5e','2025-12-29 21:21:52'),(17,17,'Local','gmail@gmail.com','$2a$11$F4LI1FC7/fCXeF41lSAXA.BuGdmcNcpCiBXc/GAVUNCE5J0g2Xa9.','2025-12-29 21:35:19'),(18,18,'Local','Goe@gmail.com','$2a$11$hWNqvn/HkneyvM2DKf7gxO3RnMi34ZbwB8lcNvUfcrjFpyXUSQKt6','2025-12-30 00:47:34'),(20,20,'Local','dwaawdawd@gmail.com','$2a$11$Tn/gxHcgRzIG0612kLzFnuuWVjnD09dGmbTXZN0pTA2N.MImEx9By','2025-12-30 01:43:11'),(21,21,'Local','yarab@gmail.com','$2a$11$IcLwkDoluXiiRrSV1LYol.Puq8qp5WPaO4GIQiqBSd1nx.ZkFaIo2','2025-12-30 10:08:33'),(22,22,'Local','youseftantawy@gmail.com','$2a$11$YPvUNZTsxR3QeMRXOASAXe4lTadU4iZGkPJzx5Whdct3tkZqFf4iq','2025-12-30 10:50:23'),(23,23,'Local','besdw@gmail.com','$2a$11$I40QRVH/mYITmIADTaMHpu9jOOdUQkWtjHDET185jB/mn.BPKccPK','2025-12-30 20:04:42'),(24,24,'Local','omargharieb30@gmail.com','$2a$11$/eNsJsO/TUHA405fFrkPOuq67SuPHfgX/gE6LWgLdrf3BQj9WOcUu','2025-12-30 20:13:39'),(26,26,'Local','Oracle@gmail.com','$2a$11$KbV2z5jvXisNjScsmG1dnuht9aGNJ1s/DPbSFQY9O8WhU7oNp5TvS','2025-12-30 21:06:38'),(27,27,'Local','admin@gmail.com','$2a$11$bmtxvTAU6tT1o1JMUorcDuh0QmCzyIUQGggRcZnXpjtPf41FSTR/m','2025-12-30 22:26:10'),(28,28,'Local','lalalalala@gmail.com','$2a$11$MPYXSeG/G/7jLM3UJ0pcxudWgGFA6.JMuo1zEewdaDBJtSS3ecrci','2025-12-31 01:00:56'),(29,29,'Local','Goe_l@gmail.com','$2a$11$bLP9jhOY4BQkrPLB0rlkvu3C6HdVswkA18khPorbxY1j190UzYoLy','2025-12-31 01:00:57'),(30,30,'Local','instructor@gmail.com','$2a$11$W.pZUyzatusa.MUlVotak.06ITG5ZC3ng01RanOj9U6zYeo3J1D..','2025-12-31 10:15:18'),(31,31,'Local','student@gmail.com','$2a$11$W1r82VAWhSpsEnTROiT4y.L0FlbEz3nG5ik8KzWwhyn/Q5CT48JS.','2025-12-31 10:16:46');
/*!40000 ALTER TABLE `authidentities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `icon_class` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,NULL,'Development','fa-code'),(2,NULL,'Business','fa-briefcase'),(3,1,'Web Development','fa-globe'),(4,1,'Data Science','fa-database'),(5,1,'Mobile Apps',NULL),(6,1,'DevOps','fa-server'),(7,5,'Finance',NULL),(8,NULL,'IT & Software',NULL),(9,8,'Cyber Security',NULL),(10,8,'Cloud Computing',NULL),(11,NULL,'Design',NULL),(12,11,'Graphic Design',NULL),(13,11,'User Experience (UX)',NULL),(14,NULL,'Marketing',NULL),(15,14,'Digital Marketing',NULL),(16,14,'Social Media Marketing',NULL),(17,NULL,'Personal Development',NULL),(18,17,'Leadership',NULL),(19,NULL,'Photography',NULL),(20,19,'Video Editing',NULL),(21,5,'Entrepreneurship',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates` (
  `certificate_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `enrollment_id` bigint unsigned NOT NULL,
  `unique_code` varchar(50) NOT NULL,
  `issue_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `pdf_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`certificate_id`),
  UNIQUE KEY `enrollment_id` (`enrollment_id`),
  UNIQUE KEY `unique_code` (`unique_code`),
  CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates` VALUES (1,1,'CERT-BOB-001','2025-12-27 16:32:16',NULL);
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_categories`
--

DROP TABLE IF EXISTS `course_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_categories` (
  `classification_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`classification_id`),
  UNIQUE KEY `course_id` (`course_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `course_categories_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `course_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_categories`
--

LOCK TABLES `course_categories` WRITE;
/*!40000 ALTER TABLE `course_categories` DISABLE KEYS */;
INSERT INTO `course_categories` VALUES (1,1,3,'2025-12-27 16:44:50'),(2,2,4,'2025-12-27 16:44:50'),(3,3,6,'2025-12-27 16:48:38'),(5,44,3,'2025-12-27 16:54:05'),(6,6,3,'2025-12-27 16:54:05'),(7,21,3,'2025-12-27 16:54:05'),(8,17,3,'2025-12-27 16:54:05'),(9,22,3,'2025-12-27 16:54:05'),(10,4,3,'2025-12-27 16:54:05'),(11,18,3,'2025-12-27 16:54:05'),(12,7,3,'2025-12-27 16:54:05'),(13,19,3,'2025-12-27 16:54:05'),(14,5,3,'2025-12-27 16:54:05'),(20,53,4,'2025-12-27 16:54:05'),(21,9,4,'2025-12-27 16:54:05'),(22,15,4,'2025-12-27 16:54:05'),(23,8,4,'2025-12-27 16:54:05'),(24,14,4,'2025-12-27 16:54:05'),(27,47,6,'2025-12-27 16:54:06'),(28,10,6,'2025-12-27 16:54:06'),(29,12,6,'2025-12-27 16:54:06'),(30,51,6,'2025-12-27 16:54:06'),(31,11,6,'2025-12-27 16:54:06'),(32,49,6,'2025-12-27 16:54:06'),(34,45,6,'2025-12-27 16:54:06'),(35,52,6,'2025-12-27 16:54:06'),(36,50,6,'2025-12-27 16:54:06'),(37,16,6,'2025-12-27 16:54:06'),(38,46,6,'2025-12-27 16:54:06'),(39,48,6,'2025-12-27 16:54:06'),(42,32,1,'2025-12-27 16:54:06'),(43,29,1,'2025-12-27 16:54:06'),(44,30,1,'2025-12-27 16:54:06'),(45,25,1,'2025-12-27 16:54:06'),(46,23,1,'2025-12-27 16:54:06'),(47,31,1,'2025-12-27 16:54:06'),(48,26,1,'2025-12-27 16:54:06'),(49,20,1,'2025-12-27 16:54:06'),(50,24,1,'2025-12-27 16:54:06'),(51,27,1,'2025-12-27 16:54:06'),(52,28,1,'2025-12-27 16:54:06'),(53,33,1,'2025-12-27 16:54:06'),(57,36,2,'2025-12-27 16:54:06'),(58,37,2,'2025-12-27 16:54:06'),(59,41,2,'2025-12-27 16:54:06'),(60,35,2,'2025-12-27 16:54:06'),(61,43,2,'2025-12-27 16:54:06'),(62,38,2,'2025-12-27 16:54:06'),(63,42,2,'2025-12-27 16:54:06'),(64,40,2,'2025-12-27 16:54:06'),(65,39,2,'2025-12-27 16:54:06'),(66,34,2,'2025-12-27 16:54:06'),(72,7,6,'2025-12-27 16:59:27'),(73,12,3,'2025-12-27 16:59:27'),(74,18,6,'2025-12-27 16:59:27'),(75,40,3,'2025-12-27 16:59:27'),(76,8,1,'2025-12-27 16:59:27'),(77,10,4,'2025-12-27 16:59:27'),(78,39,1,'2025-12-27 16:59:27'),(79,29,6,'2025-12-27 16:59:27'),(80,35,3,'2025-12-27 16:59:27'),(81,14,3,'2025-12-27 16:59:28'),(82,54,1,'2025-12-27 17:00:07'),(83,54,2,'2025-12-27 17:00:07'),(84,54,3,'2025-12-27 17:00:07'),(85,54,6,'2025-12-27 17:00:07'),(89,55,1,'2025-12-27 17:00:07'),(90,55,4,'2025-12-27 17:00:07'),(91,55,6,'2025-12-27 17:00:07'),(92,56,1,'2025-12-27 17:00:07'),(93,56,2,'2025-12-27 17:00:07');
/*!40000 ALTER TABLE `course_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_descriptions`
--

DROP TABLE IF EXISTS `course_descriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_descriptions` (
  `description_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `full_text` text,
  PRIMARY KEY (`description_id`),
  UNIQUE KEY `course_id` (`course_id`),
  CONSTRAINT `course_descriptions_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_descriptions`
--

LOCK TABLES `course_descriptions` WRITE;
/*!40000 ALTER TABLE `course_descriptions` DISABLE KEYS */;
INSERT INTO `course_descriptions` VALUES (1,1,'Master GoF patterns in modern C#'),(2,2,'Learn Pandas and NumPy from scratch'),(3,3,'Comprehensive guide to Docker Mastery. Learn from industry experts.'),(4,4,'Comprehensive guide to Mastering React 18. Learn from industry experts.'),(5,5,'Comprehensive guide to Vue.js 3 Fundamentals. Learn from industry experts.'),(6,6,'Comprehensive guide to Angular for Enterprise. Learn from industry experts.'),(7,7,'Comprehensive guide to Node.js Microservices. Learn from industry experts.'),(8,8,'Comprehensive guide to Python Machine Learning. Learn from industry experts.'),(9,9,'Comprehensive guide to Data Visualization with D3. Learn from industry experts.'),(10,10,'Comprehensive guide to AWS Certified Solutions Architect. Learn from industry experts.'),(11,11,'Comprehensive guide to Google Cloud Essentials. Learn from industry experts.'),(12,12,'Comprehensive guide to Docker for Beginners. Learn from industry experts.'),(14,14,'Comprehensive guide to SQL Database Mastery. Learn from industry experts.'),(15,15,'Comprehensive guide to MongoDB Aggregation Framework. Learn from industry experts.'),(16,16,'Comprehensive guide to Redis for Caching. Learn from industry experts.'),(17,17,'Comprehensive guide to GraphQL API Development. Learn from industry experts.'),(18,18,'Comprehensive guide to Next.js Full Stack. Learn from industry experts.'),(19,19,'Comprehensive guide to SvelteKit: The Complete Guide. Learn from industry experts.'),(20,20,'Comprehensive guide to Rust Programming for Beginners. Learn from industry experts.'),(21,21,'Comprehensive guide to Go Language Bootcamp. Learn from industry experts.'),(22,22,'Comprehensive guide to Java Spring Boot Microservices. Learn from industry experts.'),(23,23,'Comprehensive guide to Kotlin for Android Dev. Learn from industry experts.'),(24,24,'Comprehensive guide to SwiftUI for iOS 17. Learn from industry experts.'),(25,25,'Comprehensive guide to Flutter Cross-Platform Apps. Learn from industry experts.'),(26,26,'Comprehensive guide to React Native CLI Mastery. Learn from industry experts.'),(27,27,'Comprehensive guide to Unity Game Development 2D. Learn from industry experts.'),(28,28,'Comprehensive guide to Unreal Engine 5 Blueprints. Learn from industry experts.'),(29,29,'Comprehensive guide to Cybersecurity Fundamentals. Learn from industry experts.'),(30,30,'Comprehensive guide to Ethical Hacking 101. Learn from industry experts.'),(31,31,'Comprehensive guide to Penetration Testing with Kali. Learn from industry experts.'),(32,32,'Comprehensive guide to Blockchain & Solidity. Learn from industry experts.'),(33,33,'Comprehensive guide to Web3 DApp Development. Learn from industry experts.'),(34,34,'Comprehensive guide to UI/UX Design Principles. Learn from industry experts.'),(35,35,'Comprehensive guide to Figma Masterclass. Learn from industry experts.'),(36,36,'Comprehensive guide to Adobe XD Prototyping. Learn from industry experts.'),(37,37,'Comprehensive guide to Agile & Scrum Methodologies. Learn from industry experts.'),(38,38,'Comprehensive guide to JIRA Project Management. Learn from industry experts.'),(39,39,'Comprehensive guide to Technical Writing 101. Learn from industry experts.'),(40,40,'Comprehensive guide to SEO for Developers. Learn from industry experts.'),(41,41,'Comprehensive guide to Digital Marketing Basics. Learn from industry experts.'),(42,42,'Comprehensive guide to Public Speaking for Tech. Learn from industry experts.'),(43,43,'Comprehensive guide to Freelancing Guide for Devs. Learn from industry experts.'),(44,44,'Comprehensive guide to Advanced Git & GitHub. Learn from industry experts.'),(45,45,'Comprehensive guide to Linux Command Line. Learn from industry experts.'),(46,46,'Comprehensive guide to Shell Scripting Automation. Learn from industry experts.'),(47,47,'Comprehensive guide to Ansible Configuration Mgmt. Learn from industry experts.'),(48,48,'Comprehensive guide to Terraform Infrastructure as Code. Learn from industry experts.'),(49,49,'Comprehensive guide to Jenkins CI/CD Pipelines. Learn from industry experts.'),(50,50,'Comprehensive guide to Prometheus & Grafana Monitoring. Learn from industry experts.'),(51,51,'Comprehensive guide to ELK Stack Logging. Learn from industry experts.'),(52,52,'Comprehensive guide to Nginx Web Server Admin. Learn from industry experts.'),(53,53,'Comprehensive guide to Apache Kafka Streaming. Learn from industry experts.'),(66,56,'In-depth training for Agile Business Transformation'),(67,55,'In-depth training for MLOps: From Model to Production'),(68,54,'In-depth training for The Complete Tech Lead Guide');
/*!40000 ALTER TABLE `course_descriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_instructors`
--

DROP TABLE IF EXISTS `course_instructors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_instructors` (
  `assignment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `is_primary_author` tinyint(1) DEFAULT '0',
  `revenue_share` decimal(5,2) DEFAULT '0.00',
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignment_id`),
  UNIQUE KEY `course_id` (`course_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `course_instructors_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `course_instructors_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_instructors`
--

LOCK TABLES `course_instructors` WRITE;
/*!40000 ALTER TABLE `course_instructors` DISABLE KEYS */;
INSERT INTO `course_instructors` VALUES (1,1,1,1,70.00,'2025-12-27 16:30:38'),(2,36,1,1,70.00,'2025-12-27 16:54:06'),(3,44,1,1,70.00,'2025-12-27 16:54:06'),(4,37,1,1,70.00,'2025-12-27 16:54:06'),(5,6,1,1,70.00,'2025-12-27 16:54:06'),(6,47,1,1,70.00,'2025-12-27 16:54:06'),(7,53,1,1,70.00,'2025-12-27 16:54:06'),(8,10,1,1,70.00,'2025-12-27 16:54:06'),(9,32,1,1,70.00,'2025-12-27 16:54:06'),(10,29,1,1,70.00,'2025-12-27 16:54:06'),(11,9,1,1,70.00,'2025-12-27 16:54:06'),(12,41,1,1,70.00,'2025-12-27 16:54:06'),(13,12,1,1,70.00,'2025-12-27 16:54:06'),(14,3,1,1,70.00,'2025-12-27 16:54:06'),(15,51,1,1,70.00,'2025-12-27 16:54:06'),(16,30,1,1,70.00,'2025-12-27 16:54:06'),(17,35,1,1,70.00,'2025-12-27 16:54:06'),(18,25,1,1,70.00,'2025-12-27 16:54:06'),(19,43,1,1,70.00,'2025-12-27 16:54:06'),(20,11,1,1,70.00,'2025-12-27 16:54:06'),(21,21,1,1,70.00,'2025-12-27 16:54:06'),(22,17,1,1,70.00,'2025-12-27 16:54:06'),(23,22,1,1,70.00,'2025-12-27 16:54:06'),(24,49,1,1,70.00,'2025-12-27 16:54:06'),(25,38,1,1,70.00,'2025-12-27 16:54:06'),(26,23,1,1,70.00,'2025-12-27 16:54:06'),(28,45,1,1,70.00,'2025-12-27 16:54:06'),(29,4,1,1,70.00,'2025-12-27 16:54:06'),(30,15,1,1,70.00,'2025-12-27 16:54:06'),(31,18,1,1,70.00,'2025-12-27 16:54:06'),(32,52,1,1,70.00,'2025-12-27 16:54:06'),(33,7,1,1,70.00,'2025-12-27 16:54:06'),(34,31,1,1,70.00,'2025-12-27 16:54:06'),(35,50,1,1,70.00,'2025-12-27 16:54:06'),(36,42,1,1,70.00,'2025-12-27 16:54:06'),(37,2,1,1,70.00,'2025-12-27 16:54:06'),(38,8,1,1,70.00,'2025-12-27 16:54:06'),(39,26,1,1,70.00,'2025-12-27 16:54:06'),(40,16,1,1,70.00,'2025-12-27 16:54:06'),(41,20,1,1,70.00,'2025-12-27 16:54:06'),(42,40,1,1,70.00,'2025-12-27 16:54:06'),(43,46,1,1,70.00,'2025-12-27 16:54:06'),(44,14,1,1,70.00,'2025-12-27 16:54:06'),(45,19,1,1,70.00,'2025-12-27 16:54:06'),(46,24,1,1,70.00,'2025-12-27 16:54:06'),(47,39,1,1,70.00,'2025-12-27 16:54:06'),(48,48,1,1,70.00,'2025-12-27 16:54:06'),(49,34,1,1,70.00,'2025-12-27 16:54:06'),(50,27,1,1,70.00,'2025-12-27 16:54:06'),(51,28,1,1,70.00,'2025-12-27 16:54:06'),(52,5,1,1,70.00,'2025-12-27 16:54:06'),(53,33,1,1,70.00,'2025-12-27 16:54:06'),(65,56,1,1,70.00,'2025-12-27 17:00:07'),(66,55,1,1,70.00,'2025-12-27 17:00:07'),(67,54,1,1,70.00,'2025-12-27 17:00:07');
/*!40000 ALTER TABLE `course_instructors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_objectives`
--

DROP TABLE IF EXISTS `course_objectives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_objectives` (
  `objective_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description_id` bigint unsigned NOT NULL,
  `objective_text` varchar(255) NOT NULL,
  PRIMARY KEY (`objective_id`),
  KEY `description_id` (`description_id`),
  CONSTRAINT `course_objectives_ibfk_1` FOREIGN KEY (`description_id`) REFERENCES `course_descriptions` (`description_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_objectives`
--

LOCK TABLES `course_objectives` WRITE;
/*!40000 ALTER TABLE `course_objectives` DISABLE KEYS */;
INSERT INTO `course_objectives` VALUES (1,1,'Implement core design patterns'),(2,3,'Build real-world projects'),(3,4,'Build real-world projects'),(4,5,'Build real-world projects'),(5,6,'Build real-world projects'),(6,7,'Build real-world projects'),(7,8,'Build real-world projects'),(8,9,'Build real-world projects'),(9,10,'Build real-world projects'),(10,11,'Build real-world projects'),(11,12,'Build real-world projects'),(13,14,'Build real-world projects'),(14,15,'Build real-world projects'),(15,16,'Build real-world projects'),(16,17,'Build real-world projects'),(17,18,'Build real-world projects'),(18,19,'Build real-world projects'),(19,20,'Build real-world projects'),(20,21,'Build real-world projects'),(21,22,'Build real-world projects'),(22,23,'Build real-world projects'),(23,24,'Build real-world projects'),(24,25,'Build real-world projects'),(25,26,'Build real-world projects'),(26,27,'Build real-world projects'),(27,28,'Build real-world projects'),(28,29,'Build real-world projects'),(29,30,'Build real-world projects'),(30,31,'Build real-world projects'),(31,32,'Build real-world projects'),(32,33,'Build real-world projects'),(33,34,'Build real-world projects'),(34,35,'Build real-world projects'),(35,36,'Build real-world projects'),(36,37,'Build real-world projects'),(37,38,'Build real-world projects'),(38,39,'Build real-world projects'),(39,40,'Build real-world projects'),(40,41,'Build real-world projects'),(41,42,'Build real-world projects'),(42,43,'Build real-world projects'),(43,44,'Build real-world projects'),(44,45,'Build real-world projects'),(45,46,'Build real-world projects'),(46,47,'Build real-world projects'),(47,48,'Build real-world projects'),(48,49,'Build real-world projects'),(49,50,'Build real-world projects'),(50,51,'Build real-world projects'),(51,52,'Build real-world projects'),(52,53,'Build real-world projects');
/*!40000 ALTER TABLE `course_objectives` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_requirements`
--

DROP TABLE IF EXISTS `course_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_requirements` (
  `requirement_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description_id` bigint unsigned NOT NULL,
  `requirement_text` varchar(255) NOT NULL,
  PRIMARY KEY (`requirement_id`),
  KEY `description_id` (`description_id`),
  CONSTRAINT `course_requirements_ibfk_1` FOREIGN KEY (`description_id`) REFERENCES `course_descriptions` (`description_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_requirements`
--

LOCK TABLES `course_requirements` WRITE;
/*!40000 ALTER TABLE `course_requirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_target_audiences`
--

DROP TABLE IF EXISTS `course_target_audiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_target_audiences` (
  `audience_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description_id` bigint unsigned NOT NULL,
  `audience_text` varchar(255) NOT NULL,
  PRIMARY KEY (`audience_id`),
  KEY `description_id` (`description_id`),
  CONSTRAINT `course_target_audiences_ibfk_1` FOREIGN KEY (`description_id`) REFERENCES `course_descriptions` (`description_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_target_audiences`
--

LOCK TABLES `course_target_audiences` WRITE;
/*!40000 ALTER TABLE `course_target_audiences` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_target_audiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `slug` varchar(250) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `language` varchar(50) DEFAULT 'English',
  `difficulty_level` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Draft',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Advanced C# Design Patterns','advanced-csharp-patterns',49.99,NULL,'English','Advanced','Published','2025-12-27 16:30:38','2025-12-27 16:30:38'),(2,'Python for Data Analysis','python-data-analysis',29.99,NULL,'English','Beginner','Published','2025-12-27 16:30:38','2025-12-27 16:30:38'),(3,'Docker Mastery','docker-mastery',19.99,NULL,'English','Intermediate','Draft','2025-12-27 16:46:22','2025-12-27 16:46:22'),(4,'Mastering React 18','mastering-react-18',49.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(5,'Vue.js 3 Fundamentals','vue-js-3-fundamentals',39.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(6,'Angular for Enterprise','angular-enterprise',59.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(7,'Node.js Microservices','node-js-microservices',49.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(8,'Python Machine Learning','python-machine-learning',89.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(9,'Data Visualization with D3','data-viz-d3',44.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(10,'AWS Certified Solutions Architect','aws-csa-associate',99.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(11,'Google Cloud Essentials','gcp-essentials',29.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(12,'Docker for Beginners','docker-for-beginners',19.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(14,'SQL Database Mastery','sql-database-mastery',34.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(15,'MongoDB Aggregation Framework','mongodb-aggregation',39.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(16,'Redis for Caching','redis-caching',24.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(17,'GraphQL API Development','graphql-api-dev',49.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(18,'Next.js Full Stack','next-js-full-stack',54.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(19,'SvelteKit: The Complete Guide','sveltekit-complete-guide',39.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(20,'Rust Programming for Beginners','rust-programming-beginners',44.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(21,'Go Language Bootcamp','go-lang-bootcamp',49.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(22,'Java Spring Boot Microservices','java-spring-boot',59.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(23,'Kotlin for Android Dev','kotlin-android-dev',49.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(24,'SwiftUI for iOS 17','swiftui-ios-17',59.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(25,'Flutter Cross-Platform Apps','flutter-apps',49.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(26,'React Native CLI Mastery','react-native-cli',54.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(27,'Unity Game Development 2D','unity-game-dev-2d',39.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(28,'Unreal Engine 5 Blueprints','unreal-engine-5-blueprints',49.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(29,'Cybersecurity Fundamentals','cybersecurity-fundamentals',29.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(30,'Ethical Hacking 101','ethical-hacking-101',49.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(31,'Penetration Testing with Kali','pentesting-kali',59.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(32,'Blockchain & Solidity','blockchain-solidity',69.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(33,'Web3 DApp Development','web3-dapp-dev',69.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(34,'UI/UX Design Principles','ui-ux-design-principles',34.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(35,'Figma Masterclass','figma-masterclass',29.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(36,'Adobe XD Prototyping','adobe-xd-prototyping',29.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(37,'Agile & Scrum Methodologies','agile-scrum',19.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(38,'JIRA Project Management','jira-project-management',24.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(39,'Technical Writing 101','technical-writing-101',19.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(40,'SEO for Developers','seo-for-developers',29.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(41,'Digital Marketing Basics','digital-marketing-basics',19.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(42,'Public Speaking for Tech','public-speaking-tech',19.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(43,'Freelancing Guide for Devs','freelancing-guide',24.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(44,'Advanced Git & GitHub','advanced-git-github',29.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(45,'Linux Command Line','linux-command-line',19.99,NULL,'English','Beginner','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(46,'Shell Scripting Automation','shell-scripting',34.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(47,'Ansible Configuration Mgmt','ansible-config-mgmt',44.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(48,'Terraform Infrastructure as Code','terraform-iac',49.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(49,'Jenkins CI/CD Pipelines','jenkins-cicd',39.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(50,'Prometheus & Grafana Monitoring','prometheus-grafana',39.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(51,'ELK Stack Logging','elk-stack-logging',44.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(52,'Nginx Web Server Admin','nginx-admin',29.99,NULL,'English','Intermediate','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(53,'Apache Kafka Streaming','apache-kafka-streaming',59.99,NULL,'English','Advanced','Published','2025-12-27 16:54:05','2025-12-27 16:54:05'),(54,'The Complete Tech Lead Guide','tech-lead-guide',89.99,NULL,'English','Advanced','Published','2025-12-27 17:00:07','2025-12-27 17:00:07'),(55,'MLOps: From Model to Production','mlops-production',69.99,NULL,'English','Advanced','Published','2025-12-27 17:00:07','2025-12-27 17:00:07'),(56,'Agile Business Transformation','agile-business',39.99,NULL,'English','Intermediate','Published','2025-12-27 17:00:07','2025-12-27 17:00:07');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `enrollment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `enrolled_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `access_type` varchar(20) DEFAULT 'Lifetime',
  `completion_date` datetime DEFAULT NULL,
  PRIMARY KEY (`enrollment_id`),
  UNIQUE KEY `user_id` (`user_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,2,1,'2025-12-27 16:32:03','Lifetime',NULL),(2,3,2,'2025-12-27 16:32:03','Lifetime',NULL),(3,2,10,'2025-12-27 16:57:12','Lifetime',NULL),(4,2,12,'2025-12-27 16:57:12','Lifetime',NULL),(5,2,35,'2025-12-27 16:57:12','Lifetime',NULL),(6,2,21,'2025-12-27 16:57:12','Lifetime',NULL),(7,2,45,'2025-12-27 16:57:12','Lifetime',NULL),(8,2,4,'2025-12-27 16:57:12','Lifetime',NULL),(9,2,18,'2025-12-27 16:57:12','Lifetime',NULL),(10,3,37,'2025-12-27 16:57:12','Lifetime',NULL),(11,3,9,'2025-12-27 16:57:12','Lifetime',NULL),(12,3,30,'2025-12-27 16:57:12','Lifetime',NULL),(14,3,8,'2025-12-27 16:57:12','Lifetime',NULL),(15,3,20,'2025-12-27 16:57:12','Lifetime',NULL),(16,3,14,'2025-12-27 16:57:12','Lifetime',NULL),(17,2,2,'2025-12-28 01:10:46','Full',NULL),(19,1,35,'2025-12-28 00:19:41','Lifetime',NULL),(20,1,34,'2025-12-28 00:28:20','Lifetime',NULL),(21,1,4,'2025-12-28 00:47:47','Lifetime',NULL),(23,3,1,'2025-12-28 11:52:50','Lifetime',NULL),(24,1,20,'2025-12-28 11:55:02','Lifetime',NULL),(25,1,33,'2025-12-28 11:55:06','Lifetime',NULL),(31,8,2,'2025-12-28 12:28:21','Lifetime',NULL),(32,8,1,'2025-12-28 12:37:36','Lifetime',NULL),(35,13,35,'2025-12-28 14:41:46','Lifetime',NULL),(36,13,1,'2025-12-28 14:42:41','Lifetime',NULL),(37,8,20,'2025-12-28 16:05:45','Lifetime',NULL),(46,17,35,'2025-12-29 23:40:19','Lifetime',NULL),(47,17,55,'2025-12-29 23:41:27','Lifetime',NULL),(48,17,1,'2025-12-29 23:41:46','Lifetime',NULL),(51,22,1,'2025-12-30 10:58:18','Lifetime',NULL),(57,26,20,'2025-12-31 00:59:07','Lifetime',NULL),(59,26,55,'2025-12-31 00:59:35','Lifetime',NULL),(61,28,1,'2025-12-31 01:01:03','Lifetime',NULL),(62,28,8,'2025-12-31 01:01:10','Lifetime',NULL),(63,16,20,'2025-12-31 08:53:11','Lifetime',NULL),(65,27,1,'2025-12-31 09:14:33','Lifetime',NULL),(66,27,35,'2025-12-31 09:14:48','Lifetime',NULL),(67,27,20,'2025-12-31 09:15:06','Lifetime',NULL),(68,27,10,'2025-12-31 09:16:13','Lifetime',NULL),(69,29,35,'2025-12-31 09:22:22','Lifetime',NULL),(70,29,20,'2025-12-31 09:22:41','Lifetime',NULL),(71,30,35,'2025-12-31 10:20:54','Lifetime',NULL),(72,30,20,'2025-12-31 10:26:32','Lifetime',NULL),(73,31,20,'2025-12-31 11:42:40','Lifetime',NULL),(74,31,1,'2025-12-31 11:43:37','Lifetime',NULL);
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_progress`
--

DROP TABLE IF EXISTS `lesson_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_progress` (
  `progress_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `enrollment_id` bigint unsigned NOT NULL,
  `lesson_id` bigint unsigned NOT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  `last_watched_second` int DEFAULT '0',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`progress_id`),
  UNIQUE KEY `enrollment_id` (`enrollment_id`,`lesson_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `lesson_progress_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE,
  CONSTRAINT `lesson_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_progress`
--

LOCK TABLES `lesson_progress` WRITE;
/*!40000 ALTER TABLE `lesson_progress` DISABLE KEYS */;
INSERT INTO `lesson_progress` VALUES (1,1,1,1,0,'2025-12-27 16:32:16'),(2,32,1,1,4,'2025-12-29 21:29:00'),(4,32,2,1,12,'2025-12-29 21:29:19'),(7,36,1,1,18,'2025-12-28 14:46:36'),(8,36,2,1,5,'2025-12-28 14:45:49'),(13,37,21,1,0,'2025-12-29 21:29:07'),(14,31,3,1,0,'2025-12-29 21:29:33'),(15,46,36,1,0,'2025-12-29 23:40:31'),(16,48,1,0,0,'2025-12-30 00:38:25'),(17,48,2,1,0,'2025-12-29 23:41:55'),(19,51,1,1,0,'2025-12-30 10:58:38'),(20,51,2,1,0,'2025-12-30 10:58:40'),(25,63,21,1,0,'2025-12-31 08:53:41'),(26,74,1,1,0,'2025-12-31 11:44:25'),(27,74,2,1,0,'2025-12-31 11:44:26');
/*!40000 ALTER TABLE `lesson_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_resources`
--

DROP TABLE IF EXISTS `lesson_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_resources` (
  `resource_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint unsigned NOT NULL,
  `resource_name` varchar(100) NOT NULL,
  `resource_url` varchar(255) NOT NULL,
  PRIMARY KEY (`resource_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `lesson_resources_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_resources`
--

LOCK TABLES `lesson_resources` WRITE;
/*!40000 ALTER TABLE `lesson_resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `lesson_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `section_id` bigint unsigned NOT NULL,
  `title` varchar(150) NOT NULL,
  `content_type` varchar(20) NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `text_content` text,
  `duration_seconds` int DEFAULT '0',
  `is_previewable` tinyint(1) DEFAULT '0',
  `order_index` int NOT NULL,
  PRIMARY KEY (`lesson_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,1,'Singleton Pattern','Video','https://cdn.discordapp.com/attachments/813775133248323585/1446374914402549790/Hs8ruHU.mp4?ex=6952139b&is=6950c21b&hm=9622ec28fe829c1dba181c24163407c118c1481a387d6265462183c9b2484364&',NULL,600,0,1),(2,1,'Factory Pattern','Video','https://cdn.discordapp.com/attachments/813775133248323585/1446374914402549790/Hs8ruHU.mp4?ex=6952139b&is=6950c21b&hm=9622ec28fe829c1dba181c24163407c118c1481a387d6265462183c9b2484364&',NULL,900,0,2),(3,37,'Introduction & Setup','Video',NULL,NULL,300,0,1),(4,14,'Introduction & Setup','Video',NULL,NULL,300,0,1),(5,29,'Introduction & Setup','Video',NULL,NULL,300,0,1),(6,52,'Introduction & Setup','Video',NULL,NULL,300,0,1),(7,5,'Introduction & Setup','Video',NULL,NULL,300,0,1),(8,33,'Introduction & Setup','Video',NULL,NULL,300,0,1),(9,38,'Introduction & Setup','Video',NULL,NULL,300,0,1),(10,11,'Introduction & Setup','Video',NULL,NULL,300,0,1),(11,8,'Introduction & Setup','Video',NULL,NULL,300,0,1),(12,20,'Introduction & Setup','Video',NULL,NULL,300,0,1),(13,13,'Introduction & Setup','Video',NULL,NULL,300,0,1),(15,44,'Introduction & Setup','Video',NULL,NULL,300,0,1),(16,30,'Introduction & Setup','Video',NULL,NULL,300,0,1),(17,40,'Introduction & Setup','Video',NULL,NULL,300,0,1),(18,22,'Introduction & Setup','Video',NULL,NULL,300,0,1),(19,31,'Introduction & Setup','Video',NULL,NULL,300,0,1),(20,45,'Introduction & Setup','Video',NULL,NULL,300,0,1),(21,41,'Introduction & Setup','Video',NULL,NULL,300,0,1),(22,21,'Introduction & Setup','Video',NULL,NULL,300,0,1),(23,23,'Introduction & Setup','Video',NULL,NULL,300,0,1),(24,26,'Introduction & Setup','Video',NULL,NULL,300,0,1),(25,46,'Introduction & Setup','Video',NULL,NULL,300,0,1),(26,18,'Introduction & Setup','Video',NULL,NULL,300,0,1),(27,39,'Introduction & Setup','Video',NULL,NULL,300,0,1),(28,50,'Introduction & Setup','Video',NULL,NULL,300,0,1),(29,51,'Introduction & Setup','Video',NULL,NULL,300,0,1),(30,10,'Introduction & Setup','Video',NULL,NULL,300,0,1),(31,16,'Introduction & Setup','Video',NULL,NULL,300,0,1),(32,34,'Introduction & Setup','Video',NULL,NULL,300,0,1),(33,9,'Introduction & Setup','Video',NULL,NULL,300,0,1),(34,53,'Introduction & Setup','Video',NULL,NULL,300,0,1),(35,49,'Introduction & Setup','Video',NULL,NULL,300,0,1),(36,17,'Introduction & Setup','Video',NULL,NULL,300,0,1),(37,2,'Introduction & Setup','Video',NULL,NULL,300,0,1),(38,4,'Introduction & Setup','Video',NULL,NULL,300,0,1),(39,25,'Introduction & Setup','Video',NULL,NULL,300,0,1),(40,47,'Introduction & Setup','Video',NULL,NULL,300,0,1),(41,42,'Introduction & Setup','Video',NULL,NULL,300,0,1),(42,12,'Introduction & Setup','Video',NULL,NULL,300,0,1),(43,36,'Introduction & Setup','Video',NULL,NULL,300,0,1),(44,19,'Introduction & Setup','Video',NULL,NULL,300,0,1),(45,3,'Introduction & Setup','Video',NULL,NULL,300,0,1),(46,28,'Introduction & Setup','Video',NULL,NULL,300,0,1),(47,43,'Introduction & Setup','Video',NULL,NULL,300,0,1),(48,6,'Introduction & Setup','Video',NULL,NULL,300,0,1),(49,48,'Introduction & Setup','Video',NULL,NULL,300,0,1),(50,24,'Introduction & Setup','Video',NULL,NULL,300,0,1),(51,35,'Introduction & Setup','Video',NULL,NULL,300,0,1),(52,15,'Introduction & Setup','Video',NULL,NULL,300,0,1),(53,32,'Introduction & Setup','Video',NULL,NULL,300,0,1),(54,7,'Introduction & Setup','Video',NULL,NULL,300,0,1);
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_events`
--

DROP TABLE IF EXISTS `login_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_events` (
  `event_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `attempt_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_successful` tinyint(1) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `failure_reason` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `login_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_events`
--

LOCK TABLES `login_events` WRITE;
/*!40000 ALTER TABLE `login_events` DISABLE KEYS */;
INSERT INTO `login_events` VALUES (1,2,'2025-12-27 16:32:28',1,'192.168.1.10',NULL,NULL),(2,20,'2025-12-30 01:43:12',1,'156.214.253.230','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(3,NULL,'2025-12-30 01:43:45',0,'156.214.253.230','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','Invalid credentials.'),(4,NULL,'2025-12-30 01:44:36',0,'197.56.68.117','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','Invalid credentials.'),(5,NULL,'2025-12-30 09:53:37',1,'84.36.102.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(6,NULL,'2025-12-30 09:55:22',0,'41.33.235.99','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','Invalid credentials.'),(7,21,'2025-12-30 10:08:33',1,'84.36.102.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(8,22,'2025-12-30 10:50:23',1,'82.129.174.3','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL),(9,NULL,'2025-12-30 10:58:59',1,'82.129.174.3','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',NULL),(10,NULL,'2025-12-30 20:04:38',0,'156.214.253.230','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','Email already exists'),(11,23,'2025-12-30 20:04:42',1,'156.214.253.230','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(12,24,'2025-12-30 20:13:39',1,'41.237.93.243','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL),(13,NULL,'2025-12-30 20:19:24',1,'102.40.101.248','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL),(14,26,'2025-12-30 21:06:38',1,'156.214.253.230','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(15,27,'2025-12-30 22:26:10',1,'156.216.53.163','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(16,27,'2025-12-30 22:31:32',1,'156.216.53.163','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(17,27,'2025-12-30 22:33:36',1,'156.216.53.163','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(18,NULL,'2025-12-31 01:00:52',0,'156.214.253.230','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','Email already exists'),(19,28,'2025-12-31 01:00:57',1,'41.234.56.235','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL),(20,29,'2025-12-31 01:00:57',1,'156.214.253.230','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(21,29,'2025-12-31 01:03:55',1,'156.214.253.230','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(22,27,'2025-12-31 07:42:35',1,'172.17.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(23,27,'2025-12-31 09:03:14',1,'41.33.235.99','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL),(24,27,'2025-12-31 09:07:46',1,'82.129.174.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(25,27,'2025-12-31 09:15:41',1,'82.129.174.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(26,30,'2025-12-31 10:15:19',1,'82.129.174.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(27,30,'2025-12-31 10:16:28',1,'82.129.174.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(28,31,'2025-12-31 10:16:46',1,'84.36.102.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(29,30,'2025-12-31 10:17:02',1,'84.36.102.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(30,27,'2025-12-31 10:17:19',1,'84.36.102.3','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(31,31,'2025-12-31 10:46:42',1,'172.17.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(32,30,'2025-12-31 10:59:02',1,'172.17.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(33,31,'2025-12-31 11:42:24',1,'172.17.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(34,30,'2025-12-31 11:45:22',1,'172.17.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL),(35,27,'2025-12-31 11:46:04',1,'172.17.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL);
/*!40000 ALTER TABLE `login_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `enrollment_id` bigint unsigned NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `currency_code` char(3) DEFAULT 'USD',
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Success',
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `enrollment_id` (`enrollment_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,49.99,'USD','Credit Card',NULL,'Success','2025-12-27 16:32:03'),(2,17,29.99,'USD','string','TXN-5D58A27E','Success','2025-12-28 01:10:46'),(4,19,29.99,'USD','card','TXN-0244FA1F','Success','2025-12-28 00:19:41'),(5,20,34.99,'USD','card','TXN-0D60FC9E','Success','2025-12-28 00:28:20'),(6,21,49.99,'USD','card','TXN-073C44AE','Success','2025-12-28 00:47:47'),(8,23,49.99,'USD','string','TXN-3AAC4503','Success','2025-12-28 11:52:50'),(9,24,44.99,'USD','string','TXN-C5111985','Success','2025-12-28 11:55:02'),(10,25,69.99,'USD','Bdan','TXN-65EB14BE','Success','2025-12-28 11:55:06'),(16,31,29.99,'USD','card','TXN-03222110','Success','2025-12-28 12:28:21'),(17,32,49.99,'USD','Fawry','TXN-D162200C','Success','2025-12-28 12:37:36'),(20,35,29.99,'USD','Paypal','TXN-24EFCBE6','Success','2025-12-28 14:41:46'),(21,36,49.99,'USD','Paypal','TXN-89F3259F','Success','2025-12-28 14:42:41'),(22,37,44.99,'USD','Visa','TXN-5AEA5A1A','Success','2025-12-28 16:05:45'),(31,46,29.99,'USD','Fawry','TXN-1110E02E','Success','2025-12-29 23:40:19'),(32,47,69.99,'USD','Paypal','TXN-8BEB8429','Success','2025-12-29 23:41:27'),(33,48,49.99,'USD','Paypal','TXN-0EAD47F8','Success','2025-12-29 23:41:46'),(36,51,49.99,'USD','Fawry','TXN-2A8660BD','Success','2025-12-30 10:58:18'),(41,57,44.99,'USD','Visa','TXN-DDD3C597','Success','2025-12-31 00:59:07'),(42,59,69.99,'USD','Visa','TXN-44BF60C3','Success','2025-12-31 00:59:35'),(43,61,49.99,'USD','Visa','TXN-FF2127A7','Success','2025-12-31 01:01:03'),(44,62,89.99,'USD','Paypal','TXN-9E99F45B','Success','2025-12-31 01:01:10'),(45,63,44.99,'USD','Fawry','TXN-07057AA1','Success','2025-12-31 08:53:11'),(46,65,49.99,'USD','Fawry','TXN-61932809','Success','2025-12-31 09:14:33'),(47,66,29.99,'USD','Fawry','TXN-D58175E4','Success','2025-12-31 09:14:48'),(48,67,44.99,'USD','Fawry','TXN-8F6B562B','Success','2025-12-31 09:15:06'),(49,68,99.99,'USD','Visa','TXN-AA812C84','Success','2025-12-31 09:16:13'),(50,69,29.99,'USD','Visa','TXN-9FAAAC51','Success','2025-12-31 09:22:22'),(51,70,44.99,'USD','Fawry','TXN-09572986','Success','2025-12-31 09:22:41'),(52,71,29.99,'USD','Visa','TXN-632B5BA3','Success','2025-12-31 10:20:54'),(53,72,44.99,'USD','Visa','TXN-4D9B2A3A','Success','2025-12-31 10:26:32'),(54,73,44.99,'USD','Fawry','TXN-5239D4A7','Success','2025-12-31 11:42:40'),(55,74,49.99,'USD','Fawry','TXN-24CD730E','Success','2025-12-31 11:43:37');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `permission_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `permission_slug` varchar(100) NOT NULL,
  PRIMARY KEY (`permission_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,2,'course.create'),(2,2,'course.update'),(3,2,'course.publish'),(4,3,'user.manage');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','System administrator'),(2,'Instructor','Course creator'),(3,'Student','Learner account');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sections` (
  `section_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `title` varchar(150) NOT NULL,
  `order_index` int NOT NULL,
  `objective` text,
  PRIMARY KEY (`section_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES (1,1,'Creational Patterns',1,NULL),(2,36,'Getting Started',1,NULL),(3,44,'Getting Started',1,NULL),(4,37,'Getting Started',1,NULL),(5,6,'Getting Started',1,NULL),(6,47,'Getting Started',1,NULL),(7,53,'Getting Started',1,NULL),(8,10,'Getting Started',1,NULL),(9,32,'Getting Started',1,NULL),(10,29,'Getting Started',1,NULL),(11,9,'Getting Started',1,NULL),(12,41,'Getting Started',1,NULL),(13,12,'Getting Started',1,NULL),(14,3,'Getting Started',1,NULL),(15,51,'Getting Started',1,NULL),(16,30,'Getting Started',1,NULL),(17,35,'Getting Started',1,NULL),(18,25,'Getting Started',1,NULL),(19,43,'Getting Started',1,NULL),(20,11,'Getting Started',1,NULL),(21,21,'Getting Started',1,NULL),(22,17,'Getting Started',1,NULL),(23,22,'Getting Started',1,NULL),(24,49,'Getting Started',1,NULL),(25,38,'Getting Started',1,NULL),(26,23,'Getting Started',1,NULL),(28,45,'Getting Started',1,NULL),(29,4,'Getting Started',1,NULL),(30,15,'Getting Started',1,NULL),(31,18,'Getting Started',1,NULL),(32,52,'Getting Started',1,NULL),(33,7,'Getting Started',1,NULL),(34,31,'Getting Started',1,NULL),(35,50,'Getting Started',1,NULL),(36,42,'Getting Started',1,NULL),(37,2,'Getting Started',1,NULL),(38,8,'Getting Started',1,NULL),(39,26,'Getting Started',1,NULL),(40,16,'Getting Started',1,NULL),(41,20,'Getting Started',1,NULL),(42,40,'Getting Started',1,NULL),(43,46,'Getting Started',1,NULL),(44,14,'Getting Started',1,NULL),(45,19,'Getting Started',1,NULL),(46,24,'Getting Started',1,NULL),(47,39,'Getting Started',1,NULL),(48,48,'Getting Started',1,NULL),(49,34,'Getting Started',1,NULL),(50,27,'Getting Started',1,NULL),(51,28,'Getting Started',1,NULL),(52,5,'Getting Started',1,NULL),(53,33,'Getting Started',1,NULL);
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_links`
--

DROP TABLE IF EXISTS `user_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_links` (
  `link_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `platform_name` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`link_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_links_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_links`
--

LOCK TABLES `user_links` WRITE;
/*!40000 ALTER TABLE `user_links` DISABLE KEYS */;
INSERT INTO `user_links` VALUES (5,8,'Google','https');
/*!40000 ALTER TABLE `user_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_phones`
--

DROP TABLE IF EXISTS `user_phones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_phones` (
  `phone_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  PRIMARY KEY (`phone_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_phones_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_phones`
--

LOCK TABLES `user_phones` WRITE;
/*!40000 ALTER TABLE `user_phones` DISABLE KEYS */;
INSERT INTO `user_phones` VALUES (4,1,'string'),(27,8,'dwdwd'),(28,8,'dwdw'),(29,8,'wdawd'),(30,8,'');
/*!40000 ALTER TABLE `user_phones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_reviews`
--

DROP TABLE IF EXISTS `user_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_reviews` (
  `review_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `rating_value` tinyint unsigned NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `user_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_reviews_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `user_reviews_chk_1` CHECK ((`rating_value` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_reviews`
--

LOCK TABLES `user_reviews` WRITE;
/*!40000 ALTER TABLE `user_reviews` DISABLE KEYS */;
INSERT INTO `user_reviews` VALUES (1,2,1,5,'Excellent explanations','2025-12-27 16:32:28'),(2,2,4,5,'Absolutely fantastic deep dive into concurrency features. The instructor knows their stuff!','2025-12-27 16:57:12'),(3,2,12,4,'Great introduction, but I wish there were more examples on multi-stage builds.','2025-12-27 16:57:12'),(4,2,10,5,'This helped me pass the exam on the first try. Highly recommended.','2025-12-27 16:57:12'),(5,2,45,3,'It covers the basics, but the pacing is a bit slow for anyone with prior experience.','2025-12-27 16:57:12'),(6,2,35,5,'I am a developer, not a designer, but this course made UI design click for me.','2025-12-27 16:57:12'),(7,2,18,4,'Solid content on App Router, but the database section felt rushed.','2025-12-27 16:57:12'),(8,3,8,5,'Hands down the best ML resource I have found. The math explanations are crystal clear.','2025-12-27 16:57:12'),(9,3,9,2,'Way too complex too fast. The instructor skips over the fundamental D3 selections logic.','2025-12-27 16:57:12'),(11,3,30,4,'Fun content, but some of the tools used are slightly outdated versions.','2025-12-27 16:57:12'),(12,3,37,1,'Could have been a 5-minute blog post. Too much fluff.','2025-12-27 16:57:12'),(13,3,20,5,'Rust is difficult, but this course structure makes the borrow checker actually understandable.','2025-12-27 16:57:12'),(14,3,14,3,'Good for beginners, but lacks advanced indexing strategies.','2025-12-27 16:57:12'),(15,8,1,2,'A7la course feeky ya Masr','2025-12-28 14:14:32'),(22,28,1,1,'very unprofessional','2025-12-31 01:01:46'),(23,16,20,5,'my fav rust course','2025-12-31 08:53:37'),(24,31,1,4,'test','2025-12-31 11:43:58');
/*!40000 ALTER TABLE `user_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `profile_picture_url` text,
  `headline` varchar(100) DEFAULT NULL,
  `biography` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,2,'Alice','Sharpe','alice@example.com',NULL,'Senior C# Architect','15+ years of .NET experience','2025-12-27 16:29:26'),(2,1,'Bob','Green','bob@example.com',NULL,'Junior Developer',NULL,'2025-12-27 16:29:26'),(3,1,'Charlie','Code','charlie@example.com',NULL,'Data Science Enthusiast',NULL,'2025-12-27 16:29:26'),(4,3,'Dave','Admin','admin@example.com',NULL,'Platform Supervisor',NULL,'2025-12-27 16:29:26'),(8,3,'Yousef','Tantawy','yousef@gmail.com','https://cdn.discordapp.com/attachments/782700452474388480/1453795041805074555/Pentalogy_until_a_better_name_20251225_190208.jpg?ex=695162a4&is=69501124&hm=46e41eb1a81017942b41e1f3d1f1764c5cf13d40172f9a397580a336580eb71a&','awdawd','jjjjjjjjj','2025-12-27 17:08:49'),(10,2,'omar','ashraf','omar.ashraf1@gmail.com',NULL,NULL,NULL,'2025-12-27 17:12:38'),(13,3,'Hassan','Darwish','ha@email.com',NULL,NULL,NULL,'2025-12-28 14:40:34'),(16,3,'omar','ashraf','omar.ashraf11@gmail.com',NULL,NULL,NULL,'2025-12-29 21:21:52'),(17,3,'Yousef','Tantawy','gmail@gmail.com',NULL,'leeeeeeeeeee','','2025-12-29 21:35:19'),(18,2,'fdewdw','wdwad','Goe@gmail.com',NULL,NULL,NULL,'2025-12-30 00:47:34'),(20,2,'ewda','dadawdaw','dwaawdawd@gmail.com',NULL,NULL,NULL,'2025-12-30 01:43:11'),(21,2,'Amr ','Tarek','yarab@gmail.com',NULL,NULL,NULL,'2025-12-30 10:08:33'),(22,2,'Yousef','Tantawy','youseftantawy@gmail.com',NULL,NULL,NULL,'2025-12-30 10:50:23'),(23,3,'be','wokw','besdw@gmail.com',NULL,NULL,NULL,'2025-12-30 20:04:42'),(24,2,'Omar','Gharieb','omargharieb30@gmail.com',NULL,NULL,NULL,'2025-12-30 20:13:39'),(26,2,'Oracle','Meeting','Oracle@gmail.com',NULL,NULL,NULL,'2025-12-30 21:06:38'),(27,1,'admin','admin','admin@gmail.com',NULL,NULL,NULL,'2025-12-30 22:26:10'),(28,2,'Mohamed','Wael','lalalalala@gmail.com',NULL,NULL,NULL,'2025-12-31 01:00:56'),(29,1,'Goe','Goe','Goe_l@gmail.com',NULL,NULL,NULL,'2025-12-31 01:00:57'),(30,2,'instructor','instructor','instructor@gmail.com',NULL,NULL,NULL,'2025-12-31 10:15:18'),(31,3,'student','student','student@gmail.com','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgqiVRR21FBLkFcaRlMjXdiEJGNCzGT8xE-A&s',NULL,NULL,'2025-12-31 10:16:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_most_enrolled`
--

DROP TABLE IF EXISTS `view_most_enrolled`;
/*!50001 DROP VIEW IF EXISTS `view_most_enrolled`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_most_enrolled` AS SELECT 
 1 AS `course_id`,
 1 AS `title`,
 1 AS `price`,
 1 AS `created_at`,
 1 AS `avg_rating`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_most_recent`
--

DROP TABLE IF EXISTS `view_most_recent`;
/*!50001 DROP VIEW IF EXISTS `view_most_recent`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_most_recent` AS SELECT 
 1 AS `course_id`,
 1 AS `title`,
 1 AS `price`,
 1 AS `created_at`,
 1 AS `avg_rating`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_most_trending`
--

DROP TABLE IF EXISTS `view_most_trending`;
/*!50001 DROP VIEW IF EXISTS `view_most_trending`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_most_trending` AS SELECT 
 1 AS `course_id`,
 1 AS `title`,
 1 AS `price`,
 1 AS `created_at`,
 1 AS `avg_rating`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_top_rated`
--

DROP TABLE IF EXISTS `view_top_rated`;
/*!50001 DROP VIEW IF EXISTS `view_top_rated`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_top_rated` AS SELECT 
 1 AS `course_id`,
 1 AS `title`,
 1 AS `price`,
 1 AS `created_at`,
 1 AS `avg_rating`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_most_enrolled`
--

/*!50001 DROP VIEW IF EXISTS `view_most_enrolled`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`YousefTantawy`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_most_enrolled` AS select `c`.`course_id` AS `course_id`,`c`.`title` AS `title`,`c`.`price` AS `price`,`c`.`created_at` AS `created_at`,coalesce(avg(`r`.`rating_value`),0) AS `avg_rating` from ((`courses` `c` left join `enrollments` `e` on((`c`.`course_id` = `e`.`course_id`))) left join `user_reviews` `r` on((`c`.`course_id` = `r`.`course_id`))) group by `c`.`course_id`,`c`.`title`,`c`.`price`,`c`.`created_at` order by count(distinct `e`.`enrollment_id`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_most_recent`
--

/*!50001 DROP VIEW IF EXISTS `view_most_recent`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`YousefTantawy`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_most_recent` AS select `c`.`course_id` AS `course_id`,`c`.`title` AS `title`,`c`.`price` AS `price`,`c`.`created_at` AS `created_at`,coalesce(avg(`r`.`rating_value`),0) AS `avg_rating` from (`courses` `c` left join `user_reviews` `r` on((`c`.`course_id` = `r`.`course_id`))) group by `c`.`course_id`,`c`.`title`,`c`.`price`,`c`.`created_at` order by `c`.`created_at` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_most_trending`
--

/*!50001 DROP VIEW IF EXISTS `view_most_trending`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`YousefTantawy`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_most_trending` AS select `c`.`course_id` AS `course_id`,`c`.`title` AS `title`,`c`.`price` AS `price`,`c`.`created_at` AS `created_at`,coalesce(avg(`r`.`rating_value`),0) AS `avg_rating` from ((`courses` `c` left join `enrollments` `e` on((`c`.`course_id` = `e`.`course_id`))) left join `user_reviews` `r` on((`c`.`course_id` = `r`.`course_id`))) group by `c`.`course_id`,`c`.`title`,`c`.`price`,`c`.`created_at` order by (((count(distinct `e`.`enrollment_id`) * 1.0) + (coalesce(avg(`r`.`rating_value`),0) * 10)) + (case when (`c`.`created_at` >= (now() - interval 30 day)) then 20 else 0 end)) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_top_rated`
--

/*!50001 DROP VIEW IF EXISTS `view_top_rated`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`YousefTantawy`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_top_rated` AS select `c`.`course_id` AS `course_id`,`c`.`title` AS `title`,`c`.`price` AS `price`,`c`.`created_at` AS `created_at`,coalesce(avg(`r`.`rating_value`),0) AS `avg_rating` from (`courses` `c` left join `user_reviews` `r` on((`c`.`course_id` = `r`.`course_id`))) group by `c`.`course_id`,`c`.`title`,`c`.`price`,`c`.`created_at` order by `avg_rating` desc,count(`r`.`review_id`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-25 22:41:16
