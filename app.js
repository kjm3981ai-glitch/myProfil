const toggle=document.querySelector('.toggle'),nav=document.querySelector('.nav nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('.faq button').forEach(b=>b.addEventListener('click',()=>{const item=b.parentElement,open=item.classList.toggle('open');b.setAttribute('aria-expanded',open)}));
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
document.querySelector('#inquiry').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const subject=encodeURIComponent('강의 미팅 요청');const body=encodeURIComponent(`회사명/소속: ${d.get('company')}\n담당자명: ${d.get('name')}\n연락처: ${d.get('phone')}\n\n교육 목적/해결할 업무:\n${d.get('task')}`);location.href=`mailto:kjm3981ai@gmail.com?subject=${subject}&body=${body}`});
