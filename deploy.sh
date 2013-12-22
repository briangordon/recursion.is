# Deployment script to be executed with "fleet exec -- bash deploy.sh"

# Compile and package the server
mvn package

# Stop the server process
daemon --name recursiond --stop

# Start the server process
daemon --name recursiond --respawn -- java -jar Server/target/Server-1.0-SNAPSHOT.jar