# animal-crossing-marie

Animal Crossing Bot for Discord

## ToDo :

- [x] Display a passport
- [x] Manage data via database (PGSQL or MariaDB)
- [x] Add Villager DB
- [ ] Search if open data exists for AC
- [ ] Complete README.md

## Installation :

Configure a MMySQL Database

Configure the .env file :

```bash
cp .env.example .env
```

Migrate the database

```bash
yarn sequelize-cli db:migrate
```
