const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
});

reveals.forEach(r => observer.observe(r));

window.addEventListener('scroll', () => {
  const tiger = document.querySelector('.tiger-img');
  if(tiger){
    tiger.style.transform = `translateY(${window.scrollY * 0.1}px)`;
  }
});
