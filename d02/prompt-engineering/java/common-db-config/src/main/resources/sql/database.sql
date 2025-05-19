-- run these commands before starting the project, in order to setup the database and the connecting user
CREATE USER ai_workshop_admin WITH PASSWORD 'sU5YgsbPbRx2ZYn';

CREATE DATABASE ai_workshop;
GRANT ALL PRIVILEGES ON DATABASE ai_workshop TO ai_workshop_admin;

\c ai_workshop;
GRANT ALL ON SCHEMA public TO ai_workshop_admin;