/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */

var globalData = {};
globalData.presenterAspectRatio = 0;

chrome.app.runtime.onLaunched.addListener(function(launchData) {
      
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      frame: 'none',
      innerBounds: {
        minHeight: 550,
        minWidth: 1110
      }
    }, 
    function(win) {
      
      win.onClosed.addListener(function() {
        console.log('closed main window');
        chrome.app.window.get('presenter').close();
      });
    }
  );
  
});