CREATE TABLE `campanas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`fecha_inicio` text NOT NULL,
	`fecha_fin` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cosechas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lote_id` integer NOT NULL,
	`campana_id` integer NOT NULL,
	`cultivo` text NOT NULL,
	`rinde_obtenido` real NOT NULL,
	`stock_resultante` real,
	`fecha` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`lote_id`) REFERENCES `lotes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`campana_id`) REFERENCES `campanas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `establecimientos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`cuit_titular` text,
	`ubicacion` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`establecimiento_id` integer NOT NULL,
	`nombre` text NOT NULL,
	`hectareas` real NOT NULL,
	`coordenadas` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`establecimiento_id`) REFERENCES `establecimientos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `planes_siembra` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lote_id` integer NOT NULL,
	`campana_id` integer NOT NULL,
	`cultivo` text NOT NULL,
	`hectareas` real NOT NULL,
	`destino` text,
	`fecha` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`lote_id`) REFERENCES `lotes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`campana_id`) REFERENCES `campanas`(`id`) ON UPDATE no action ON DELETE no action
);
