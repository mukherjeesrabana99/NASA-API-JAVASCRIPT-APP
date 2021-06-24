//CLICK ME BTN AT THE TOP OF THE PAGE
const btn=document.querySelector(".btn-info");
//MODAL CONTAINER
const modal_container=document.querySelector(".modal-container");
//ALL THE LINKS TO BE CLICKED ON 
const links=document.querySelectorAll(".link")
//MODAL CLO0SE BTN
const close_btn=document.getElementById("close-btn")
//CONTAINER TO BE POPULATED WITH API DATA
const container=document.getElementById("feedContainer")
//TABLE ROW TO BE POPULATED BY API DATA
const afeed=document.getElementById("afeed")
//TABLE TO BE GIVEN DIFFERENT CLASSNAMES UNDER DIFFERENT SITUATIONS
const afeedTable=document.getElementById("afeedTable");
//TABLE HEAD TO BE POPULATED WITH DIFFERENT HTML UNDER DIFFERENT CIRCUMSTANCES
const afeedHead=document.getElementById("afeedHead");
//INPUT CONTAINER FOR ASTEROID APPROACH DATE
const cardBox=document.querySelector("#cardBox")
const append_container=document.querySelector("#append-container")
/////////////////////////////////////////////////////////////////////////////////////
//API URLS

