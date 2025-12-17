require("dotenv").config();
const http = require("http");
const connectDB = require("./config/db");
const app = require("./app");
const MenuService = require("./services/menu.service");

const PORT = process.env.PORT || 6969;

connectDB().then(async () => {
  // Reset and initialize default menus (for development)
  // In production, you might want to conditionally reset menus
  await MenuService.resetMenus();
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});