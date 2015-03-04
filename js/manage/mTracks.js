/**
 * Created by Dylan on 10/02/2015.
 */

var oneSecond = 5;
var pixelTimeBar = {g: 0, d: 633};
var lastZoom = 5;

function addTrack() {
    var idTrack1 = (currentProject.tabListTracks.length > 0) ? (currentProject.tabListTracks[currentProject.tabListTracks.length - 1].id + 1) : 0;
    var idTrack2 = idTrack1 + 1;

    var videoInfo = document.createElement('div');
    videoInfo.id = 'videoInfo' + idTrack1;
    videoInfo.classList.add('singleTrack');
    videoInfo.innerHTML = '<div class="valuesTrack"><span>VIDEO ' + idTrack1 + '</span></div><div class="optionsTrack"><button type="button" onclick="settingsTrack(' + idTrack1 + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrackModal(' + idTrack1 + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';

    var videoView = document.createElement('canvas');
    videoView.id = 'videoView' + idTrack1;
    videoView.classList.add('singleTrack');

    videoView.onmousedown = mouseDown;
    videoView.onmouseup = mouseUp;
    videoView.onmousemove = mouseMove;

    videoView.ondragover = allowDrop;
    videoView.ondrop = dropFile;

    videoView.oncontextmenu = showContextMenu;

    videoView.width = 633;
    videoView.height = 120;

    var contextVideoView = videoView.getContext('2d');
    contextVideoView.width = 633;
    contextVideoView.height = 120;

    document.getElementById('videoInfo').appendChild(videoInfo);
    document.getElementById('videoView').appendChild(videoView);

    currentProject.tabListTracks.push(new Track(idTrack1, TYPE.VIDEO, {element: videoView, context: contextVideoView}, idTrack2));

    drawElements(currentProject.tabListTracks.length - 1);

    var audioInfo = document.createElement('div');
    audioInfo.id = 'audioInfo' + idTrack2;
    audioInfo.classList.add('singleTrack');
    audioInfo.innerHTML = '<div class="valuesTrack"><span>AUDIO ' + idTrack2 + '</span></br><input type="range" step="1" onchange="updateVolumeTrack(' + idTrack2 + ', this.value);" min="1" max="100" class="form-control"><span class="posMinVolume">0</span><span class="posMaxVolume">100</span></div><div class="optionsTrack"><button type="button" onclick="settingsTrack(' + idTrack2 + ');" class="btn btn-link"><span class="glyphicon glyphicon-cog"></span></button><button type="button" onclick="deleteTrackModal(' + idTrack2 + ');" class="btn btn-link"><span class="glyphicon glyphicon-remove"></span></button></div>';

    var audioView = document.createElement('canvas');
    audioView.id = 'audioView' + idTrack2;
    audioView.classList.add('singleTrack');

    audioView.onmousedown = mouseDown;
    audioView.onmouseup = mouseUp;
    audioView.onmousemove = mouseMove;

    audioView.ondragover = allowDrop;
    audioView.ondrop = dropFile;

    audioView.oncontextmenu = showContextMenu;

    audioView.width = 633;
    audioView.height = 120;

    var contextAudioView = audioView.getContext('2d');
    contextAudioView.width = 633;
    contextAudioView.height = 120;

    document.getElementById('audioInfo').appendChild(audioInfo);
    document.getElementById('audioView').appendChild(audioView);

    currentProject.tabListTracks.push(new Track(idTrack2, TYPE.AUDIO, {element: audioView, context: contextAudioView}, idTrack1));

    drawElements(currentProject.tabListTracks.length - 1);
}

function updateVolumeTrack(id, valueVolume)
{
    console.log('updateVolumeTrack');

    currentProject.tabListTracks[id].upVolume(valueVolume);
}

function settingsTrack(id)
{
    console.log('settingsTrack');
}

function deleteTrackModal(id) {
    var parentTrack = currentProject.tabListTracks[rowById(currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)].parent, currentProject.tabListTracks)];

    document.getElementById('parentTrack').innerHTML = ((parentTrack.type == TYPE.VIDEO) ? 'VIDEO' : 'AUDIO') + ' ' + parentTrack.id;
    document.getElementById('buttonDeleteTrack').setAttribute('onclick', 'deleteTrack(' + id + ');');

    $('#deleteTrackModal').modal('show');
}

