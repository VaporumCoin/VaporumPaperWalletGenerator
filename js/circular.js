var randomBar = new ProgressBar.Circle('#random-bar', {
    color: '#D1D5D8',
    trailColor: '#54606E',
    duration: 500,
    easing: 'easeOut',
    strokeWidth: 5,
    fill: '#2F6565',
});

var randomseeder = function(evt) {
    if (!evt) var evt = window.event;
    var timeStamp = new Date().getTime();

    if (ninja.seeder.seedCount >= ninja.seeder.seedLimit) {
        document.removeEventListener('mousemove', randomseeder);
        document.removeEventListener('keypress', randomseeder); 
        ninja.seeder.seedCount++;
        randomBar.setText('100%');
        // randomBar.text.style.marginLeft = 0;
        // randomBar.text.style.marginTop = 0;
        randomBar.text.className += ' randombar_finished';

        document.querySelector('#generateseed').style.opacity = 0;
        document.querySelector('#generateseed').style.visibility = 'hidden';

        setInterval(function() {
            ninja.wallets.singlewallet.open();
            document.querySelector('#menu').style.visibility = 'visible';
            document.querySelector('#generatetext').style.display = 'none';
            document.querySelector('#generatedtext').style.display = 'block';
            document.querySelector('#generatedheader').style.display = 'block';
            document.querySelector('#generateseed').style.display = 'none';
        }, 1000)
    } else if ((ninja.seeder.seedCount < ninja.seeder.seedLimit) && evt && (timeStamp - ninja.seeder.lastInputTime) > 40) {
        SecureRandom.seedTime();

        if (evt.type == 'keypress') {
            SecureRandom.seedInt8(evt.which);
            var keyPressTimeDiff = timeStamp - ninja.seeder.lastInputTime;
            SecureRandom.seedInt8(keyPressTimeDiff);
            var hex = (evt.which * keyPressTimeDiff).toString(16).substr(-2);
        } else { //mousemove
            SecureRandom.seedInt16((evt.clientX * evt.clientY));
            var hex = (evt.clientX * evt.clientY).toString(16).substr(-2);
        }
        ninja.seeder.seedCount++;
        ninja.seeder.lastInputTime = new Date().getTime();

        var progress = ninja.seeder.seedCount / ninja.seeder.seedLimit;
        var randomLeft = (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 77);
        var randomTop = (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 77);

        randomBar.animate(progress);

        var element = document.createElement("div");
        element.className = 'randombar_text';
        element.style.marginLeft = randomLeft + 'px';
        element.style.marginTop = randomTop + 'px';
        element.appendChild(document.createTextNode(hex));
        document.querySelector('#random-innertext').appendChild(element);
        element.style.opacity = 1;
        element.style.visibility = 'visible';

        setInterval(function() {
            element.style.opacity = 0;
            element.style.visibility = 'hidden';
        }, 100)

        // randomBar.text.style.marginLeft = randomLeft + 'px';
        // randomBar.text.style.marginTop = randomTop + 'px';

        // console.log(Crypto.util.bytesToHex(SecureRandom.pool)); 
    }
}

document.querySelector('#newaddresshero').addEventListener('click', function() {
    document.querySelector('#generatedheader').style.display = 'none';
    document.querySelector('#generateseed').style.display = 'block';
    document.addEventListener('mousemove', randomseeder);
    document.addEventListener('keypress', randomseeder); 
});
