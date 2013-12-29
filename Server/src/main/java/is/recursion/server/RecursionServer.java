package is.recursion.server;

import org.glassfish.grizzly.filterchain.FilterChain;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.tyrus.container.grizzly.server.GrizzlyServerContainer;
import org.glassfish.tyrus.core.TyrusWebSocketEngine;
import org.glassfish.tyrus.server.Server;
import org.glassfish.tyrus.server.TyrusServerContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.bridge.SLF4JBridgeHandler;

import javax.websocket.DeploymentException;
import java.lang.reflect.Field;
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
    private int port;

    public RecursionServer(int port) {
        Map<String, Object> propertiesMap = new HashMap<>();
        propertiesMap.put(TyrusWebSocketEngine.INCOMING_BUFFER_SIZE, INCOMING_BUFFER_SIZE);

        this.server = new Server(null, port, "/", propertiesMap, RecursionEndpoint.class);
        this.port = port;
    }

    public void start() {
        try {
            server.start();
        } catch (DeploymentException e) {
            // This is a dumb thing to be a checked exception
            throw new RuntimeException(e);
        }

        // Tyrus uses a Grizzly HttpServer to listen for the initial HTTP UPGRADE request that signifies a WebSocket
        // connection. Unfortunately, the HttpServer by default adds a Grizzly filter that closes the connection after
        // 30 seconds of inactivity. We need to do some hacking via reflection in order to remove this filter. Note
        // that this will be fixed in Tyrus 1.4: https://java.net/jira/browse/TYRUS-288
        try {
            Field serverField = Server.class.getDeclaredField("server");
            serverField.setAccessible(true);
            Object serverContainer = serverField.get(server); // The field we want is a member of an anonymous class so just use getClass.
            Field serverField2 = serverContainer.getClass().getDeclaredField("server");
            serverField2.setAccessible(true);
            HttpServer httpServer = (HttpServer) serverField2.get(serverContainer);

            FilterChain chain = httpServer.getListener("grizzly").getFilterChain();
            int idleFilterIndex = chain.indexOfType(org.glassfish.grizzly.utils.IdleTimeoutFilter.class);
            chain.remove(idleFilterIndex);
        } catch (IllegalAccessException|NoSuchFieldException e) {
            logger.error("Couldn't remove the IdleTimeoutFilter from the Grizzly FilterChain. Something must have changed internally in Tyrus or Grizzly.", e);
        }

        logger.info("Server running on port {}", port);
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
