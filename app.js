var app = (function app(){
    "use strict";
    var btn, res, input, apiKey = "5f390c1426c1c76d9c9ed6d233fadf44";
    var normalizeIt, getData, gotIt, getData2, searchIt;

    window.onload = function getData(){
        input = select("input");
        btn = byId("search");
        btn.onclick = searchIt;

        input.value = "";
        byId("here").innerHTML="";

        //Requête classique, au load
        var req = "https://gateway.marvel.com:443/v1/public/characters?limit=100&apikey="+apiKey;
        $.get(req,function(data){
            gotIt(data, "b")//Récupération des infos
        });

        byId("reset").onclick = getData;
        selectAll(".page").forEach(function(page){
            page.addEventListener('click', getData2, false);
        })
    }
    
    getData2 = function getData2(){
        var req = "https://gateway.marvel.com:443/v1/public/characters?limit=100&offset="+(this.id-1)+"00&apikey="+apiKey;
        byId("here").innerHTML="";
        //Requête page
        $.get(req,function(data){
            gotIt(data, "b")//Récupération des infos
        });
    }

    gotIt = function gotIt(data, option){
        //On check ce qu'on va afficher
        if(option==="a"){
            var search = input.value;
            res = data.data.results;
            byId('here').innerHTML="";
            input.value="";
            res.forEach(function(data){
                //on set une variable suivant la longueur du mot cherché
                var i, length=null;
                for(i=0;i<normalizeIt(search).length;i+=1){
                    if(length===null){
                        length = "normalizeIt(data.name).charAt(0) === normalizeIt(search).charAt(0)"
                    }else if(length!==null){
                        length += "&&normalizeIt(data.name).charAt("+i+") === normalizeIt(search).charAt("+i+")"
                    }
                }
                //On créé la carte
                if(eval(length)){
                    var card = document.createElement("div");
                    card.className = "card";
                    card.id = data.id;

                    var name = document.createElement("h3");
                    name.textContent = data.name;
                    var tof = document.createElement("img");
                    tof.src = data.thumbnail.path+"."+data.thumbnail.extension;
                    var links = document.createElement("div");
                    links.className = "links";
                    links.id = "links"+data.id;

                    byId("here").appendChild(card);            
                    byId(data.id).appendChild(name);            
                    byId(data.id).appendChild(tof);            
                    byId(data.id).appendChild(links);  

                    data.urls.forEach(function(one){
                        var inf = document.createElement("a");
                        inf.href = one.url;
                        inf.target = "_blank";
                        if(one.type === "detail"){
                            inf.className = "fa fa-search-plus fa-2x"
                        }else if(one.type === "wiki"){
                            inf.className = "fa fa-wikipedia-w fa-2x"
                        }else if(one.type === "comiclink"){
                            inf.className = "fa fa-book fa-2x"
                        }
                        byId("links"+data.id).appendChild(inf)
                    })

                    var desc = document.createElement("div");
                    if(data.description !== ""){
                        desc.textContent = data.description
                    }else{
                        desc.textContent = "No description available";
                        desc.style.color = "red"
                    }
                    desc.className = "text";
                    byId(data.id).appendChild(desc)
                }
            })
        }else if(option==="b"){
            //Création simple au load
            res = data.data.results;
            log(res);
            res.forEach(function(data){
                var card = document.createElement("div");
                card.className = "card";
                card.id = data.id;

                var name = document.createElement("h3");
                name.textContent = data.name;
                var tof = document.createElement("img");
                tof.src = data.thumbnail.path+"."+data.thumbnail.extension;
                var links = document.createElement("div");
                links.className = "links";
                links.id = "links"+data.id;

                byId("here").appendChild(card);            
                byId(data.id).appendChild(name);            
                byId(data.id).appendChild(tof);            
                byId(data.id).appendChild(links);  

                data.urls.forEach(function(one){
                    var inf = document.createElement("a");
                    inf.href = one.url;
                    inf.target = "_blank";
                    if(one.type === "detail"){
                        inf.className = "fa fa-search-plus fa-2x"
                    }else if(one.type === "wiki"){
                        inf.className = "fa fa-wikipedia-w fa-2x"
                    }else if(one.type === "comiclink"){
                        inf.className = "fa fa-book fa-2x"
                    }
                    byId("links"+data.id).appendChild(inf)
                })

                var desc = document.createElement("div");
                if(data.description !== ""){
                    desc.textContent = data.description
                }else{
                    desc.textContent = "No description available";
                    desc.style.color = "red"
                }
                desc.className = "text";
                byId(data.id).appendChild(desc);
            })
        }
    }

    //On échape les caractères spéciaux, les accents et on met tout en minuscules
    normalizeIt = function normalizeIt(string){
        return string.toLowerCase().replace(/[ùûü]/g,"u").replace(/[îï]/g,"i").replace(/[àâä]/g,"a").replace(/[ôö]/g,"o").replace(/[éèêë]/g,"e").replace(/ç/g,"c").replace(/[()-." "]/g,"")
    }

    //On lance la requête pour vérifier la saisie
    searchIt = function searchIt(){
        var search = input.value;
        var req = "https://gateway.marvel.com:443/v1/public/characters?apikey="+apiKey;
        $.get(req,function(data){
            gotIt(data, "a")
        });
    }
    }());