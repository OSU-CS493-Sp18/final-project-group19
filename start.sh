docker build -t final_api .
docker-compose rm
docker-compose up --force-recreate