//PICTURE OF THE DAY URL
const apod_url="https://api.nasa.gov/planetary/apod?api_key=NGH0xrvoYm6kulgmWWJp9SVfGph8VMFbfRFT6pa7"
//API FOR GETTING LIST OF ASTEROIDS
const asteroid_list_url="https://api.nasa.gov/neo/rest/v1/feed?"
//API FOR A SINGLE ASTEROID LOOKUP
const asteroid_url="https://api.nasa.gov/neo/rest/v1/neo/"
//API FOR GETTING LIST OF EVENT CATEGORIES
const cat_list_url="https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories"
//API FOR GETTING EVENTS BASED ON A SINGLE CATEGORY
const cat_event_list_url="https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories/"
//API FOR GETTING WEATHER OF MARS
const mars_weather_url="https://api.nasa.gov/insight_weather/?api_key=NGH0xrvoYm6kulgmWWJp9SVfGph8VMFbfRFT6pa7&feedtype=json&ver=1.0"
//API FOR GETTING MARS PHOTOS
const mars_photos_url="https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=NGH0xrvoYm6kulgmWWJp9SVfGph8VMFbfRFT6pa7"
//AN ARRAY FOR PUSHING ASTEROID OBJECTS
let asteroid_arr=[]
////////////////////////////////////////////////////////////////////////////////////////
openModal=()=>modal_container.classList.remove("hidden")
closeModal=()=>modal_container.classList.add("hidden")
/////////////////////////////////////////////////////////////////////////////////////
//APOD LOADING FETCHING RENDERING BEGINS
//FUNCTION TO ZOOM IN A PICTURE
function bigAPODImg(x) {
  x.style.height = "50%";
  x.style.width = "60%";
}
//FUNCTION TO ZOOM OUT A PICTURE
function normalAPODImg(x) {
  x.style.height = "10%";
  x.style.width = "20%";
}
async function loadAPOD(url){
	console.log("running");
	const res=await fetch(url);
	const data=await res.json();
	console.log(data)
	displayAPOD(data)
}
loadAPOD(apod_url);
displayAPOD=(item)=>{
	document.querySelector(".heading").innerHTML=`<b>Astronomy Picture of the Day</b>`
	container.innerHTML=`
	<div class="card" style="height:5%; width: 50%;">
  <img onmouseover="bigAPODImg(this)" onmouseout="normalAPODImg(this)" class="card-img-top" style="width:20%; height:10%; cursor:pointer;  margin:auto; display:block;" src="${item.hdurl}">
  <div class="card-body">
  <b style="display:block;" class="card-title">${item.title}</b>
    <p class="card-text">${item.explanation}</p>
  </div>
</div>
	
	`

}
//APOD LOADING FETCHING RENDERING ENDS
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
btn.addEventListener("click", ()=>openModal())
close_btn.addEventListener("click",()=>closeModal())
////////////////////////////////////////////////////////////////////////////////////
links.forEach(link=>{
	link.addEventListener("click", function(){
		switch(this.id){
			case "asteroid-link":
			console.log("asteroid link clicked")
			fetchAsteroidList()

			break;
			case "event-cat-link":
			console.log("event cat link clicked")
			fetchCategoryList()
			break;
			case "mars-link":
			console.log("mars link clicked")
			fetchMarsInfo()
			break;
		}
	})
})
//////////////////////////////////////////////////////////////////////////////////////
// ASTEROID SECTION BEGINS  
////////////////////////////////////////////////////////////////////////////////
//ASTEROID LIST LOADING , FETCHING AND RENDERING
function fetchAsteroidList(){
	console.log("fetchAsteroidList running")
	// openCard()
	let input_box=document.createElement("div");
	input_box.innerHTML=`
	<div class="card">
	  <div class="card-header">
	    <h5>Input A Start Date</h5>
	    <input type="date" id="date-input">
	  </div>
	  <div class="card-body">
	    <button type="button" class="btn btn-primary" id="ast-query-btn">Query Asteroids</button>
	  </div>
	</div>

	`
	const date_input=input_box.querySelector("#date-input");
	const ast_query_btn=input_box.querySelector("#ast-query-btn");
	ast_query_btn.addEventListener("click", async()=>{
		//ONCLICK REMOVE MODAL
		closeModal()
		append_container.removeChild(input_box)
		//VALIDATION CHECK
		if(date_input.value==""){
			alert("Input a Date")
		}
		//ONCLICK REMOVE INPUT CONTAINER
		// closedCard()
		console.log(date_input.value);
		//CALCULATE DATE AFTER 7 DAYS OF START DATE OR INPUT DATE TO PASS TO THAT THE URL
		let endDate=new Date(date_input.value);
		endDate.setDate(endDate.getDate()+ 7)
		console.log(endDate.toISOString())
		///////////////////////////////////////////////////////////////
		//ONCLICK FETCH URL
		const url=asteroid_list_url+"start_date="+date_input.value+"&end_date="+endDate.toISOString()+"&api_key=NGH0xrvoYm6kulgmWWJp9SVfGph8VMFbfRFT6pa7"
		const res=await fetch(url)
        const data=await res.json()
        console.log(data.near_earth_objects)
        //LOOPING OVER OBJECTS AND PUSHING EACH OF THEM TO AN ARRAY TO FORM AN ARRAY OF
        // OBJECTS FOR EASY DATA RENDERING
        for(let date in data.near_earth_objects){
        	data.near_earth_objects[date].forEach(obj=>{
        		// console.log(obj,date)
        		asteroid_arr.push(obj)
        		
			
        	})
        	
        }
        console.log(asteroid_arr)
        displayAsteroidList(asteroid_arr)
	})
	//APPEND INPUT BOX CREATED TO THE HTML DOM ELEMENT APPEND CONTAINER
	append_container.appendChild(input_box)
}
displayAsteroidList=(items)=>{
	document.querySelector(".tableHeading").innerHTML=`<b>ASTEROID TABLE</b>`
	afeedHead.innerHTML=`
	<tr>
    <th scope="col">Name</th>
    <th scope="col">Date</th>

    </tr>
	`
	all_items=items.map(item=>{
		return`
				<tr id="${item.id}" onClick="getAsteroidDetail(this.id)" style="cursor:pointer; color:blue;">
                
                <td>${item.name}</td>
                <td>${item.close_approach_data[0].close_approach_date_full}</td>
            </tr>
            `

		
		

	})
	afeed.innerHTML=all_items.join("")
	if(afeed.innerHTML === ""){
        afeedTable.className = "table hidden"
    } else{
        afeedTable.className = "table";
    }

}
/////////////////////////////////////////////////////////////////////////////////
//ASTEROID DETAIL LOADING , FETCHING AND RENDERING
async function getAsteroidDetail(id){
	console.log(id)
	document.querySelector(".heading").style.display = "none"
	afeedTable.className = "table hidden"
	const url=asteroid_url+id+"?api_key=NGH0xrvoYm6kulgmWWJp9SVfGph8VMFbfRFT6pa7"
	const res=await fetch(url)
	const data=await res.json()
	console.log(data)
	displayAsteroidDetail(data)
}
displayAsteroidDetail=(item)=>{
	document.querySelector(".heading").innerHTML=`<b>ASTEROID DETAILS</b>`
	console.log("displayAsteroidDetail run")
	container.style.height="100vh"
	const dangerous=item.is_potentially_hazardous_asteroid
	container.innerHTML=`
	<div class="card text-center">
	  <div class="card-header">
	    <b style="color:#7378c5;">Details of ${item.name}</b>
	  </div>
	  <div class="card-body">
	  
	    <b style="display:block;" class="card-title"><span style="color:#7378c5;">Designation: </span>${item.designation}</b>
	    <b style="display:block;" class="card-title"><span style="color:#7378c5;">Magrnitude: </span>${item.absolute_magnitude_h}</b>
	    <b style="display:block;" class="card-title"><span style="color:#7378c5;">Diameter: </span>${item.estimated_diameter.feet.estimated_diameter_min} to ${item.estimated_diameter.feet.estimated_diameter_max} feet </b>
	    <b style="display:block;" class="card-title"><span style="color:#7378c5;">Dangerous?</span>${item.dangerous?"YES":"NO"}</h5>
	    <b style="display:block; color:#7378c5;">ORBITAL DATA</b>
	    <b style="display:block;" class="card-title"><span style="color:#7378c5;">First Observed on: </span>${item.orbital_data.first_observation_date}</b>
	    
	    <a href="${item.nasa_jpl_url}" class="btn btn-primary">See More</a>
	  </div>
	</div>
	
	
	`

}
//////////////////////////////////////////////////////////////////////////////////////
//END OF ASTEROID SECTION

