const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".fa-play"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea   = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");




let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load",()=>{
    console.log("page is fully loaded");
    loadMusic(musicIndex);
    playingNow();
});


//load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `music/${allMusic[indexNumb - 1].img}.mp3`;
};

//play music function

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.classList.replace('fa-play','fa-pause');
    mainAudio.play();
};

//pause music function

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.classList.replace("fa-pause","fa-play");
    mainAudio.pause();
};

//next music function

function nextMusic(){
    //here we will increment of index by 1

    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;    
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//previous music function

function prevMusic(){
    //here we will decrement of index by 1

    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;    
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//play or music button event
playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused = wrapper.classList.contains("paused"); 
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();


    //on first click, it will return false because there is no paused class in wrapper so play music function will call and we will add paused class inside play music function
}); 

//next music btn event

nextBtn.addEventListener("click",()=>{
    nextMusic();
});
//previous music btn event

prevBtn.addEventListener("click",()=>{
    prevMusic();
});


//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate",(e)=>{
    // console.log(e)
    const {currentTime} = e.target; // object destructing:SAME AS LINE 89
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%` ;

     


    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

   

    mainAudio.addEventListener("loadeddata",(e)=>{
        // console.log(e)

     //update song total duration

     let audioDuration = mainAudio.duration;
    //  console.log(audioDuration)
     let totalMin = Math.floor(audioDuration/ 60);
     let totalSec = Math.floor(audioDuration % 60);
     if(totalSec < 10){
        totalSec = `0${totalSec}` ;
     }
     musicDuration.innerText = `${totalMin}:${totalSec}`;
 

    }); 
        
    //update playing song current time

     
    let audiocurrentTime = mainAudio.currentTime;
    let currentMin = Math.floor(audiocurrentTime / 60);
    let currentSec = Math.floor(audiocurrentTime % 60);
    if(currentSec < 10){
    currentSec = `0${currentSec}` ;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
    

   
});




//let's update playing song current time according to the progress bar width

progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth ;
    let clickedOffSetX = e.offsetX ;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration ;
    playMusic();
});

// mainAudio.addEventListener("ended",(e)=>{
//     console.log(e)
//     nextMusic()
// });


mainAudio.addEventListener("ended",nextMusic); //
   



//let's work on repeat, shuffle song according to the icon

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for(let i = 0 ; i < allMusic.length; i++){    //using li-index we will find which song is currently playing
    let liTag = `<li li-index="${i + 1}">  
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                    <span id = "${allMusic[i].src}" class="audio-duration">
                        3:40</span>
                </li>`
    ulTag.insertAdjacentHTML("beforeend",liTag) ;
    
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    
    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration =  liAudioTag.duration;
        let totalMin = Math.floor(audioDuration/ 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
             totalSec = `0${totalSec}` ;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);

    });
}


//lets work on play particular song on click

const allLiTags = ulTag.querySelectorAll("li");
// console.log(allLiTags)
function playingNow(){
    for(let j = 0; j  <allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // console.log(j)
        //if there is an li tag which li-index is equal to musicIndex 
        //then this music is playing now and we'll style it
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing")
            let adDuration = audioTag.getAttribute("t-duration")
            audioTag.innerText = adDuration;





        }
        if(allLiTags[j].getAttribute("li-index")== musicIndex){
            allLiTags[j].classList.add("playing")
            audioTag.innerText = "Playing";
        }
    
        //adding onclick attribute in all li tags
    
        allLiTags[j].setAttribute("onclick","clicked(this)");
    };
}

//lets play song on li click

function clicked(element){
    //getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}



