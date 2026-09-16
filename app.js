// EmailJS 설정값: 공개 키와 템플릿 식별자를 이곳에서만 관리합니다.
const SITE_URL = "https://my-profil-seven.vercel.app/";
const EMAILJS_PUBLIC_KEY = "MEySnqIBX-ubo7Co0";
const EMAILJS_SERVICE_ID = "service_neapuy_profile";
const EMAILJS_TEMPLATE_ID = "template_lb0we35"; // 접수 알림
const EMAILJS_AUTOREPLY_ID = "template_62qcpmr"; // 자동회신
const INQUIRY_RECIPIENT = "kjm3981ai@gmail.com";

const toggle = document.querySelector('.toggle');
const nav = document.querySelector('.nav nav');
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
document.querySelectorAll('.faq button').forEach((button) => button.addEventListener('click', () => { const item = button.parentElement; const open = item.classList.toggle('open'); button.setAttribute('aria-expanded', open); }));
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); } }), { threshold: .1 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const form = document.querySelector('#inquiry');
if (form) {
const consent = form.querySelector('[name="privacy_consent"]');
const submitButton = form.querySelector('[type="submit"]');
const consentGuide = form.querySelector('.consent-guide');
const status = form.querySelector('.form-status');
const setStatus = (message, type = '') => { status.textContent = message; status.className = `form-status ${type}`; };
const setConsentState = () => { submitButton.disabled = !consent.checked; consentGuide.hidden = consent.checked; };
consent.addEventListener('change', setConsentState);
setConsentState();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!consent.checked) { consentGuide.hidden = false; setStatus('개인정보 수집 · 이용에 동의해 주세요.', 'error'); return; }
  if (!form.checkValidity()) { form.reportValidity(); setStatus('이름, 이메일, 문의 내용을 확인해 주세요.', 'error'); return; }
  if (!window.emailjs) { setStatus('문의 전송 도구를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', 'error'); return; }
  const now = new Date();
  const timestamp = now.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
  form.elements.reply_to.value = form.elements.from_email.value;
  form.elements.submitted_at.value = timestamp;
  form.elements.page_url.value = window.location.href || SITE_URL;
  form.elements.privacy_agreed.value = '동의';
  form.elements.agreed_at.value = timestamp;
  form.elements.to_email.value = INQUIRY_RECIPIENT;
  const templateParams = Object.fromEntries(new FormData(form).entries());
  delete templateParams.privacy_consent;
  submitButton.disabled = true;
  setStatus('문의 내용을 전송하고 있습니다.', 'loading');
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, templateParams);
    form.reset();
    form.elements.privacy_agreed.value = '미동의';
    form.elements.agreed_at.value = '';
    setConsentState();
    setStatus('문의가 정상적으로 접수되었습니다. 확인 메일을 보내드렸습니다.', 'success');
  } catch (error) {
    console.error('EmailJS 전송 실패:', error);
    setStatus('전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.', 'error');
    setConsentState();
  }
});
}
