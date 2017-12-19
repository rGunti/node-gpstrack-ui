-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: data.ge.rgunti.ch    Database: carpi-rec
-- ------------------------------------------------------
-- Server version	5.7.18-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `trip_points`
--

DROP TABLE IF EXISTS `trip_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trip_points` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `trip_id` int(11) DEFAULT NULL,
  `lat` decimal(13,10) NOT NULL,
  `lon` decimal(13,10) NOT NULL,
  `alt` smallint(6) DEFAULT NULL,
  `fix` tinyint(3) unsigned NOT NULL,
  `gps_spd` decimal(6,3) DEFAULT NULL,
  `acc_lat` decimal(6,3) DEFAULT NULL,
  `acc_lon` decimal(6,3) DEFAULT NULL,
  `acc_alt` decimal(6,3) DEFAULT NULL,
  `acc_spd` decimal(6,3) DEFAULT NULL,
  `vehicle_spd` smallint(6) DEFAULT NULL,
  `vehicle_tmp` smallint(6) DEFAULT NULL,
  `vehicle_map` tinyint(3) unsigned DEFAULT NULL,
  `vehicle_rpm` decimal(7,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `trip_points_trips_id_fk` (`trip_id`),
  CONSTRAINT `trip_points_trips_id_fk` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1178 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `v_trip_points`
--

DROP TABLE IF EXISTS `v_trip_points`;
/*!50001 DROP VIEW IF EXISTS `v_trip_points`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_trip_points` AS SELECT
                                          1 AS `id`,
                                          1 AS `trip_id`,
                                          1 AS `lat`,
                                          1 AS `lon`,
                                          1 AS `alt`,
                                          1 AS `fix`,
                                          1 AS `gps_spd`,
                                          1 AS `acc_lat`,
                                          1 AS `acc_lon`,
                                          1 AS `acc_alt`,
                                          1 AS `acc_spd`,
                                          1 AS `vehicle_spd`,
                                          1 AS `vehicle_tmp`,
                                          1 AS `vehicle_map`,
                                          1 AS `vehicle_rpm`,
                                          1 AS `fuel_consumption`,
                                          1 AS `created_at`,
                                          1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_trip_points`
--

/*!50001 DROP VIEW IF EXISTS `v_trip_points`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
  /*!50013 DEFINER=`carpi-rec`@`%` SQL SECURITY DEFINER */
  /*!50001 VIEW `v_trip_points` AS select `trip_points`.`id` AS `id`,`trip_points`.`trip_id` AS `trip_id`,`trip_points`.`lat` AS `lat`,`trip_points`.`lon` AS `lon`,`trip_points`.`alt` AS `alt`,`trip_points`.`fix` AS `fix`,`trip_points`.`gps_spd` AS `gps_spd`,`trip_points`.`acc_lat` AS `acc_lat`,`trip_points`.`acc_lon` AS `acc_lon`,`trip_points`.`acc_alt` AS `acc_alt`,`trip_points`.`acc_spd` AS `acc_spd`,`trip_points`.`vehicle_spd` AS `vehicle_spd`,`trip_points`.`vehicle_tmp` AS `vehicle_tmp`,`trip_points`.`vehicle_map` AS `vehicle_map`,`trip_points`.`vehicle_rpm` AS `vehicle_rpm`,((((((((((`trip_points`.`vehicle_rpm` * `trip_points`.`vehicle_map`) / (`trip_points`.`vehicle_tmp` + 273.15)) / 120) * 0.85) * 1.39) * 28.9644) / 8.3144598) / 14.7) / 745) * 3600) AS `fuel_consumption`,`trip_points`.`created_at` AS `created_at`,`trip_points`.`updated_at` AS `updated_at` from `trip_points` */;
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

-- Dump completed on 2017-12-19  9:20:15
