// credit: http://www.javascriptkit.com/javatutors/touchevents2.shtml
// if('serviceWorker' in navigator){
//     navigator.serviceWorker.register('/sw.js')
//       .then(reg => console.log('service worker registered'))
//       .catch(err => console.log('service worker not registered', err));
//   }

const navigationBtn = document.getElementById('nav')

const dataSLactive = document.getElementById('data-sl-active')
const dataSLrecover = document.getElementById('data-sl-recover')
const dataSLdeaths = document.getElementById('data-sl-deaths')
const dataSLconfirm = document.getElementById('data-sl-confirm')
const dataSLrecoverrate = document.getElementById('data-sl-recover-rate')
const dataSLdeathrate = document.getElementById('data-sl-death-rate')
const dataWORactive = document.getElementById('data-world-active')
const dataWORrecover = document.getElementById('data-world-recover')
const dataWORdeaths = document.getElementById('data-world-deaths')
const dataWORconfirm = document.getElementById('data-world-confirm')
const dataWORrecoverrate = document.getElementById('data-world-recover-rate')
const dataWORdeathrate = document.getElementById('data-world-death-rate')

const dataSLtimer = document.getElementById('data-sl-timer')
const dataWORtimer = document.getElementById('data-world-timer')

var tCC = document.getElementById('totalCasesChart').getContext('2d');
var oDC = document.getElementById('overallDonut').getContext('2d');

const dataTable = document.getElementById('data-table')

navigationBtn.addEventListener('click',()=>{
 
    if (document.documentElement.getAttribute("data-theme")!=="dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  })

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

  var covidStatus = {}

  fetch('https://hpb.health.gov.lk/api/get-current-statistical')
  .then(response => response.json())
  .then(data => {

    setCovidStatus(data.data)
    setTableData(data.data.hospital_data)
  });


  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.textContent = numberWithCommas(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  
  // const obj = document.getElementById("value");
  // animateValue(obj, 100, 0, 5000);


  const setCovidStatus = (data) => {
    const ANIMATION_SPEED = 1000
    // dataSLactive.textContent = data.local_active_cases

    const RESOLVED_CASES_SL = data.local_total_cases - data.local_active_cases
    const RESOLVED_CASES_WOR = data.global_total_cases - (data.global_total_cases-data.global_recovered-data.global_deaths)

    animateValue(dataSLactive,0,data.local_active_cases,ANIMATION_SPEED)
    animateValue(dataSLrecover,0,data.local_recovered,ANIMATION_SPEED)
    animateValue(dataSLdeaths,0,data.local_deaths,ANIMATION_SPEED)
    animateValue(dataSLconfirm,0,data.local_total_cases,ANIMATION_SPEED)
    animateValue(dataWORactive,0,(data.global_total_cases-data.global_recovered-data.global_deaths),ANIMATION_SPEED)
    animateValue(dataWORrecover,0,data.global_recovered,ANIMATION_SPEED)
    animateValue(dataWORdeaths,0,data.global_deaths,ANIMATION_SPEED)
    animateValue(dataWORconfirm,0,data.global_total_cases,ANIMATION_SPEED)

    dataSLtimer.innerHTML = `<span class="material-icons data-icon-timer">restore</span>last updated ${moment(data.update_date_time).fromNow()}`
    dataWORtimer.innerHTML = `<span class="material-icons data-icon-timer">restore</span>last updated ${moment(data.update_date_time).fromNow()}`
    // console.log(moment(data.update_date_time).fromNow())

    dataSLrecoverrate.innerHTML = `(${(100-(data.local_deaths/RESOLVED_CASES_SL)*100).toFixed(2)}%)<span class="material-icons data-rate">info</span>`
    dataSLdeathrate.innerHTML = `(${((data.local_deaths/RESOLVED_CASES_SL)*100).toFixed(2)}%)<span class="material-icons data-rate">info</span>`

    dataWORrecoverrate.innerHTML = `(${(100-(data.global_deaths/RESOLVED_CASES_WOR)*100).toFixed(2)}%)<span class="material-icons data-rate">info</span>`
    dataWORdeathrate.innerHTML = `(${((data.global_deaths/RESOLVED_CASES_WOR)*100).toFixed(2)}%)<span class="material-icons data-rate">info</span>`


    var overallCases = new Chart(oDC, {
      type: 'doughnut',
      data: {
          labels: ['Active Cases', 'Recovered Cases', 'Deaths' ],
          datasets: [{
              label: 'Current Statistics',
              data: [data.local_active_cases,data.local_recovered,data.local_deaths],
              backgroundColor: [
                'rgba(112, 82, 251, 0.75)',
                'rgba(80, 205, 138, 0.75)',
                'rgba(227, 52, 47, 0.75'
              ],
              borderColor: [
                'rgb(112, 82, 251)',
                'rgb(80, 205, 138)',
                'rgb(227, 52, 47)'
              ],
              hoverOffset: 4,
              borderWidth: 2
          }],
          
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }

  fetch('https://api.covid19api.com/country/sri-lanka/status/confirmed')
  .then(response => response.json())
  .then(data => {

    var totalCasesChart = new Chart(tCC, {
      type: 'line',
      data: {
          labels: data.map(dat=>moment(dat.Date).format('MMM YY')),
          datasets: [{
              label: 'Total Cases',
              data: data.map(dat=>dat.Cases),
              fill: false,
              borderColor: 'rgba(253, 176, 26, 1)',
              tension: 0.1,
              pointRadius: 0
          }],
          
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  });

  const setTableData = (hospitals) =>{
    hospitals.map(hospital=>{
      let $dataSet = $("<div>", {"class": "table-data-row"})
      let $hospitalName = $("<span>", {"class": "hospital-name"}).text(hospital.hospital.name)
      let $countData = $("<div>", {"class": "count-data"})
      let $countSL = $("<span>", {"class": "loc-data"}).text(hospital.treatment_local)
      let $countFor = $("<span>", {"class": "for-data"}).text(hospital.treatment_foreign)
      let $countTotal = $("<span>", {"class": "tot-data"}).text(hospital.treatment_total)
      $countData.append($countSL)
      $countData.append($countFor)
      $countData.append($countTotal)
      $dataSet.append($hospitalName)
      $dataSet.append($countData)
      $("#tableData").append($dataSet)
    })
  }

  $('#new-tab').click(function(){
    if($('#table-section').attr('class')==='table-section'){
    $('#table-section').attr('class','table-section-hovering')
    $('#new-tab').text('close')
  }else{
    $('#table-section').attr('class','table-section')
    $('#new-tab').text('open_in_new')
  }
});
