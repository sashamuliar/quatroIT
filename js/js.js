var headerMenu = document.getElementById('headerMenu');
var headerMenuClasses = readClasses(headerMenu);
var humbIcon = document.getElementById('humb-icon');
var humbGroup = document.getElementById('humb-group');
var sidebar = document.getElementById('sidebar');
var sideClasses = readClasses(sidebar);
var main = document.getElementById('main');
var mainClasses = readClasses(main);
var spoiler = document.querySelector('.spoiler');
var slider = document.getElementById('sliderBoy');
var arrowLeft = document.getElementById('arrowLeft');
var arrowRight = document.getElementById('arrowRight');
var headerWrap = document.getElementById('headerWrap');
var headerWrapInit = readClasses(headerWrap);
var paused = false;
var i = 0;
var interval = 3000;                                        //interval between slides
var bullets = document.getElementById('bullets');
var spoilerLines = document.querySelectorAll('.spoiler_title');
var spoilerInit = readChildClasses(spoiler);
var arrowInit = readChildClasses(spoilerLines[0]);
var replySlider = document.getElementById('reply-slider');
var replyLeft = document.getElementById('replyLeft');
var replyRight = document.getElementById('replyRight');
var replyInitClasses = readClasses(replySlider.children[1]);

window.addEventListener('scroll', function(){
  if (pageYOffset >= 235) {
    headerWrap.className = headerWrapInit + ' fixed';
    main.style.marginTop = '100px';
  }  else {
    headerWrap.className = headerWrapInit;
    main.style.marginTop = '0px';
  }
});

humbIcon.addEventListener('click', function(){
  if (i % 2 == 0) {
    humbGroup.setAttribute('class', 'active');
    activate(sidebar, 'show');
    activate(main, 'menuOpen');
  } else {
    sidebar.className = sideClasses;
    humbGroup.removeAttribute('class');
    main.className = mainClasses;
  }
  i++;
});

replyRight.addEventListener('click', moveReplyNext);
replyLeft.addEventListener('click', moveReplyPrev);

for (var a = 0; a < spoilerLines.length; a++){
  spoilerLines[a].addEventListener('click', toogleSpoiler);
};

activator(slider, bullets);
activate(spoiler.children[1], 'open');

function toogleSpoiler(){
   deactivate(spoiler, spoilerInit);
   for (var i = 0; i < spoilerLines.length; i++){
     deactivate(spoilerLines[i], arrowInit);
   }
   if ((getComputedStyle(this.nextSibling.nextSibling).maxHeight) === '0px'){
     activate(this.nextSibling.nextSibling, 'open');
     activate(this.children[0], 'reverse');
   };
};

function findNodeIndex(node){                                                         //defines index of node in parent node
  var i = 1;
  while (node = node.previousSibling){
      if (node.nodeType === 1) { ++i }
  }
  return i - 1;
};

function readClasses(node){                                                          //save clases of node
  return node.className;
};

function readChildClasses(node){                                                     //keeps initial names of childs clases
  var clases = [];
  for (var i = 0; i < childCount(node); i++){
    clases.push(node.children[i].className)
  }
  return clases;
};

function activate(node, className){                                                  //adds some class to node
  node.className += ' ' + className;
};

function activateChild(node, index, className){                                      //adds class to current child
  node.children[index].className += ' ' + className;
};

function activateZFwd(node, node2){                                                  // finds node with the biggest zIndex number and adds 'fwd' class to it
  for (var i = 0; i < childCount(node); i++){
    if (node.children[i].style.zIndex == childCount(node) - 1){
      activateChild(node, i, 'fwd');
      if (node2){
        if (i == childCount(node) - 1){
          activateChild(node2, 0, 'active');
        } else {
          activateChild(node2, i + 1, 'active');
        };
      };
    };
  };
};

function activateZRev(node, node2){                                                  // finds node with the biggest zIndex number and adds 'rev' class to it
  for (var i = 0; i < childCount(node); i++){
    if (node.children[i].style.zIndex == childCount(node) - 1){
      activateChild(node, i, 'rev');
      if (node2){
        activateChild(node2, i, 'active');
      };
    };
  };
};

function moveNextSlide(node, node2, nodeInit, node2Init, scanned, nextScanned){      // moves next slide
  deactivate(node, nodeInit);
  deactivateByOne(node2, node2Init);
  scanned = readZIndexes(node);
  if (!nextScanned){
    writeZIndexes(node, scanned);
    nextScanned = scanned;
  } else {
    nextScanned = moveNextZ(scanned);
    writeZIndexes(node, nextScanned);
  }
  activateZFwd(node, node2);
  return nextScanned;
};

