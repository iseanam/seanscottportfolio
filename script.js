const obs = new IntersectionObserver(entries=>{
 entries.forEach(e=>{
  if(e.isIntersecting) e.target.classList.add('visible');
 });
});

document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

window.addEventListener('scroll',()=>{
 const tiger = document.querySelector('.tiger');
 if(tiger){
  tiger.style.transform = `translateY(${window.scrollY*0.1}px)`;
 }
});
