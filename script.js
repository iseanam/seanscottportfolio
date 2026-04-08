const API = "https://your-backend-url.onrender.com";

const gallery = document.getElementById("gallery");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginSubmit = document.getElementById("loginSubmit");
const passwordInput = document.getElementById("password");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const ownerPanel = document.getElementById("ownerPanel");
const uploadArea = document.getElementById("uploadArea");
const status = document.getElementById("status");

let token = localStorage.getItem("token");

function loadGallery(){
 fetch(API + "/images")
  .then(r=>r.json())
  .then(data=>{
    gallery.innerHTML = data.map(i=>`<img src="${i.url}">`).join('');
  });
}

loadGallery();

loginBtn.onclick = () => ownerPanel.classList.toggle("hidden");

loginSubmit.onclick = () => {
 fetch(API + "/login", {
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({password:passwordInput.value})
 })
 .then(r=>r.json())
 .then(d=>{
  token = d.token;
  localStorage.setItem("token", token);
  uploadArea.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  status.innerText="Owner";
 });
};

logoutBtn.onclick = ()=>{
 localStorage.removeItem("token");
 location.reload();
};

uploadBtn.onclick = ()=>{
 const form = new FormData();
 form.append("image", fileInput.files[0]);

 fetch(API + "/upload", {
  method:"POST",
  headers:{Authorization:"Bearer "+token},
  body:form
 }).then(()=> loadGallery());
};

// animations
const obs = new IntersectionObserver(entries=>{
 entries.forEach(e=>{
  if(e.isIntersecting) e.target.classList.add("visible");
 });
});
document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
