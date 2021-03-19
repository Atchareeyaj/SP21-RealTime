/* popup form slider reference by CodeingNepal 
https://www.codingnepalweb.com/2020/06/multi-step-form.html*/

const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelector(".firstNext");
const prevBtnSec = document.querySelector(".prev-1");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const prevBtnForth = document.querySelector(".prev-3");
const nextBtnForth = document.querySelector(".next-3");
const prevBtnFifth = document.querySelector(".prev-4");
const nextBtnFifth = document.querySelector(".next-4");
const prevBtnSixth = document.querySelector(".prev-5");
// const submit = document.querySelector(".submit");
const container = document.querySelector(".container");

nextBtnFirst.addEventListener("click", function(event){
	event.preventDefault();
  slidePage.style.marginLeft = "-20%";
});

prevBtnSec.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "0%";
});

nextBtnSec.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-50%";
});

prevBtnThird.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-20%";
});

nextBtnThird.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-100%";
});

prevBtnForth.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-50%";
});

nextBtnForth.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-200%";
});

prevBtnFifth.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-100%";
});

nextBtnFifth.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-250%";
});

prevBtnSixth.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-200%";
});

