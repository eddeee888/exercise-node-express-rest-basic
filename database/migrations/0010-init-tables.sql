CREATE DATABASE `pokemons`;
CREATE TABLE `pokemons`.`types` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(),
  PRIMARY KEY (id)
) ENGINE = INNODB;
CREATE TABLE `pokemons`.`pokemons` (
  `id` INT AUTO_INCREMENT,
  `pokedex_id` varchar(255) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(),
  PRIMARY KEY (id)
) ENGINE = INNODB;
CREATE TABLE `pokemons`.`pokemons_types` (
  `id` INT AUTO_INCREMENT,
  `pokemon_id` INT NOT NULL,
  `type_id` INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (pokemon_id) REFERENCES `pokemons`.`pokemons`(id),
  FOREIGN KEY (type_id) REFERENCES `pokemons`.`types`(id)
) ENGINE = INNODB;