/////////////////////////////////////////////////////////////////////////////////////
//CATEGORIES AND CORRESPONDING EVENTS LOADING, FETCHING, RENDERING SECTON BEGINS
async function fetchCategoryList(){
	closeModal()
	const url=cat_list_url
	const response=await fetch(url)
	const data=await response.json()
	console.log(data.categories)
	displayCategoryList(data.categories)
}
displayCategoryList=(items)=>{
	document.querySelector(".tableHeading").innerHTML=`<b>CATEGORIES TABLE</b>`
	afeedHead.innerHTML=`
	<tr>
    <th scope="col">Name</th>
    <th scope="col">Description</th>

    </tr>
	`
	all_items=items.map(item=>{
		return`
		<tr id="${item.id}" onClick="getEvents(this.id)" style="cursor:pointer; color:blue;">
                
        <td>${item.title}</td>
        <td>${item.description}</td>
        </tr>
		
		`
	})
	afeed.innerHTML=all_items.join("")
	if(afeed.innerHTML === ""){
        afeedTable.className = "table hidden"
    } else{
        afeedTable.className = "table";
    }

}
async function getEvents(id){
	console.log(id)
	afeedTable.className = "table hidden"
	const url=cat_event_list_url+id
	const res=await fetch(url)
	const data=await res.json()
	console.log(data.events)
	displayEvents(data.events)
}
displayEvents=(items)=>{
	document.querySelector(".tableHeading").innerHTML=`<b>EVENTS TABLE</b>`
	afeedHead.innerHTML=`
	<tr>
	<th scope="col">Id</th>
    <th scope="col">Name</th>
    <th scope="col">Date</th>
    <th scope="col">Categories</th>
     <th scope="col">Sources</th>
    </tr>
	`
	all_items=items.map(item=>{
		return`
		<tr id="${item.id}" style="cursor:pointer; color:blue;">
        <td>${item.id}</td>       
        <td>${item.title}</td>
        <td>${item.geometries[0].date}</td>
        <td>${item.categories[0].title}</td>
        <td><a href="${item.sources[0].url}" class="btn btn-primary">source</a></td>
        </tr>
		`
		
	})
	afeed.innerHTML=all_items.join("")
	if(afeed.innerHTML === ""){
        afeedTable.className = "table hidden"
    } else{
        afeedTable.className = "table";
    }

}
//EVENT SECTION ENDS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MARS INFO LOADING FETCHING RENDERING STARTS HERE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// openCard=()=>cardBox.className="card row"
// closedCard=()=>{
// 	console.log("card hid")
// 	cardBox.className="hidden"
// }
// closedCard()
fetchMarsInfo=()=>{
	console.log("fetchmARSiNFO running")
	// openCard()
	let menu_box=document.createElement("div");
	menu_box.innerHTML=`
	<div class="card">
	  <div class="card-body">
	    <a class="col-lg-12 col-md-12 col-sm-12 links" id="marsWeatherLink"  style="color:violet; padding:1rem; width:auto; display:block; cursor:pointer;"><b>Get Mars weather Info</b></a>
	    <a id="marsPhotoLink" class="col-lg-12 col-md-12 col-sm-12 links" style="color:violet; padding:1rem; width:auto; display:block; cursor:pointer;"><b>Get Mars Photos</b></a>
	  </div>
	</div>

	`
	const links=menu_box.querySelectorAll(".links");
	links.forEach(link=>{
		link.addEventListener("click", function(){
			switch(this.id){
				case "marsWeatherLink":
				console.log("marsWeatherLink clicked")
				fetchMarsWeather()
				append_container.removeChild(menu_box)
				closeModal()
				break
				case "marsPhotoLink":
				console.log("marsPhotoLink clicked")
				fetchMarsPhotos()
				append_container.removeChild(menu_box)
				closeModal()
				break
			}
		})
	})
	
	//APPEND MENU BOX CREATED TO THE HTML DOM ELEMENT APPEND CONTAINER
	append_container.appendChild(menu_box)
}
//MARS WEATHER DATA SECTION BEGINS
fetchMarsWeather=async()=>{
	console.log("fetchMarsWeather running")
	const url=mars_weather_url
	const response=await fetch(url)
	const data=await response.json()
	console.log(data)
	document.querySelector(".tableHeading").innerHTML=`<b>MARS WEATHER TABLE</b>`
	afeedHead.innerHTML=`
	<tr>
	<th scope="col">First_UTC</th>
    <th scope="col">Last_UTC</th>
    <th scope="col">Northern_season</th>
    <th scope="col">Southern_season</th>
     <th scope="col">Min Temp</th>
     <th scope="col">Max Temp</th>
     <th scope="col">Average Temp</th>
    </tr>
	`
	afeed.innerHTML=
	data.sol_keys.map(solkey=>{
		return`
		<tr color:blue;">
        <td>${data[solkey].First_UTC}</td>       
        <td>${data[solkey].Last_UTC}</td>
        <td>${data[solkey].Northern_season}</td>
        <td>${data[solkey].Southern_season}</td>
        <td>${data[solkey].PRE.mx}</td>
        <td>${data[solkey].PRE.mn}</td>
        <td>${data[solkey].PRE.av}</td>
        
        
        </tr>
		
		
		`
	}).join("")
	if(afeed.innerHTML === ""){
        afeedTable.className = "table hidden"
    } else{
        afeedTable.className = "table";
    }
	
}
//MARS WEATHER DATA SECTION ENDS

