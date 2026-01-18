const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// ✅ Default route to home.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/api/projects", (req, res) => {
  const projectsDir = path.join(__dirname, "projects");
  const projects = [];

  fs.readdirSync(projectsDir, {
    withFileTypes: true
  }).forEach(dir => {
    if (!dir.isDirectory()) return;

    const projectPath = path.join(projectsDir, dir.name);
    const infoPath = path.join(projectPath, "info.json");

    let description = "";
    let projectLink = "#";

    // default local preview
    let preview = `/projects/${dir.name}/preview.png`;

    if (fs.existsSync(infoPath)) {
      const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));

      description = info.description || "";
      projectLink = info["project-link"] || "#";

      // ✅ use web image if provided
      if (info["img-preview"]) {
        preview = info["img-preview"];
      }
    }

    projects.push({
      name: dir.name,
      preview,
      description,
      link: projectLink
    });
  });

  res.json(projects);
});

app.get("/api/certificates", (req, res) => {
  const certsDir = path.join(__dirname, "certificates");
  const certs = [];

  if (fs.existsSync(certsDir)) {
    fs.readdirSync(certsDir).forEach(file => {
      const ext = path.extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) {
        certs.push(`/certificates/${file}`);
      }
    });
  }

  res.json(certs);
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});