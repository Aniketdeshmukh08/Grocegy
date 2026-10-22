// animation initializing-AOS
AOS.init();

// header-top-options-------------------------------
function selectBoxHandler(selector) {
  const countryTop = document.querySelector(`#${selector}`);
  const selectBoxBody = document.querySelector(`#${selector} .slectbox-body`);
  if (selectBoxBody.style.display === "none") {
    selectBoxBody.style.display = "block";
    if (countryTop) {
      let countryOption = countryTop.querySelectorAll(".all-option"),
        countryBtn_text = countryTop.querySelector(".item-text");
      countryOption.forEach((option) => {
        option.addEventListener("click", () => {
          let selectedOption = option.querySelector(".item-text").innerText;
          // countrybtn-text
          countryBtn_text.innerHTML = selectedOption;
          selectBoxBody.style.display = "none";
        });
      });
    }
  } else {
    selectBoxBody.style.display = "none";
  }
}

// category submenu---------------------------------
let submenu = document.getElementById("subMenu");
let empt = document.querySelector(".empty");

function tooglmenu() {
  submenu.classList.toggle("open-dropdown");
  empt.classList.toggle("active");
}

// additional heights for submenu
function heightanimation(ele) {
  const els = document.querySelectorAll(`#${ele}`);
  els.forEach((item) => {
    const height = item.scrollHeight;
    item.style.setProperty("--max-height", `${height}px`);
  });
}
heightanimation("subMenu");