//MARS PHOTOS SECTION BEGINS
fetchMarsPhotos=async()=>{
	console.log("fetchMarsPhotos running")
	const url=mars_photos_url
	const response=await fetch(url)
	const data=await response.json()
	console.log(data)
	dispalyMarsPhotos(data.photos)
}
dispalyMarsPhotos=(items)=>{
	document.querySelector(".heading").innerHTML=`<b>MARS PHOTOS</b>`
	all_items=items.map(item=>{
		return `
		<div class="col-lg-3 col-md-6 col-sm-6">
		<div class="card" style="cursor:pointer;width: 17rem; height:auto;">
		  <img  class="card-img-top" src="${item.img_src}">
		  <div class="card-body">
		    <h5 class="card-text"><span style="color:#7378c5;">Earth Date: </span>${item.earth_date}</h5>
		    <h6 class="card-text"><span style="color:#7378c5;">Rover Name:</span>${item.rover.name}</h6>
		    <h6 class="card-text"><span style="color:#7378c5;">Rover Landing Date:</span> ${item.rover.landing_date}</h6>
		    <h6 class="card-text"><span style="color:#7378c5;">Rover Launching Date:</span>${item.rover.launch_date}</h6>
		  </div>
		</div>
		</div>
		`
	})
	container.innerHTML=all_items.join("")
	// if(container.innerHTML === ""){
 //        loadAPOD()
 //    } 

}
//MARS PHOTOS SECTION ENDS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MARS SECTION ENDS
