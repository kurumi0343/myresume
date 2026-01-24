const content = document.getElementById("content");
const navLinks = document.querySelectorAll(".nav-links a");

function clearContent() {
  content.innerHTML = "";
}

async function loadPage(page) {
  clearContent();

  if (page === "home") {
    content.innerHTML = `
      <h1>Welcome to My Portfolio</h1>
      <p>Hi, I’m Jet. Explore my resume, projects, and certificates using the menu above.</p>
    `;
  }

  else if (page === "projects") {
    content.innerHTML = `<h1>Projects</h1><div id="project-grid" class="project-grid"></div>`;
    const grid = document.getElementById("project-grid");

    const res = await fetch("/api/projects");
    const projects = await res.json();

    projects.forEach(p => {
      const box = document.createElement("div");
      box.className = "project-box";
      box.innerHTML = `
        <img src="${p.preview}" alt="${p.name}">
        <div class="content">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
        </div>
      `;
      box.addEventListener("click", () => {
        if (p.link && p.link !== "#") window.open(p.link, "_blank");
      });
      grid.appendChild(box);
    });
  }

  else if (page === "resume") {
    content.innerHTML = `
      <h1>My Resume</h1>
      <p>You can view my resume below or download a copy.</p>
      <a href="/resume/resume.pdf" download class="resume-btn">Download Resume</a>
      <div class="pdf-container">
        <img src="/resume/resume-preview.jpg" alt="My Resume" class="resume-img">
      </div>
    `;
  }

  else if (page === "certificates") {
    content.innerHTML = `
      <h1>Certificates</h1>
      <p>Here are my certificates:</p>
      <div id="cert-preview" class="cert-preview">
        <span class="close-btn">&times;</span>
        <img id="preview-img" src="" alt="Certificate Preview">
      </div>
      <div id="cert-grid" class="cert-grid"></div>
    `;

    const grid = document.getElementById("cert-grid");
    const res = await fetch("/api/certificates");
    const certs = await res.json();

    certs.forEach(cert => {
      const certBox = document.createElement("div");
      certBox.className = "cert-box";
      certBox.innerHTML = `<img src="${cert}" alt="Certificate">`;
      certBox.querySelector("img").addEventListener("click", () => {
        document.getElementById("preview-img").src = cert;
        document.getElementById("cert-preview").style.display = "flex";
      });
      grid.appendChild(certBox);
    });

    document.querySelector(".close-btn").addEventListener("click", () => {
      document.getElementById("cert-preview").style.display = "none";
    });

    document.getElementById("cert-preview").addEventListener("click", e => {
      if (e.target.id === "cert-preview") {
        document.getElementById("cert-preview").style.display = "none";
      }
    });
  }
}


navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const page = link.dataset.page;

    setCookie("currentPage", page); // ✅ save SPA state
    loadPage(page);

    history.replaceState(null, "", "/");
  });
});

function setCookie(name, value, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}


const savedPage = getCookie("currentPage") || "home";
loadPage(savedPage);

