CREATE TABLE form(
	id serial primary key,
	date timestamp with time zone not null default current_timestamp,
	nafn varchar(100) not null,
	email varchar(100) not null,
	kennitala varchar(20) not null,
	fjoldi integer not null

;)