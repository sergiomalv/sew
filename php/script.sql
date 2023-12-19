-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-12-2023 a las 13:37:13
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `zoo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animal`
--

CREATE TABLE `animal` (
  `idAnimal` int(11) NOT NULL,
  `idEstablo` int(11) DEFAULT NULL,
  `nombre` varchar(20) NOT NULL,
  `raza` varchar(20) NOT NULL,
  `hambre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `animal`
--

INSERT INTO `animal` (`idAnimal`, `idEstablo`, `nombre`, `raza`, `hambre`) VALUES
(1, 1, 'Tinín', 'Mono', 5),
(2, 1, 'Kiba', 'Fénec', 5),
(3, 2, 'Woody', 'Pingüino', 3),
(4, 2, 'Rico', 'Pingüino', 7),
(5, 3, 'Charlie', 'Jirafa', 6),
(6, 3, 'Melman', 'Jirafa', 4),
(7, 3, 'Oliver', 'Jirafa', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animalxcuidador`
--

CREATE TABLE `animalxcuidador` (
  `idAnimalXCuidador` int(11) NOT NULL,
  `idAnimal` int(11) DEFAULT NULL,
  `idCuidador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `animalxcuidador`
--

INSERT INTO `animalxcuidador` (`idAnimalXCuidador`, `idAnimal`, `idCuidador`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(4, 4, 3),
(5, 5, 3),
(6, 6, 1),
(7, 7, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comida`
--

CREATE TABLE `comida` (
  `idComida` int(11) NOT NULL,
  `idCuidador` int(11) DEFAULT NULL,
  `nombreComida` varchar(20) NOT NULL,
  `unidades` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `comida`
--

INSERT INTO `comida` (`idComida`, `idCuidador`, `nombreComida`, `unidades`) VALUES
(1, 1, 'Alfalfa', 15),
(2, 2, 'Granos', 10),
(3, 3, 'Heno', 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuidador`
--

CREATE TABLE `cuidador` (
  `idCuidador` int(11) NOT NULL,
  `nombreCuidador` varchar(20) NOT NULL,
  `edadCuidador` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cuidador`
--

INSERT INTO `cuidador` (`idCuidador`, `nombreCuidador`, `edadCuidador`) VALUES
(1, 'Sergio Murillo', '34'),
(2, 'Gerard Gamonal', '29'),
(3, 'Carlos Ruiz', '40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `establo`
--

CREATE TABLE `establo` (
  `idEstablo` int(11) NOT NULL,
  `nombreEstablo` varchar(20) NOT NULL,
  `capacidadEstablo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `establo`
--

INSERT INTO `establo` (`idEstablo`, `nombreEstablo`, `capacidadEstablo`) VALUES
(1, 'Establo Sol', 1),
(2, 'Establo Luna', 1),
(3, 'Establo Río', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `animal`
--
ALTER TABLE `animal`
  ADD PRIMARY KEY (`idAnimal`),
  ADD KEY `idEstablo` (`idEstablo`);

--
-- Indices de la tabla `animalxcuidador`
--
ALTER TABLE `animalxcuidador`
  ADD PRIMARY KEY (`idAnimalXCuidador`),
  ADD KEY `idAnimal` (`idAnimal`),
  ADD KEY `idCuidador` (`idCuidador`);

--
-- Indices de la tabla `comida`
--
ALTER TABLE `comida`
  ADD PRIMARY KEY (`idComida`),
  ADD KEY `idCuidador` (`idCuidador`);

--
-- Indices de la tabla `cuidador`
--
ALTER TABLE `cuidador`
  ADD PRIMARY KEY (`idCuidador`);

--
-- Indices de la tabla `establo`
--
ALTER TABLE `establo`
  ADD PRIMARY KEY (`idEstablo`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `animal`
--
ALTER TABLE `animal`
  ADD CONSTRAINT `animal_ibfk_1` FOREIGN KEY (`idEstablo`) REFERENCES `establo` (`idEstablo`);

--
-- Filtros para la tabla `animalxcuidador`
--
ALTER TABLE `animalxcuidador`
  ADD CONSTRAINT `animalxcuidador_ibfk_1` FOREIGN KEY (`idAnimal`) REFERENCES `animal` (`idAnimal`),
  ADD CONSTRAINT `animalxcuidador_ibfk_2` FOREIGN KEY (`idCuidador`) REFERENCES `cuidador` (`idCuidador`);

--
-- Filtros para la tabla `comida`
--
ALTER TABLE `comida`
  ADD CONSTRAINT `comida_ibfk_1` FOREIGN KEY (`idCuidador`) REFERENCES `cuidador` (`idCuidador`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
