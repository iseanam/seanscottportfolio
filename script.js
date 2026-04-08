// reveal
const obs = new IntersectionObserver(entries=>{
 entries.forEach(e=>{
  if(e.isIntersecting) e.target.classList.add('visible');
 });
});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// tiger parallax
window.addEventListener('scroll',()=>{
 const tiger=document.querySelector('.tiger');
 if(tiger){
  tiger.style.transform=`translateY(${window.scrollY*0.12}px)`;
 }
});

// backend gallery fetch
const gallery = document.getElementById("gallery");
const API = "https://your-backend-url.onrender.com/images";

fetch(API)
  .then(res=>res.json())
  .then(data=>{
    gallery.innerHTML = data.map(img=>`<img src="${img.url}">`).join('');
  })
  .catch(()=> gallery.innerHTML = "<p>Gallery loading...</p>");
