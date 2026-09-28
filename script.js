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
const toast=document.querySelector('#toast');
form.addEventListener('submit',event=>{event.preventDefault();toast.textContent='상담 폼 화면이 정상 작동합니다. 실제 전송 연동이 필요합니다.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)});
