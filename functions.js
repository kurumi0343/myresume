async function loadProjects() {
  const res = await fetch("/api/projects");
  const projects = await res.json();

  console.log(projects); // 🔍 DEBUG THIS

  const grid = document.getElementById("project-grid");

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
      if (p.link && p.link !== "#") {
        window.open(p.link, "_blank");
      }
    });

    grid.appendChild(box);
  });
}


document.addEventListener("DOMContentLoaded", loadProjects);


async function loadCertificates() {
  const res = await fetch("/api/certificates");
  const certs = await res.json();
  const grid = document.getElementById("cert-grid");

  certs.forEach(cert => {
    const certBox = document.createElement("div");
    certBox.className = "cert-box";
    certBox.innerHTML = `<img src="${cert}" alt="Certificate">`;

    // Add click event for preview
    certBox.querySelector("img").addEventListener("click", () => {
      document.getElementById("preview-img").src = cert;
      document.getElementById("cert-preview").style.display = "flex";
    });

    grid.appendChild(certBox);
  });

  // Close button
  document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("cert-preview").style.display = "none";
  });

  // Close on outside click
  document.getElementById("cert-preview").addEventListener("click", (e) => {
    if (e.target.id === "cert-preview") {
      document.getElementById("cert-preview").style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cert-grid")) {
    loadCertificates();
  }
});