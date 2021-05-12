// credit: http://www.javascriptkit.com/javatutors/touchevents2.shtml
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('service worker registered'))
      .catch(err => console.log('service worker not registered', err));
  }


function swipedetect(el, callback) {
    var touchsurface = el,
      swipedir,
      startX,
      startY,
      distX,
      distY,
      threshold = 100, //required min distance traveled to be considered swipe
      restraint = 100, // maximum distance allowed at the same time in perpendicular direction
      allowedTime = 300, // maximum time allowed to travel that distance
      elapsedTime,
      startTime,
      handleswipe = callback || function (swipedir) {};
  
    touchsurface.addEventListener(
      "touchstart",
      function (e) {
        var touchobj = e.changedTouches[0];
        swipedir = "none";
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        // e.preventDefault();
      },
      false
    );
  
    touchsurface.addEventListener(
      "touchmove",
      function (e) {
        // e.preventDefault(); // prevent scrolling when inside DIV
      },
      false
    );
  
    touchsurface.addEventListener(
      "touchend",
      function (e) {
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime) {
          // first condition for awipe met
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            // 2nd condition for horizontal swipe met
            swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
          } else if (
            Math.abs(distY) >= threshold &&
            Math.abs(distX) <= restraint
          ) {
            // 2nd condition for vertical swipe met
            swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
          }
        }
        handleswipe(swipedir);
        // e.preventDefault();
      },
      false
    );
  }
  
  //USAGE:
  
  var el = document.getElementById("wrapper");
  // var text = document.getElementById("swipezone");

  var getSl = document.getElementById('getSl')
  var getWor = document.getElementById('getWor')
  swipedetect(el, function (swipedir) {
    switch (swipedir) {
        case 'left':
            el.style.transform = 'translateX(-50%)'
            getWor.setAttribute('class','button_selected')
            getSl.setAttribute('class','button_ns')
            break;
        case 'right':
            el.style.transform = 'translateX(0%)'
            getSl.setAttribute('class','button_selected')
            getWor.setAttribute('class','button_ns')
            break;   
        default:
            break;
    }
  });


  getSl.addEventListener('click',()=>{
    el.style.transform = 'translateX(0%)'
    getSl.setAttribute('class','button_selected')
    getWor.setAttribute('class','button_ns')
  })
  getWor.addEventListener('click',()=>{
    el.style.transform = 'translateX(-50%)'
    getWor.setAttribute('class','button_selected')
    getSl.setAttribute('class','button_ns')
  })