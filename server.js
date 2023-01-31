const connectToMongo = require("./db.js");
const express = require("express");
const cors = require("cors");
connectToMongo();

const app = express();
// 3kO7oySIvIymHVfi
// uO6QF5xhAk307KDZ
app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/userRoutes"));
app.use("/admin", require("./routes/adminRoutes.js"));
app.use("/edcourse", require("./routes/portfolioRoutes.js"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EdTech listening at http://localhost:${PORT}`);
});
