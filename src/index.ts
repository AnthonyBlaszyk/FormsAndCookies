import express from "express";
import nunjucks from "nunjucks";
import cookie from "cookie";

const app = express();
const formParser = express.urlencoded({ extended: true });
let darkMode = false;
let noCookie = true;

app.use(express.static("public"));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.get("/", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  // const colorCookies = cookie.parse(request.get("colorCookie") || "");

  // check if we have cookie
  if (cookies.myCookie === undefined) {
    noCookie = true;
  } else {
    noCookie = false;
  }

  // check if cookie is set to darkMode
  if (cookies.myCookie === "darkMode") {
    darkMode = true;
  } else {
    darkMode = false;
  }

  response.render("home", { darkMode, noCookie, cookies });
});

app.get("/options", (request, response) => {
  response.render("options", { darkMode, noCookie });
});

app.get("/colorOptions", (request, response) => {
  response.render("colorOptions", { darkMode, noCookie });
});

app.post("/handle-form", formParser, (request, response) => {
  // request.body contains an object with our named fields
  const cookieValue = request.body;

  if (cookieValue.cookie === "deleteCookie") {
    response.set(
      "Set-Cookie",
      cookie.serialize("myCookie", "", {
        maxAge: 0,
      }),
    );
  } else {
    response.set(
      "Set-Cookie",
      cookie.serialize("myCookie", cookieValue.cookie, {
        maxAge: 3600, // This is the time (in seconds) that this cookie will be stored
      }),
    );
  }

  response.redirect("/");
});

app.post("/handleColor-form", formParser, (request, response) => {
  // request.body contains an object with our named fields
  const cookieColorValue = request.body;

  response.set(
    "Set-Cookie",
    cookie.serialize("cookieForColor", cookieColorValue.colorCookie, {
      maxAge: 3600, // This is the time (in seconds) that this cookie will be stored
    }),
  );

  response.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
