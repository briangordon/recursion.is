package is.recursion.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.*;
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
    public String onMessage(String message, Session session) {
        return message;
    }

    @OnClose
    public void onClose(CloseReason reason, Session session) {
        logger.info("WebSocket close for {}", reason.getReasonPhrase());
    }

    @OnError
    public void onError(Throwable t) {
        logger.error("WebSocket error", t);
    }
}