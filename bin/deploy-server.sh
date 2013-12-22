# Deployment script to be executed on the server by deploy.sh.

echo "Building project..."

# Compile and package the server
mvn package > /dev/null

if [ $? -ne 0 ]
then
    echo "The build failed! Aborting."
    exit 1;
fi

echo "Build succeeded."
    

# Check to see if the server process is running
daemon --name recursiond --running

if [ $? -eq 0 ]
then
    echo "The server process is already running. Killing it."
    
    # The server process is running so stop it
    daemon --name recursiond --stop

    # Sleep to give the client process a chance to die
    sleep 3s
fi

echo "Starting the server process..."

# Start the server process
daemon --name recursiond --respawn --chdir=`pwd` --output=server_out -- java -jar Server/target/Server-1.0-SNAPSHOT.jar

echo "Server process running."