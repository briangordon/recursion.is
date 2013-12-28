package is.recursion.server;

import org.glassfish.tyrus.core.TyrusWebSocketEngine;
import org.glassfish.tyrus.server.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.bridge.SLF4JBridgeHandler;

import javax.websocket.DeploymentException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

/**
 * Instantiates and starts a standalone Tyrus server on the given port.
 */
public class RecursionServer {
    private static final Logger logger = LoggerFactory.getLogger(RecursionServer.class);

    private static final int INCOMING_BUFFER_SIZE = 1048576; // 1 megabyte
    private static final int DEFAULT_PORT = 1123;

    private Server server;

    public RecursionServer(int port) {
        Map<String, Object> propertiesMap = new HashMap<>();
        propertiesMap.put(TyrusWebSocketEngine.INCOMING_BUFFER_SIZE, INCOMING_BUFFER_SIZE);

        server = new Server(null, port, "/", propertiesMap, RecursionEndpoint.class);
    }

    public void start() {
        try {
            server.start();
        } catch (DeploymentException e) {
            // This is a dumb thing to be a checked exception
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        // Redirect GlassFish's java.util.logging nonsense to SLF4J
        SLF4JBridgeHandler.removeHandlersForRootLogger();
        SLF4JBridgeHandler.install();

        int port = DEFAULT_PORT;

        // Try to read the port from the system properties
        String portString;
        if((portString = System.getProperty("server.port")) != null) {
            try {
                port = Integer.parseInt(portString);
            } catch (NumberFormatException ex) {
                logger.error("Couldn't parse server.port system property as an Integer.", ex);
            }
        }

        RecursionServer server = new RecursionServer(port);
        server.start();

        // Tyrus spawns all of its threads as daemon threads so we need to prop open the JVM with a blocking call.
        try {
            while(true) {
                new CountDownLatch(1).await();
            }
        } catch (InterruptedException e) {
            logger.error("Interrupted main thread.", e);
        }
    }
}
