# Make sure that the latest commit in the repository is available and compiled 
# on each server in the fleet and then restart the server processes on each 
# server.

# Note that this makes use of a fleet remote, whose configuration is not 
# available on the public GitHub repository.

fleet deploy
fleet exec --drone=\* -- bash bin/deploy-server.sh