const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "0370e86774mshb6ce4ef2c88e01bp16f255jsn398f2c423188",
    "X-RapidAPI-Host": "ip-geo-location-and-ip-reputation.p.rapidapi.com",
  },
};
fetch("https://ip-geo-location-and-ip-reputation.p.rapidapi.com/", options)
  .then((response) => response.json())
  .then((response) => {
    function post(country, city) {
      let params = {
        country: country,
        city: city,
      };
      const queryString = new URLSearchParams(params).toString(); //  تحويل ابجكات اللى عنوان url
      fetch(`https://api.aladhan.com/v1/timingsByCity?${queryString}`)
        .then((s) => s.json())
        .then((data) => {
          let arr = [];
          let a = [];
          let r = [];
          let test1 = true;
          function time() {
            let test = /[0-9]/gi;
            for (let i = 0; i < Object.keys(data.data.timings).length; i++) {
              a[i] = Object.values(data.data.timings)[i].match(test).join("");
              r[i] = +a[i];
              if (r[i] > 1300) {
                r[i] -= 1200;
              }
              if (r[2] < 1200) {
                test1 = false;
              }

              arr[i] = r[i].toString().split("");

              if (arr[i].length == 4) {
                arr[i].splice(2, 0, ":");
              } else {
                arr[i].splice(1, 0, ":");
              }
            }
          }
          time();

          document.getElementById("date").innerHTML =
            data.data.date.gregorian.date;

          document.getElementById("day").innerHTML =
            data.data.date.hijri.weekday.ar;
          
          document.querySelector(".Fajr h2").innerHTML = arr[0].join("");
          document.querySelector(".Fajr span").innerHTML = "AM";
          document.querySelector(".Dhuhr h2").innerHTML = arr[2].join("");
          if (test1 == false) {
            document.querySelector(".Dhuhr span").innerHTML = "AM";
          }else {
            document.querySelector(".Dhuhr span").innerHTML = "PM";
          }
          document.querySelector(".Asr h2").innerHTML = arr[3].join("");
          document.querySelector(".Asr span").innerHTML = "PM";
          document.querySelector(".Maghrib h2").innerHTML = arr[5].join("");
          document.querySelector(".Maghrib span").innerHTML = "PM";
          document.querySelector(".Isha h2").innerHTML = arr[6].join("");
          document.querySelector(".Isha span").innerHTML = "PM";
        });
    }
    post(response.geo_location.country_name, response.geo_location.city_name);
    document.querySelector(".as").addEventListener("click", () => {
      post(
        document.getElementById("s").value,
        document.getElementById("b").value
      );
    });
    fetch(`https://countriesnow.space/api/v0.1/countries`)
      .then((s) => s.json())
      .then((data) => {
        let aa = [];
        for (let i = 0; i < Object.keys(data.data).length; i++) {
          aa[i] = data.data[i].country;
          aa[0] = response.geo_location.country_name;
          document.getElementById("s").innerHTML += `<option>${aa[i]}</option>`;
        }
        get();
        document.getElementById("s").addEventListener("change", get);
        function get() {
          let aa1 = [];
          document.getElementById("b").innerHTML = "";
          for (let i = 0; i < Object.keys(data.data).length; i++) {
            if (data.data[i].country == document.getElementById("s").value) {
              let len = data.data[i].cities.length;
              for (let j = 0; j < len; j++) {
                aa1[j] = data.data[i].cities[j];
                if (
                  document.getElementById("s").value ==
                  response.geo_location.country_name
                ) {
                  aa1[0] = response.geo_location.city_name;
                }
                document.getElementById(
                  "b"
                ).innerHTML += `<option>${aa1[j]}</option>`;
              }
            }
          }
        }
      });
  })
  .catch((err) => console.error(err));
