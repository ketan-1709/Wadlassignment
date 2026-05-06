document.getElementById("searchBtn")
.addEventListener("click",getWeather);
function getWeather(){
    const city=document.getElementById("city").value.trim().toLowerCase();
    const result=document.getElementById("result");
    if(city==""){
        result.innerHTML=`<p style='color:red'>Please enter city name</p>`
        return ;
    }
    const xhr=new XMLHttpRequest();
    xhr.open("GET","weather.json",true);
    xhr.onload=function(){
        const weatherDB=JSON.parse(xhr.responseText);
        if(weatherDB[city]){
            const data=weatherDB[city];
            result.innerHTML=`
            <h2>${city.toUpperCase()}</h2>
            <p>Temperature${data.temperature}</p>
            <p> Humidity:${data.humidity}</p>
            <p> condition: ${data.condition}</p>
            `;
        }
        else{
            result.innerHTML=
                "<p style='color:red'>City not found</p> ";

        }
        
    }
    xhr.send();
}