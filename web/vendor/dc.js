(function() {
  var dc, home, id, page, referrer, title, url;
  window.dc_opts = {
    clientId: "b1c1e826-0e69-4fc5-b8c6-1205f6b23118",
    home: "https://www.dailycred.com"
  };
  id = dc_opts.clientId;
  home = "https://www.dailycred.com";
  page = encodeURIComponent(document.location.href);
  title = document.title ? document.title : "";
  referrer = document.referrer ? encodeURIComponent(document.referrer) : "";
  dc = document.createElement("img");
  url = "" + home + "/dc.gif?url=" + page + "&title=" + title + "&client_id=" + window.dc_opts.clientId + "&referrer=" + referrer;
  dc.src = url;
  document.body.appendChild(dc);
}).call(this);