function deleteTrack(id) {
    $('#deleteTrackModal').modal('hide');

    var rowTrack1 = rowById(id, currentProject.tabListTracks);

    var videoInfo = document.getElementById('videoInfo');
    var videoView = document.getElementById('videoView');

    var audioInfo = document.getElementById('audioInfo');
    var audioView = document.getElementById('audioView');

    if(currentProject.tabListTracks[rowTrack1].type == TYPE.VIDEO)
    {
        videoInfo.removeChild(document.getElementById('videoInfo' + id));
        videoView.removeChild(document.getElementById('videoView' + id));
    }
    else
    {
        audioInfo.removeChild(document.getElementById('audioInfo' + id));
        audioView.removeChild(document.getElementById('audioView' + id));
    }

    if(currentProject.tabListTracks[rowTrack1].parent > -1)
    {
        var rowTrack2 = rowById(currentProject.tabListTracks[rowTrack1].parent, currentProject.tabListTracks);

        if(currentProject.tabListTracks[rowTrack2].type == TYPE.VIDEO)
        {
            videoInfo.removeChild(document.getElementById('videoInfo' + currentProject.tabListTracks[rowTrack1].parent));
            videoView.removeChild(document.getElementById('videoView' + currentProject.tabListTracks[rowTrack1].parent));
        }
        else
        {
            audioInfo.removeChild(document.getElementById('audioInfo' + currentProject.tabListTracks[rowTrack1].parent));
            audioView.removeChild(document.getElementById('audioView' + currentProject.tabListTracks[rowTrack1].parent));
        }

        currentProject.tabListTracks.remove(rowTrack2);
    }

    currentProject.tabListTracks.remove(rowTrack1);
}

//ZOOM
function changeZoom(zoom) {
    document.getElementById('zoomRange').value = zoom;

    lastZoom = oneSecond;
    oneSecond = zoom;

    calculateTimeBar();
    calculateElementsPixel();

    console.log(oneSecond);
}

function zoomPlus() {
    if (parseInt(document.getElementById('zoomRange').value) < 10) {

        lastZoom = oneSecond;
        oneSecond = parseInt(document.getElementById('zoomRange').value) + 1;

        document.getElementById('zoomRange').value = oneSecond;

        calculateTimeBar();
        calculateElementsPixel();
    }

    console.log(oneSecond);
}

function zoomMoins() {
    if (parseInt(document.getElementById('zoomRange').value) > 1) {

        lastZoom = oneSecond;
        oneSecond = parseInt(document.getElementById('zoomRange').value) - 1;

        document.getElementById('zoomRange').value = oneSecond;

        calculateTimeBar();
        calculateElementsPixel();
    }

    console.log(oneSecond);
}


//SCROLL
function plusScroll() {
    console.log('plusScroll');

    pixelTimeBar.g += 2;
    pixelTimeBar.d += 2;

    calculateTimeBar();
    drawElementsTracks();
}

function lessScroll() {
    if(pixelTimeBar.g >= 2)
    {
        pixelTimeBar.g -= 2;
        pixelTimeBar.d -= 2;

        calculateTimeBar();
        drawElementsTracks();
    }
}


//TIME BAR
function calculateTimeBar() {
    var timeGauche = Math.floor(pixelTimeBar.g / oneSecond);
    var timeDroit = Math.floor(pixelTimeBar.d / oneSecond);
    console.log(timeDroit, timeGauche);
    // calcule du temp a droite !
    var heure = Math.floor(timeDroit / 3600)
    timeDroit = timeDroit - (3600 * heure);
    var minutes = Math.floor(timeDroit / 60)
    timeDroit = timeDroit - (60 * minutes);
    var seconde = timeDroit
    document.getElementById('endTime').innerHTML = heure + 'h' + minutes + "m" + seconde + "s";
    var heure = Math.floor(timeGauche / 3600)
    timeGauche = timeGauche - (3600 * heure);
    var minutes = Math.floor(timeGauche / 60)
    timeGauche = timeGauche - (60 * minutes);
    var seconde = timeGauche
    document.getElementById('startTime').innerHTML = heure + 'h' + minutes + "m" + seconde + "s";
}

function calculateElementsPixel() {
    for(var i = 0; i < currentProject.tabListTracks.length; i++)
    {
        for(var x = 0; x < currentProject.tabListTracks[i].tabElements.length; x++)
        {
            var element = currentProject.tabListTracks[i].tabElements[x];

            element.width = (element.width / lastZoom) * oneSecond;
            element.minWidth = (element.minWidth / lastZoom) * oneSecond;
            element.maxWidth = (element.maxWidth / lastZoom) * oneSecond;

            element.marginLeft = (element.marginLeft / lastZoom) * oneSecond;
        }

        drawElements(i);
    }
}

function drawElementsTracks() {
    for(var i = 0; i < currentProject.tabListTracks.length; i++)
    {
        drawElements(i);
    }
}

function allowDrop(e) {
    var id = parseInt(this.id.replace('videoView', '').replace('audioView', ''));
    var fileId = parseInt(e.dataTransfer.getData('fileId'));

    var track = currentProject.tabListTracks[rowById(id, currentProject.tabListTracks)];
    var file = currentProject.tabListFiles[rowById(fileId, currentProject.tabListFiles)];

    if((file.isVideo && track.type == TYPE.VIDEO) || (file.isAudio && track.type == TYPE.AUDIO))
    {
        e.preventDefault();
    }
}

function dropFile(e) {
    e.preventDefault();

    addElement(parseInt(e.dataTransfer.getData('fileId')), parseInt(this.id.replace('videoView', '').replace('audioView', '')), undefined, 0);
}