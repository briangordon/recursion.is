package is.recursion;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class HiServer extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/plain");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().println("Hi");
    }

    public static void main(String[] args) throws Exception {
        Server server = new Server(1123);
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.NO_SECURITY);
        server.setHandler(context);
        context.addServlet(new ServletHolder(new HiServer()), "/*");
        server.start();
    }
}
