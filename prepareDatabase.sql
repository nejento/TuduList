CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unikátní ID uživatele',
    `username` varchar(255) NOT NULL COMMENT 'Uživatelské jméno',
    `password` varchar(255) NOT NULL COMMENT 'Heslo uživatele v bcrypt hashi',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

CREATE TABLE `todos` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unikátní ID položky',
    `user` int(11) NOT NULL COMMENT 'Uživatel, kterému položka patrí',
    `task` varchar(255) NOT NULL COMMENT 'Název položky',
    `done` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Je položka hotová?',
    `creationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Datum vytvoření položky',
    PRIMARY KEY (`id`),
    KEY `user` (`user`),
    CONSTRAINT `todos_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
