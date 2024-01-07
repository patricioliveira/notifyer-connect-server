# Use an official PostgreSQL image as a base image
FROM postgres

# Define environment variables for PostgreSQL
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 123
ENV POSTGRES_DB notifyer_db

# Copy the SQL script to create the database
COPY init.sql /docker-entrypoint-initdb.d/
