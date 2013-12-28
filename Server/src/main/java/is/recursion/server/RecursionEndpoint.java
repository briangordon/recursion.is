package is.recursion.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

/**
 * Endpoint class which handles messages from the client.
 */
@ServerEndpoint("/")
public class RecursionEndpoint {
    private static final Logger logger = LoggerFactory.getLogger(RecursionEndpoint.class);

    @OnOpen
    public void onOpen(Session session) throws IOException {
        logger.info("Opened WebSocket connection {}", session.getId());
    }

    @OnMessage
    public String echo(String message) {
        return message;
    }

    @OnError
    public void onError(Throwable t) {
        logger.error("WebSocket error", t);
    }
}