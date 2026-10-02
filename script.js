const header=document.querySelector('#header');
const menuBtn=document.querySelector('#menuBtn');
const nav=document.querySelector('#nav');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>20));
menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const delay=entry.target.dataset.delay||0;setTimeout(()=>entry.target.classList.add('visible'),delay);revealObserver.unobserve(entry.target)}}),{threshold:.13});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const track=document.querySelector('#reviewTrack');
const cards=[...track.children];
const prevButton=document.querySelector('#reviewPrev');
const nextButton=document.querySelector('#reviewNext');
const reviewStatus=document.querySelector('#reviewStatus');
let reviewIndex=0;
let reviewAnimating=false;

function cardsVisible(){return innerWidth<=600?1:innerWidth<=900?2:3}
function reviewLastIndex(){return Math.max(0,cards.length-cardsVisible())}
function updateReviewPosition(){
  const visible=cardsVisible();
  reviewIndex=Math.max(0,Math.min(reviewIndex,reviewLastIndex()));
  const gap=20;
  const cardWidth=(track.parentElement.clientWidth-gap*(visible-1))/visible;
  track.style.transform=`translateX(-${reviewIndex*(cardWidth+gap)}px)`;
  prevButton.disabled=reviewIndex===0;
  nextButton.disabled=reviewIndex===reviewLastIndex();
  reviewStatus.textContent=`${reviewIndex+1} / ${reviewLastIndex()+1}`;
}
function animateVisibleReviews(){
  const visible=cardsVisible();
  cards.forEach(card=>{card.classList.remove('review-pop');card.style.animationDelay=''});
  cards.slice(reviewIndex,reviewIndex+visible).forEach((card,index)=>{
    void card.offsetWidth;
    card.style.animationDelay=`${index*90}ms`;
    card.classList.add('review-pop');
  });
}
function changeReview(step){
  if(reviewAnimating)return;
  const nextIndex=Math.max(0,Math.min(reviewIndex+step,reviewLastIndex()));
  if(nextIndex===reviewIndex)return;
  reviewAnimating=true;
  track.classList.add('is-switching');
  setTimeout(()=>{
    reviewIndex=nextIndex;
    updateReviewPosition();
    track.classList.remove('is-switching');
    animateVisibleReviews();
    setTimeout(()=>{reviewAnimating=false},650);
  },180);
}
prevButton.addEventListener('click',()=>changeReview(-1));
nextButton.addEventListener('click',()=>changeReview(1));
window.addEventListener('resize',()=>{reviewAnimating=false;track.classList.remove('is-switching');updateReviewPosition()});
updateReviewPosition();

const feature=document.querySelector('#galleryFeature');
const featureImage=document.querySelector('#galleryFeatureImage');
const featureLabel=document.querySelector('#galleryFeatureLabel');
const galleryCounter=document.querySelector('#galleryCounter');
const thumbs=[...document.querySelectorAll('.gallery-thumb')];
function selectWork(index){const thumb=thumbs[index];featureImage.style.opacity='0';setTimeout(()=>{featureImage.src=thumb.dataset.src;featureImage.alt=thumb.dataset.alt;feature.dataset.full=thumb.dataset.src;featureLabel.textContent=thumb.dataset.label;featureImage.style.opacity='1'},140);thumbs.forEach((item,itemIndex)=>{const selected=itemIndex===index;item.classList.toggle('active',selected);item.setAttribute('aria-selected',String(selected))});galleryCounter.textContent=`${String(index+1).padStart(2,'0')} / ${String(thumbs.length).padStart(2,'0')}`;thumb.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'})}
thumbs.forEach((thumb,index)=>thumb.addEventListener('click',()=>selectWork(index)));

const lightbox=document.querySelector('#lightbox');
const lightboxImage=document.querySelector('#lightboxImage');
const lightboxClose=document.querySelector('#lightboxClose');
feature.addEventListener('click',()=>{lightboxImage.src=feature.dataset.full;lightboxImage.alt=featureImage.alt;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');lightboxClose.focus()});
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImage.src=''}
lightboxClose.addEventListener('click',closeLightbox);
lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeLightbox()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&lightbox.classList.contains('open'))closeLightbox()});

const form=document.querySelector('#estimateForm');
const formStatus=document.createElement('div');
formStatus.setAttribute('role','status');
formStatus.setAttribute('aria-live','polite');
formStatus.className='estimate-status';
formStatus.tabIndex=-1;
formStatus.hidden=true;
function showEstimateStatus(state,title,message,focus=false){
  formStatus.className='estimate-status is-'+state;
  formStatus.hidden=false;
  const icon=document.createElement('span');
  icon.className='estimate-status-icon';
  icon.setAttribute('aria-hidden','true');
  icon.textContent=state==='success'?'✓':state==='sending'?'…':'!';
  const heading=document.createElement('strong');
  heading.textContent=title;
  const detail=document.createElement('p');
  detail.textContent=message;
  const copy=document.createElement('div');
  copy.append(heading,detail);
  formStatus.replaceChildren(icon,copy);
  if(focus){
    formStatus.focus({preventScroll:true});
    formStatus.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
  }
}
form.appendChild(formStatus);
let estimateSending=false;
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(estimateSending || !form.reportValidity())return;
  const data=new FormData(form);
  const params={
    name:String(data.get('name')||'').trim(),
    phone:String(data.get('phone')||'').trim(),
    area:String(data.get('area')||'').trim(),
    service:data.getAll('service').join(', ')||'상담 후 결정',
    message:String(data.get('message')||'').trim()
  };
  if(!params.name || !params.phone || !params.area){
    showEstimateStatus('error','입력 내용을 확인해주세요','성함, 연락처, 시공 지역을 입력해주세요.',true);
    return;
  }
  const submit=form.querySelector('button[type="submit"]');
  const original=submit.innerHTML;
  estimateSending=true;
  submit.disabled=true;
  submit.textContent='문의 전송 중…';
  form.setAttribute('aria-busy','true');
  showEstimateStatus('sending','문의 전송 중입니다','잠시만 기다려주세요.');
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),20000);
  try{
    const response=await fetch('https://api.emailjs.com/api/v1.0/email/send',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        service_id:'service_3n2iayh',
        template_id:'template_5f28t9o',
        user_id:'7Lc7nsCsxT6p6Ns-B',
        template_params:params
      }),
      signal:controller.signal
    });
    if(!response.ok)throw new Error('Email delivery request failed');
    showEstimateStatus('success','견적 문의가 접수되었습니다!','정상적으로 발송되었습니다. 확인 후 입력하신 연락처로 안내드리겠습니다.',true);
    form.reset();
  }catch(error){
    showEstimateStatus('error',error.name==='AbortError'?'전송 결과 확인이 필요합니다':'문의가 발송되지 않았습니다',error.name==='AbortError'
      ?'전송 결과를 확인하지 못했습니다. 중복 접수를 피하려면 010-5790-4009로 확인해주세요.'
      :'문의 전송에 실패했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도하거나 010-5790-4009로 연락해주세요.',true);
  }finally{
    clearTimeout(timeout);
    estimateSending=false;
    submit.disabled=false;
    submit.innerHTML=original;
    form.removeAttribute('aria-busy');
  }
});
