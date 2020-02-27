package org.example;

import com.fasterxml.jackson.annotation.JsonRootName;

@JsonRootName("smallUrl")
public class SmallUrl {

    private String urlPath;

    private SmallUrlData data;

    public String getUrlPath() {
        return urlPath;
    }

    public void setUrlPath(String urlPath) {
        this.urlPath = urlPath;
    }

    public SmallUrlData getData() {
        return data;
    }

    public void setData(SmallUrlData data) {
        this.data = data;
    }

}
