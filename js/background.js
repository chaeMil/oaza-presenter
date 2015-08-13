/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */

var globalData = {};
 
console.log(chrome.runtime.getPlatformInfo.os);
 
chrome.app.runtime.onLaunched.addListener(function(launchData) {

  chrome.runtime.getPlatformInfo(function(info) {
    globalData.os = info.os;
    globalData.appId = chrome.runtime.id;
    
    presenterWindow = chrome.app.window.create(
      'layouts/presenter.html',
      {
        id: 'presenter',
        frame: 'none',
        innerBounds: {
          minHeight: 480,
          minWidth: 640
        },
      },
      function(win) {
        //win.fullscreen();
        
        win.onClosed.addListener(function() {
          console.log('closed presenter window');
        });
      }
    );
    
    mainWindow = chrome.app.window.create(
      'index.html',
      {
        id: 'mainWindow',
        frame: 'none',
        innerBounds: {
          minHeight: 470,
          minWidth: 500
        },
      }, 
      function(win) {
        
        win.onClosed.addListener(function() {
          console.log('closed main window');
          chrome.app.window.get('presenter').close();
        });
      }
    );
    
  });

});