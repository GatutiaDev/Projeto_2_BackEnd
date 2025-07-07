const express = require("express");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "um_segredo_muito_forte_e_dificil_de_adivinhar",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Servidor iniciado com sucesso!`);
  console.log(`Acesse em http://localhost:${port}`);
});
