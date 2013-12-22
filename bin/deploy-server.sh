# Deployment script to be executed on the server by deploy.sh.

# Compile and package the server
mvn package

# Check to see if the server process is running
daemon --name recursiond --running

if [ $? -eq 0 ]
then
    # The server process is running so stop it
    daemon --name recursiond --stop
fi

# Start the server process
daemon --name recursiond --respawn -- java -jar Server/target/Server-1.0-SNAPSHOT.jar