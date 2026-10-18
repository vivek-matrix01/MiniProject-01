@echo off
echo ========================================================
echo  Starting PostgreSQL Database via Docker Compose
echo ========================================================
docker compose up -d
echo.
echo PostgreSQL is running on port 5432 (database: arch_reviewer_db)
echo.
pause
