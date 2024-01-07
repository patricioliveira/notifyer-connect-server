DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'notifyer_db') THEN
        -- O banco de dados existe, faça alguma coisa
        RAISE NOTICE 'O banco de dados existe.';
    ELSE
        -- O banco de dados não existe, crie o banco
        CREATE DATABASE notifyer_db;
        RAISE NOTICE 'O banco de dados foi criado.';
    END IF;
END $$;