function movePrevSlide(node, node2, nodeInit, node2Init, scanned, prevScanned){     //move previous slide
  deactivate(node, nodeInit);
  deactivateByOne(node2, node2Init);
  scanned = readZIndexes(node);
  if (!prevScanned){
    writeZIndexes(node, scanned);
    prevScanned = scanned;
  } else {
    prevScanned = movePrevZ(scanned);
    writeZIndexes(node, prevScanned);
  }
  activateZRev(node, node2);
  return prevScanned;
};

function deactivate(node, clases){                                                   //removes active class form all childrens by array
  for (var i = 0; i < childCount(node); i++){
    node.children[i].className = clases[i];
  }
};

function deactivateByOne(node, clases){                                             //removes active class from all childrens by string
  for (var i = 0; i < childCount(node); i++){
    node.children[i].className = clases;
  }
};

function readZIndexes(node){                                                        //save zIndexes of childrens
  var indexes = [];
  for (var i = 0; i < childCount(node); i++) {
    indexes.push(Number(node.children[i].style.zIndex));
  };
  return indexes;
};

function createIndexes(node, startIndex){                                            //indicates children's indexes and return them to array
  var indexes = [];
  for (var i = childCount(node) - 1; i >= 0 ; i--) {
    indexes.push(i);
  };
  if (startIndex) {
    for (var a = 0; a < startIndex; a++){
      indexes = moveNextZ(indexes);
    };
  };
  return indexes;
};

function writeZIndexes(node, indexArr){                                              //gives zIndex to all children with manual arr of indexes
  for (var i = 0; i < indexArr.length; i++) {
    node.children[i].style.zIndex = indexArr[i];
  };
};

function moveNextZ(arr){                                                             //moves last element of the array to the start
  return arr.slice(arr.length - 1, arr.length).concat(arr.slice(0, arr.length - 1));
};

function movePrevZ(arr){
  return arr.slice(1, arr.length).concat(arr.slice(0, 1));                           //moves first element of the array to the end
};

function childCount(node){                                                           //counts number of childrens
  return node.children.length;
};

function hasClass(node, className){                                                  //check if node does have special class
  return new RegExp('(\\s|^)' + className + '(\\s|$)').test(node.className);
}


function activator(node, node2){                                                      //main slider's algorithm, activates a slider
  var indexes = createIndexes(node);
  writeZIndexes(node, indexes);
  var initialClasses = readChildClasses(node);
  var initialClasses2 = readClasses(node2.children[1]);
  var activeNow = 0;
  var scanned;
  var nextScanned;
  var prevScanned;
  var tick = setInterval(function(){
    if (!paused){
    nextScanned = moveNextSlide(node, node2, initialClasses, initialClasses2, scanned, nextScanned);
    prevScanned = undefined;
      for (var c = 0; c < childCount(node2); c++){
        if (hasClass(node2.children[c], 'active')){
          activeNow = findNodeIndex(node2.children[c]);
        };
      };
    };
  }, interval);
  for (var b = 0; b < childCount(bullets); b++){
    bullets.children[b].addEventListener('click', function(){
      paused = true;
      var multiplier = activeNow - findNodeIndex(this);
      if (multiplier > 0){
        for (var z = 0; z < multiplier; z++){
          setTimeout(function(){
            prevScanned = movePrevSlide(node, node2, initialClasses, initialClasses2, scanned, prevScanned);
          }, z * 500);
        }
        nextScanned = undefined;
      } else if (multiplier < 0) {
        for (var z = 0; z + multiplier < 0; z++){
          setTimeout(function(){
            nextScanned = moveNextSlide(node, node2, initialClasses, initialClasses2, scanned, nextScanned);
          }, z * 500);
        }
        prevScanned = undefined;
      }
      activeNow = findNodeIndex(this);
    })
  };
};

function moveReplyNext(){                                                             //moves next slide of reply slider
  for (var i = 0; i < childCount(replySlider); i++){
    if (hasClass(replySlider.children[i], 'active')) {
      deactivateByOne(replySlider, replyInitClasses);
      if (i === childCount(replySlider) - 1) {
        activateChild(replySlider , 0 , 'active');
        break;
      } else {
        activateChild(replySlider, i + 1, 'active');
        break;
      };
    };
  };
};

function moveReplyPrev(){                                                             //moves previous slide of reply slider
  for (var i = 0; i < childCount(replySlider); i++){
    if (hasClass(replySlider.children[i], 'active')) {
      deactivateByOne(replySlider, replyInitClasses);
      if (i === 0) {
        activateChild(replySlider , childCount(replySlider) - 1, 'active');
        break;
      } else {
        activateChild(replySlider, i - 1, 'active');
        break;
      };
    };
  };
};
