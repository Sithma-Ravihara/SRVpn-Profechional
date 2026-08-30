const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const codesFile = path.join(__dirname, "codes.json");

// Middleware
app.use(express.json());

// Online users counter
let onlineUsers = 0;

app.use((req, res, next) => {
  onlineUsers++;

  res.on("finish", () => {
    onlineUsers--;
  });

  next();
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Get VPN codes
app.get("/api/codes", (req, res) => {
  try {
    const data = fs.readFileSync(codesFile, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to read codes.json"
    });
  }
});

// Update VPN codes
app.post("/api/update", (req, res) => {
  try {
    fs.writeFileSync(
      codesFile,
      JSON.stringify(req.body, null, 2),
      "utf8"
    );

    res.json({
      success: true,
      message: "Updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Unable to update codes.json"
    });
  }
});

// Online users
app.get("/api/users", (req, res) => {
  res.json({
    users: onlineUsers
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SRVpn Server Running on port ${PORT}`);
});
