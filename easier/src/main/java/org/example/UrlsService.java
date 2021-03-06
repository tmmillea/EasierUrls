package org.example;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.RandomStringUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * Root resource (exposed at "easier" path)
 */
@Path("/")
public class UrlsService {

    private static LinkedHashMap<String, SmallUrlData> urlMap = new LinkedHashMap<>();
    private static long pathValue = 0;

    /**
     * Returns all small urls, their targets, and how many uses until they expire.
     *
     * @return Json list of url objects
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response urlList() {
        List<SmallUrl> smallUrlList = new ArrayList<>(urlMap.size());
        for(String urlPath : urlMap.keySet()) {
            SmallUrl smallUrl = new SmallUrl();
            SmallUrlData smallUrlData = urlMap.get(urlPath);
            smallUrl.setUrlPath(urlPath);
            smallUrl.setData(smallUrlData);
            smallUrlList.add(smallUrl);
        }
        SmallUrlList jsonList = new SmallUrlList();
        jsonList.setSmallUrlList(smallUrlList);
        ObjectMapper om = new ObjectMapper();
        String json;
        try {
            json = om.writeValueAsString(jsonList);
        } catch(JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return Response.ok().entity(json).build();
    }

    @GET
    @Path("/{urlPath}")
    public Response redirectToTarget(@PathParam("urlPath") String urlPath) {
        SmallUrlData targetData = urlMap.get(urlPath);
        if(targetData == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        URI destinationURI;
        try{
            destinationURI = new URI(targetData.getTarget());
        } catch(URISyntaxException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        int remaining = targetData.getRemaining() - 1;
        if(remaining <= 0) {
            urlMap.remove(urlPath);
        } else {
            targetData.setRemaining(remaining);
            urlMap.put(urlPath, targetData);
        }
        return Response.temporaryRedirect(destinationURI).build();
    }

    @PUT
    @Produces(MediaType.TEXT_PLAIN)
    public Response addUrl(String target) {
        try{
            URI testUri = new URI(target);
        } catch(URISyntaxException e) {
            return Response.status(Response.Status.BAD_REQUEST.getStatusCode(),
                    "Invalid Url").build();
        }
        String newPath = RandomStringUtils.randomAlphanumeric(12);
        while(urlMap.containsKey(newPath)) {
            newPath = RandomStringUtils.randomAlphanumeric(12);
        }
        SmallUrlData data = new SmallUrlData();
        data.setTarget(target);
        data.setRemaining(10);
        urlMap.put(newPath, data);
        return Response.status(Response.Status.ACCEPTED).entity(newPath).build();
    }

    @DELETE
    public Response clean() {
        urlMap.clear();
        return Response.ok().build();
    }
}
