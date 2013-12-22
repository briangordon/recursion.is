# Deployment script to be executed on the server by deploy.sh.

# Compile and package the server
mvn package
echo "Build complete."

# Check to see if the server process is running
daemon --name recursiond --running

if [ $? -eq 0 ]
then
    echo "The server process is already running. Killing it."
    
    # The server process is running so stop it
    daemon --name recursiond --stop
fi

echo "Starting the server process."

# Start the server process
daemon --name recursiond --respawn --chdir=`pwd` --verbose -- java -jar Server/target/Server-1.0-SNAPSHOT.jar

echo "Server process running."