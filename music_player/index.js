/*
 1. Render list music (ok) 
 2. Scroll up / down  zoom in and out cd and opacity of cd (ok) 
 3. play/pause/seek music (ok)
 4. cd rotate (ok)
 5. next/prev button (ok)
 6. play random/again/sequence music when auto play (ok)
 7. active song is playing (ok)
 8. scroll active song into view (ok)
 9. play song when click 

 */


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY ='MYAPP';
const playlist = $(".playlist");
const btnPlay = $(".btn-toggle-play");
const heading = $('header h2'); 
const cdThumb = $('.cd-thumb'); 
const audio = $('#audio');
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Cô gái vàng",
          singer: "Huy-R",
          path: "./assets/cogaivang.mp3",
          image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        
        {
          name: "Gặp gỡ, yêu đương và được bên em",
          singer: "Phan Mạnh Quỳnh",
          path: "./assets/gapgo.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Đa đoan",
          singer: "Phan Mạnh Quỳnh",
          path:
            "./assets/dadoan.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Nevada",
          singer: "unknown",
          path:
            "./assets/nevada.mp3",
          image: "./assets/nevada.jpg"
        }
      ], 
      setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
      },
      loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
      },
      render: function(){
            const htmls = this.songs.map(function(song, index){
               
                return `<div class="song ${index === app.currentIndex? 'active':'' }"  data-index ="${index}" >
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>` 
            });
            playlist.innerHTML = htmls.join("");
      },
      defineProperties: function () {
      
        Object.defineProperty(this, "CurrentSong", {
          get: function () {
            
            return this.songs[this.currentIndex];

          }
        });
        Object.defineProperty(this, "prevSong", {
          get: function () {
              app.currentIndex -= 1;
              const totalSong = app.songs.length;
              
              if(app.currentIndex < 0){
                this.currentIndex = totalSong -1 ;
              }
            return this.songs[this.currentIndex];

          }
        });
        Object.defineProperty(this, "nextSong", {
          get: function () {
            this.currentIndex += 1;
            const totalSong = this.songs.length;
            if(this.currentIndex >= totalSong ){
              this.currentIndex = 0;
            }
            return this.songs[this.currentIndex];

          }
        });
        Object.defineProperty(this, "randomSong", {
          get: function () {
            let newIndex
            do{
            newIndex = Math.floor(Math.random() * this.songs.length)
            }while(newIndex === this.currentIndex)
           this.currentIndex = newIndex;
          return this.songs[newIndex];

          }
        });
      },
      handlleEvent : function(){
          const _this = this;
        //scroll up and down
          const cd = $(".cd");
          const cdWidth = cd.offsetWidth;
          document.onscroll = function(){

            const scrollTop = window.scrollY || document.documentElement.scrollTop

            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
            
          }
          //CD rotate while play/pause
          const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
          ], {
            duration : 10000, // 10 seconds
            iterations: Infinity
          })
          cdThumbAnimate.pause();
          // button play/ pause 
            btnPlay.onclick = function(){
              if(!_this.isPlaying){
                cdThumbAnimate.play();
                audio.play();
                
              }else{
                cdThumbAnimate.pause();
                audio.pause();
                
              }
        
          }
          //when audio play/pause use that 
            audio.onplay = function(){
              _this.isPlaying =true;
              player.classList.add("playing");
              
            }
            audio.onpause = function(){
              _this.isPlaying =false;
              player.classList.remove("playing");
            }
            //The progress of audio 
            audio.ontimeupdate = function(){
              if(audio.duration){
                const progressPercent = (audio.currentTime/audio.duration) * 100;
                progress.value = progressPercent;
              }
            
            }
            //Change Seek Progress 
            progress.oninput = function(e){
               audio.currentTime =  (audio.duration * e.target.value)/100;
               
               
            }
            //prev button           
            prevBtn.onclick = function(){

              if(!_this.isRandom){
                //load current song
                _this.loadCurrentSong(_this.prevSong);
                
              }else{
                _this.loadCurrentSong(_this.randomSong);
              }
                
              cdThumbAnimate.play();
              audio.play();
                
            }
            //next button
            nextBtn.onclick = function(){             
                 if(!_this.isRandom){
                    //load current song
                _this.loadCurrentSong(_this.nextSong);               
                 }else{
                  _this.loadCurrentSong(_this.randomSong);
                 }
                 
                 cdThumbAnimate.play();
                 audio.play();
              
            }
            //Random button
            randomBtn.onclick = function(){
              _this.setConfig('isRandom',!_this.isRandom )
              if(!_this.isRandom){
                randomBtn.classList.add("active");
                _this.isRandom = true;
                repeatBtn.classList.remove("active");
                _this.isRepeat = false;
              }else{
                randomBtn.classList.remove("active");
                _this.isRandom = false;
              }
              
            }
            //Repeat button
            repeatBtn.onclick = function(){
              _this.setConfig('isRepeat',!_this.isRepeat )
              if(!_this.isRepeat){
                repeatBtn.classList.add("active");
                _this.isRepeat = true;
                randomBtn.classList.remove("active");
                _this.isRandom = false;
              }else{
                repeatBtn.classList.remove("active");
                _this.isRepeat = false;
              }
            }
            //when music ended 
            audio.onended = function(){
              if(_this.isRandom){
                _this.loadCurrentSong(_this.randomSong);
              }else if(_this.isRepeat){
                _this.loadCurrentSong(_this.CurrentSong);
              }else{
                _this.loadCurrentSong(_this.nextSong);
              }
              cdThumbAnimate.play();
                 audio.play();
            }
            //when click into play list 
            playlist.onclick = function(e){
                const songNode = e.target.closest(".song:not(.active)")
                if(songNode || e.target.closest(".option")){

                  if(songNode  && !e.target.closest(".option")){
                    // songNode.getAttribute('data-index')
                    
                    _this.currentIndex = Number(songNode.dataset.index)
                    
                    _this.loadCurrentSong(_this.CurrentSong)
                    cdThumbAnimate.play();
                    audio.play();
                  }else {
                    console.log("option")
                  }
                  
                  
                }
               
            }
          


      },
      scrollToView: function(){
          $(".song.active").scrollIntoView({
            behavior: 'smooth', 
            block: 'nearest',
           
          })
      },
      
      loadCurrentSong: function(song){
        
          heading.textContent = song.name;
          cdThumb.style.backgroundImage = `url('${song.image}')`
          audio.src = song.path;
          this.render();
          this.scrollToView();
      
      },
      start: function(){
        //Load config of app from 
        this.loadConfig(); 
        // //Define properties of app
        this.defineProperties();
        //Render list music 
        this.render();
        //handle event
        this.handlleEvent();
        //load current song
        this.loadCurrentSong(this.CurrentSong);
        //load UI for config 
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
      }
      
}; 


app.start();


