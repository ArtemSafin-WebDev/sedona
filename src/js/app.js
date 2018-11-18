

var $ = require("jquery");
var objectFitImages = require("object-fit-images");
var objectFitVideos = require("object-fit-videos");
var svgxuse = require("svgxuse");
var parsley = require("parsleyjs");
var Inputmask = require("inputmask");
var picturefill = require('picturefill');
var moment = require('moment');
moment.locale('cs');
console.log(moment.locale()); // en



window.addEventListener("load", function(event) {
  var preloader = document.querySelector(".preloader");
  preloader.classList.add("preloader--hidden");
});

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  

  // Maps initialization

  var googleApiKey = "AIzaSyAvuR4a7K383XNi-Nd5b01d-Bgi-WmX73s";
  var mapElement = document.querySelector(".map");
  var map;
  var mapStyles = [
    // { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    // { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    // { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#cadfaa" }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#365a33" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#dbd6cd" }]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#fa9e25" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#cf8320" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }]
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }]
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#8bb5fd" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }]
    }
  ];
  var sedona = {
    lat: 34.869709,
    lng: -111.760902
  };

  if (mapElement) {
    google.maps.event.addDomListener(window, "load", init);
    google.maps.event.addDomListener(window, "resize", mapResize);
  }

  function init() {
    var marker = {
      path: "M18,0A18,18,0,1,1,0,18,18,18,0,0,1,18,0Z",
      fillColor: "#81b3d2",
      fillOpacity: 1,
      scale: 1,
      strokeColor: "white",
      strokeWeight: 7
    };
    // The map, centered at pinkHq

    map = new google.maps.Map(mapElement, {
      zoom: 8,
      center: sedona,
      disableDefaultUI: true,
      styles: mapStyles
    });

    // The marker, positioned at pinkHq
    var marker = new google.maps.Marker({
      position: sedona,
      title: "Наш офис",
      icon: marker,
      map: map
    });
  }

  function mapResize() {
    google.maps.event.trigger(map, "resize");
    map.panTo(sedona);
  }

  // Media player

  var player = document.querySelector(".presentation-video__container");
  var playButton = document.querySelector(".presentation-video__play-icon");
  var video = document.querySelector("video");
  var replayButton = document.querySelector(".player-buttons__button--replay");
  var fullscreenButton = document.querySelector(
    ".player-buttons__button--fullscreen"
  );
  var progress = document.querySelector(".progress");
  var progressBar = document.querySelector(".progress__filled");
  var mouseDown = false;
  var newCurrentTime;

  function togglePlay() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function updatePlayButton() {
    if (this.paused) {
      playButton.classList.remove("presentation-video__play-icon--hidden");
    } else {
      playButton.classList.add("presentation-video__play-icon--hidden");
    }
  }

  function rewind() {
    console.log('requested rewind');
    video.currentTime = 0;
    video.play();
  }

  function handleProgress() {
    var percent = (video.currentTime / video.duration) * 100;
    if (!mouseDown) {
      progressBar.style.width = percent + "%";
    }
  }

  function scrub(evt) {
    var scrubTime = (evt.offsetX / progress.offsetWidth) * video.duration;
    console.log(evt.offsetX);
    console.log(progress.offsetWidth);
    video.currentTime = scrubTime;
    video.play();
  }

  function setProgress(evt) {
    if (!mouseDown) {
      return;
    } else {
      var newPosition = evt.offsetX / progress.offsetWidth;
      newCurrentTime = newPosition * video.duration;
      progressBar.style.width = newPosition * 100 + "%";
    }
  }

  function mouseUpHandler() {
    mouseDown = false;
    video.currentTime = newCurrentTime;
  }

  function mouseDownHandler() {
    mouseDown = true;
  }

  function mouseLeaveHandler() {
    if (mouseDown) {
      mouseDown = false;
      video.currentTime = newCurrentTime;
    }
  }

  function makeFullScreen() {
    console.log('Clicked fullscreen button');
    var elem = video;
    if (elem.requestFullscreen) {
      console.log('Activated by default');
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      console.log('Activated on Moz');
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      console.log('Activated on webkit');
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      console.log('Activated on IE');
      elem.msRequestFullscreen();
    }
  }

  if (player && video.canPlayType) {
    video.controls = false;
    document.querySelector(".presentation-video__controls").style.display =
      "block";

    

    player.addEventListener("click", togglePlay);
    replayButton.addEventListener("click", rewind);
    fullscreenButton.addEventListener("click", makeFullScreen);
    video.addEventListener("play", updatePlayButton);
    video.addEventListener("pause", updatePlayButton);
    video.addEventListener("timeupdate", handleProgress);
    progress.addEventListener("click", scrub);
    progress.addEventListener("mousedown", mouseDownHandler);
    progress.addEventListener("mouseup", mouseUpHandler);
    progress.addEventListener("mousemove", setProgress);
    progress.addEventListener("mouseleave", mouseLeaveHandler);
  }

  // Object-fit polyfill

  objectFitImages();
  objectFitVideos();

  // Input masking

  var selector = document.getElementById("phone");
  var im;
  if (selector) {
    im = new Inputmask("+7 (999) 999-99-99", {
      autoUnmask: true,
      removeMaskOnSubmit: true,
    });
    im.mask(selector);
  }


  var arrivalDate = document.getElementById("arrival");
  var arrivalMask;
  if (arrivalDate) {
    arrivalMask = new Inputmask("99/99/9999", {
      // autoUnmask: true,
      // removeMaskOnSubmit: true,
      placeholder: "DD/MM/YYYY"
    });
    arrivalMask.mask(arrivalDate);
  }

  var departureDate = document.getElementById("departure");
  var arrivalMask;
  if (departureDate) {
    arrivalMask = new Inputmask("99/99/9999", {
      // autoUnmask: true,
      // removeMaskOnSubmit: true,
      placeholder: "DD/MM/YYYY"
    });
    arrivalMask.mask(departureDate);
  }

  // Form validation

  window.Parsley.addValidator("phone", {
    requirementType: "string",
    validateString: function(value) {
      return /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(
        value
      );
    },
    messages: {
      en: "This value should be a mobile number",
      ru: "Введите правильный номер мобильного телефона"
    }
  });

  window.Parsley.addValidator("alpha", {
    requirementType: "string",
    validateString: function(value) {
      return /^[a-zA-Zа-яА-Я]+$/.test(
        value
      );
    },
    messages: {
      en: "Only characters allowed",
      ru: "Допустимы только буквы"
    }
  });

  window.Parsley.addValidator("moment", {
    requirementType: "string",
    validateString: function(value) {
      return moment(value, 'D/M/YYYY', true).isValid();
    },
    messages: {
      en: "Please enter a valid date.",
      ru: "Укажите правильную дату."
    }
  });

  window.Parsley.addValidator("before", {
    requirementType: "string",
    validateString: function(value) {
      $('#departure').parsley().validate();
      return !moment(value, 'D/M/YYYY', true).isBefore();
    },
    messages: {
      en: "Arrival date starting tomorrow",
      ru: "Дата заезда начиная с завтрашнего дня"
    }
  });

  window.Parsley.addValidator("after", {
    requirementType: "string",
    validateString: function(value) {
      var arrivalDate = document.querySelector('#arrival').value;
      console.log(arrivalDate);
      if(arrivalDate && moment(arrivalDate, 'D/M/YYYY', true).isValid()) {
        arrivalDate = moment(arrivalDate, 'D/M/YYYY', true);
        
        return moment(value, 'D/M/YYYY', true).isAfter(arrivalDate);
      } else {
        return true;
      }
    },
    messages: {
      en: "Departure date must be later than arrival date.",
      ru: "Дата отъезда должна быть позже даты заезда."
    }
  });

  Parsley.addMessages("ru", {
    defaultMessage: "Некорректное значение.",
    type: {
      email: "Введите адрес электронной почты.",
      url: "Введите URL адрес.",
      number: "Введите число.",
      integer: "Введите целое число.",
      digits: "Введите только цифры.",
      alphanum: "Введите буквенно-цифровое значение."
    },
    notblank: "Это поле должно быть заполнено.",
    required: "Обязательное поле.",
    pattern: "Это значение некорректно.",
    min: "Это значение должно быть не менее чем %s.",
    max: "Это значение должно быть не более чем %s.",
    range: "Это значение должно быть от %s до %s.",
    minlength: "Это значение должно содержать не менее %s символов.",
    maxlength: "Это значение должно содержать не более %s символов.",
    length: "Это значение должно содержать от %s до %s символов.",
    mincheck: "Выберите не менее %s значений.",
    maxcheck: "Выберите не более %s значений.",
    check: "Выберите от %s до %s значений.",
    equalto: "Это значение должно совпадать."
  });

  Parsley.setLocale("ru");

  // Navigation opening

  var navButton = document.querySelector(".main-nav__button");
  var mainNav = document.querySelector(".main-nav");
  var navOpen = false;
  var mainNavLinksContainer = document.querySelector(
    ".main-nav__links-container"
  );

  if (navButton && mainNav) {
    blockTouchScroll(mainNavLinksContainer);
    mainNavLinksContainer.addEventListener("click", function(evt) {
      if ((evt.target = mainNavLinksContainer)) {
        mainNav.classList.remove("main-nav--open");
        navOpen = false;
      }
    });
    navButton.addEventListener("click", function(evt) {
      evt.preventDefault();
      navOpen = !navOpen;
      mainNav.classList.toggle("main-nav--open");
    });
    window.addEventListener("resize", function() {
      if (window.innerWidth > 720 && navOpen) {
        mainNav.classList.remove("main-nav--open");
        navOpen = false;
      }
    });

    // Hide nav on scrolling

    var lastScrollTop = 0;
    var delta = 250;
    var navbarHeight = mainNav.offsetHeight + 100;
    var navbarHidden = false;
    var didScroll = false;

    window.addEventListener("scroll", function(evt) {
      didScroll = true;
    });

    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      if (window.innerWidth < 720) {
        var st = window.scrollY;
        if (Math.abs(lastScrollTop - st) <= delta) return;
        // If current position > last position AND scrolled past navbar...
        if (st > lastScrollTop && st > navbarHeight) {
          // Scroll Down
          mainNav.classList.add("main-nav--hidden");
          navbarHidden = true;
        } else {
          // Scroll Up
          // If did not scroll past the document (possible on mac)...
          mainNav.classList.remove("main-nav--hidden");
          navbarHidden = false;
        }
        lastScrollTop = st;
      } else {
        return;
      }
    }

    window.addEventListener("resize", function() {
      if (window.innerWidth > 720 && navbarHidden) {
        mainNav.classList.remove("main-nav--hidden");
        navbarHidden = false;
      }
    });
  }

  // Modal

  var modalOpen = document.querySelector(".interested__modal-btn");
  var bookingModal = document.querySelector(".booking-modal");
  var bookingModalContent = document.querySelector(".booking-modal__content");
  var bookingModalShown = false;
  var bookingScrollBlocked = false;
  if (modalOpen && bookingModal) {
    blockTouchScroll(bookingModal);
    modalOpen.addEventListener("click", function(evt) {
      evt.preventDefault();
      if (!bookingModalShown) {
        bookingModal.classList.add("booking-modal--shown");
        bookingModalShown = true;
      }
    });
    bookingModal.addEventListener("click", function(evt) {
      if (evt.target === bookingModalContent) {
        evt.preventDefault();
      }
      if (bookingModalShown && evt.target === bookingModal) {
        bookingModal.classList.remove("booking-modal--shown");
        bookingModalShown = false;
        return;
      }
    });
  }

  
  // Touch scroll blocker

  function blockTouchScroll(element) {
    var _overlay = element;
    var _clientY = null; // remember Y position on touch start

    _overlay.addEventListener(
      "touchstart",
      function(event) {
        if (event.targetTouches.length === 1) {
          // detect single touch
          _clientY = event.targetTouches[0].clientY;
        }
      },
      false
    );

    _overlay.addEventListener(
      "touchmove",
      function(event) {
        if (event.targetTouches.length === 1) {
          // detect single touch
          disableRubberBand(event);
        }
      },
      false
    );

    function disableRubberBand(event) {
      var clientY = event.targetTouches[0].clientY - _clientY;

      if (_overlay.scrollTop === 0 && clientY > 0) {
        // element is at the top of its scroll
        event.preventDefault();
      }

      if (isOverlayTotallyScrolled() && clientY < 0) {
        //element is at the top of its scroll
        event.preventDefault();
      }
    }

    function isOverlayTotallyScrolled() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
      return (
        _overlay.scrollHeight - _overlay.scrollTop <= _overlay.clientHeight
      );
    }
  }
});
