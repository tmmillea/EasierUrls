package org.example;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.glassfish.grizzly.http.server.HttpServer;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class UrlsServiceTest {

    private HttpServer server;
    private WebTarget target;

    @Before
    public void setUp() throws Exception {
        // start the server
        server = Main.startServer();
        // create the client
        Client c = ClientBuilder.newClient();

        // uncomment the following line if you want to enable
        // support for JSON in the client (you also have to uncomment
        // dependency on jersey-media-json module in pom.xml and Main.startServer())
        // --
        // c.configuration().enable(new org.glassfish.jersey.media.json.JsonJaxbFeature());

        target = c.target(Main.BASE_URI);
    }

    @After
    public void tearDown() throws Exception {
        target.request().delete();
        server.stop();
    }

    @Test
    public void testInvalidUrl() {
        Response response = target.path("/").request().put(Entity.entity("invali d/Uri", MediaType.TEXT_PLAIN));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        assertEquals("Invalid Url", response.getStatusInfo().getReasonPhrase());
    }

    @Test
    public void testUrlRedirect() {
        String googlePath = target.path("/").request().put(
                Entity.entity("https://google.com", MediaType.TEXT_PLAIN)).readEntity(String.class);
        String intuitPath = target.path("/").request().put(
                Entity.entity("https://intuit.com", MediaType.TEXT_PLAIN)).readEntity(String.class);
        Response googleResponse = target.path("/" + googlePath).request().get();
        Response amazonResponse = target.path("/" + intuitPath).request().get();
        Response notFoundResponse = target.path("/0000AAAA").request().get();
        assertEquals(Response.Status.TEMPORARY_REDIRECT.getStatusCode(), googleResponse.getStatus());
        assertEquals("https://google.com", googleResponse.getHeaders().get("Location").get(0));
        assertEquals(Response.Status.TEMPORARY_REDIRECT.getStatusCode(), amazonResponse.getStatus());
        assertEquals("https://intuit.com", amazonResponse.getHeaders().get("Location").get(0));
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), notFoundResponse.getStatus());
    }

    @Test
    public void testGetListOfLinks() throws Exception{
        Response emptyResponse = target.path("/").request().get();
        assertEquals(Response.Status.OK.getStatusCode(), emptyResponse.getStatus());
        target.path("/").request().put(
                Entity.entity("https://google.com", MediaType.TEXT_PLAIN)).readEntity(String.class);
        target.path("/").request().put(
                Entity.entity("https://intuit.com", MediaType.TEXT_PLAIN)).readEntity(String.class);
        Response linksResponse = target.path("/").request().get();
        ObjectMapper om = new ObjectMapper();
        SmallUrlList list = om.readValue(linksResponse.readEntity(String.class), SmallUrlList.class);
        assertEquals(2, list.getSmallUrlList().size());
        assertEquals("https://google.com", list.getSmallUrlList().get(0).getData().getTarget());
        assertEquals("https://intuit.com", list.getSmallUrlList().get(1).getData().getTarget());
        for(int i = 0; i < 10; i++) {
            target.path("/" + list.getSmallUrlList().get(1).getUrlPath()).request().get();
        }
        Response secondLinksResponse = target.path("/").request().get();
        list = om.readValue(secondLinksResponse.readEntity(String.class), SmallUrlList.class);
        assertEquals(1, list.getSmallUrlList().size());
        assertEquals("https://google.com", list.getSmallUrlList().get(0).getData().getTarget());
    }
}
