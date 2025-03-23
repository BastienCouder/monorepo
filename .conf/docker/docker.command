// development
docker-compose -f docker-compose.dev.yml up
docker build -t bastiencdr/software:latest -f apps/software/Dockerfile.dev .

// production
docker build -t bastiencdr/web:latest -f Dockerfile.web .
docker build -t bastiencdr/software:latest -f Dockerfile.software .

docker run -p 3000:3000 bastiencdr/web:latest
docker run bastiencdr/software:latest

docker push bastiencdr/web:latest
docker push bastiencdr/software:latest

// redeploy
docker stop my-software-container
docker rm my-software-container
docker run -p 4173:4173 bastiencdr/software:latest

// background
docker run -d -p 4173:4173 --name my-software-container bastiencdr/software:latest
docker ps
docker logs <container_id>
docker logs -f <container_id>
docker stop <container_id>
docker restart <container_id>
docker exec -it <container_id> /bin/sh
docker stats <container_id>