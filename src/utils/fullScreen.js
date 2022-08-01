//全屏
const fullele = () => {
  return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || null;
};

//判断是否全屏
const isFullScreen = () => {
  return !!(document.webkitIsFullScreen || fullele());
};
//退出全屏
const exitFullscreen = () => {
  if (document.exitFullScreen) {
    document.exitFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};
//全屏
const full = ele => {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  }
};
//切换是否全屏 全屏按钮要执行的方法
const toggleFullScreen = () => {
  if (isFullScreen()) {
    exitFullscreen();
  } else {
    full(document.getElementById('dataMointor')); //要设置全屏的元素
  }
};
export { toggleFullScreen, full, exitFullscreen, fullele, isFullScreen };