// hero-swiper-------------------------------------
var swiper = new Swiper(".hero-swiper", {
  spaceBetween: 30,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  // autoplay: {
  //   delay: 2500,
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// about-swiper-------------------------------------
var swiper = new Swiper(".about-swiper", {
  spaceBetween: 30,
  slidesPerView: 3,
  roundLengths: true,
  loop: true,
  loopAdditionalSlides: 30,
  // autoplay: {
  //   delay: 2500,
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1260: {
      slidesPerView: 2.5,
    },
  },
});

// product-details-----------------------------------
var swiper = new Swiper(".product-bottom", {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 4,
});
var swiper2 = new Swiper(".product-top", {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});

// product-size-dropdown-------------------------------
let pdSize = document.querySelector(".product-size");
if (pdSize) {
  (pdBtn = pdSize.querySelector(".size-section")),
    (pdOption = pdSize.querySelectorAll(".option")),
    (pdBtn_Text = pdSize.querySelector(".size-text")),
    (pdBtn_Text2 = pdSize.querySelector(".toggle-btn2"));

  pdOption.forEach((option) => {
    pdBtn.addEventListener("click", () => pdSize.classList.toggle("active"));
    option.addEventListener("click", () => {
      let selectedOption = option.querySelector(".option-text").innerText;
      let selectedOption2 = option.querySelector(".option-measure").innerText;
      // pdbtn-text2
      pdBtn_Text.innerHTML = selectedOption;
      pdBtn_Text2.innerHTML = selectedOption2;

      pdSize.classList.remove("active");
    });
  });
}

// range slider----------------------------------------
function priceslider() {
  if ($("#slider-tooltips").length > 0) {
    var tooltipSlider = document.getElementById("slider-tooltips");

    var formatForSlider = {
      from: function (formattedValue) {
        return Number(formattedValue);
      },
      to: function (numericValue) {
        return Math.round(numericValue);
      },
    };

    noUiSlider.create(tooltipSlider, {
      start: [40, 346],
      connect: true,
      format: formatForSlider,
      range: {
        min: 0,
        max: 400,
      },
    });
    var formatValues = [
      document.getElementById("slider-margin-value-min"),
      document.getElementById("slider-margin-value-max"),
    ];
    tooltipSlider.noUiSlider.on("update", function (values, handle, unencoded) {
      formatValues[0].innerHTML = "Price: " + "$" + values[0];
      formatValues[1].innerHTML = "$" + values[1];
    });
  }
}
priceslider();

// Dashboard-switch-----------------------------------
function switchDashboard() {
  const toggleBtn = document.querySelector(".switch-icon");
  toggleBtn.classList.toggle("active");
}

// modal-------------------------------------------
function modalAction(elemnt) {
  const moalMain = document.querySelector(elemnt);
  if (moalMain.classList.contains("active")) {
    moalMain.classList.remove("active");
  } else {
    moalMain.classList.add("active");
  }
}

// image-uploader

let uploadImg = document.querySelector("#upload-img");
let inputFile = document.querySelector("#input-file");
if (inputFile) {
  inputFile.onchange = function () {
    uploadImg.src = URL.createObjectURL(inputFile.files[0]);
  };
}

// image-uploader-2
let coverImg = document.querySelector("#cover-img");
let coverFile = document.querySelector("#cover-file");
if (coverFile) {
  coverFile.onchange = function () {
    coverImg.src = URL.createObjectURL(coverFile.files[0]);
  };
}

// countdown----------
function CountDown(lastDate) {
  const selectDay = document.getElementById("day");
  const selectHour = document.getElementById("hour");
  const selectMinute = document.getElementById("minute");
  const selectSecound = document.getElementById("second");
  if (selectDay && selectHour && selectMinute && selectSecound) {
    let showDate = "";
    let showHour = "";
    let showMinute = "";
    let showSecound = "";
    // count Down
    const provideDate = new Date(lastDate);
    // format date
    const year = provideDate.getFullYear();
    const month = provideDate.getMonth();
    const date = provideDate.getDate();
    const hours = provideDate.getHours();
    const minutes = provideDate.getMinutes();
    const seconds = provideDate.getSeconds();

    // date calculation logic
    const _seconds = 1000;
    const _minutes = _seconds * 60;
    const _hours = _minutes * 60;
    const _date = _hours * 24;
    const timer = setInterval(() => {
      const now = new Date();
      const distance =
        new Date(year, month, date, hours, minutes, seconds).getTime() -
        now.getTime();
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      showDate = Math.floor(distance / _date);
      showMinute = Math.floor((distance % _hours) / _minutes);
      showHour = Math.floor((distance % _date) / _hours);
      showSecound = Math.floor((distance % _minutes) / _seconds);
      selectDay.innerText = showDate < 10 ? `0${showDate}` : showDate;
      selectHour.innerText = showHour < 10 ? `0${showHour}` : showHour;
      selectMinute.innerText = showMinute < 10 ? `0${showMinute}` : showMinute;
      selectSecound.innerText =
        showSecound < 10 ? `0${showSecound}` : showSecound;
    }, 1000);
  }
}
// 2023-08-28T10:41:43.000000Z

CountDown("2024-12-28T10:41:43.000000Z");

// product-cart-increment-decrement
const productInfo = document.querySelector(".product-info");
if (productInfo) {
  const plus = document.querySelector(".plus"),
    minus = document.querySelector(".minus"),
    number = document.querySelector(".number");

  if (plus) {
    let plusAdd = 1;
    number.innerText = "0" + plusAdd;

    plus.addEventListener("click", () => {
      plusAdd++;
      plusAdd = plusAdd < 10 ? "0" + plusAdd : plusAdd;
      number.innerHTML = plusAdd;
    });

    minus.addEventListener("click", () => {
      if (plusAdd > 1) {
        plusAdd--;
        plusAdd = plusAdd < 10 ? "0" + plusAdd : plusAdd;
        number.innerHTML = plusAdd;
      }
    });
  }
}

// cart page increment/decrement
const productCartPage = document.querySelector(".cart-section");
if (productCartPage) {
  const plusAll = document.querySelectorAll(`.plus`),
    minusAll = document.querySelectorAll(".minus"),
    numberAll = document.querySelectorAll(".number");
  mainPriceAll = document.querySelectorAll(".main-price");
  totalPriceAll = document.querySelectorAll(".total-price");
  plusAll.forEach((item, i) => {
    numberAll[i].innerText = "0" + 1;
    item.addEventListener("click", () => {
      let getNumber = numberAll[i].innerText;
      getNumber++;
      getNumber = getNumber < 10 ? "0" + getNumber : getNumber;
      numberAll[i].innerHTML = getNumber;
      const price = mainPriceAll[i].innerText.split("$").join("");
      const totalPrice = price * getNumber;
      totalPriceAll[i].innerText = "$" + totalPrice + ".00";
    });
  });
  minusAll.forEach((item, i) => {
    numberAll[i].innerText = "0" + 1;
    item.addEventListener("click", () => {
      let getNumber = numberAll[i].innerText;
      if (getNumber > 1) {
        getNumber--;
        getNumber = getNumber < 10 ? "0" + getNumber : getNumber;
        numberAll[i].innerHTML = getNumber;
        const price = mainPriceAll[i].innerText.split("$").join("");
        const totalPrice = price * getNumber;
        totalPriceAll[i].innerText = "$" + totalPrice + ".00";
      }
    });
  });
}
